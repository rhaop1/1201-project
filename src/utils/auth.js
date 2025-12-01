/**
 * 인증 유틸리티 모듈
 * JWT 토큰 관리, axios 인터셉터, 권한 확인 함수
 */

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

/**
 * 로컬스토리지에서 토큰 가져오기
 */
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * 로컬스토리지에 토큰 저장
 */
export const setToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * 토큰 삭제 (로그아웃)
 */
export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * 현재 사용자 정보 가져오기
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 사용자 정보 저장
 */
export const setCurrentUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * 사용자 정보 삭제 (로그아웃)
 */
export const removeCurrentUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * 사용자가 로그인되어 있는지 확인
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * 토큰이 유효한지 확인 (기본적인 검증)
 * 실제로는 백엔드에서 토큰 검증을 수행해야 함
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // JWT는 3개 부분으로 나뉨: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // payload 디코딩
    const payload = JSON.parse(atob(parts[1]));
    
    // 만료 시간 확인
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // 밀리초 단위
      const currentTime = Date.now();
      return currentTime < expirationTime;
    }

    return true;
  } catch (err) {
    console.error('토큰 검증 실패:', err);
    return false;
  }
};

/**
 * 토큰에서 사용자 정보 추출 (디코딩)
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (err) {
    console.error('토큰 디코딩 실패:', err);
    return null;
  }
};

/**
 * 사용자 역할 확인
 */
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;

  if (typeof requiredRole === 'string') {
    return user.role === requiredRole;
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }

  return false;
};

/**
 * 사용자가 특정 권한을 가지고 있는지 확인
 */
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;

  const rolePermissions = {
    admin: ['view_all', 'edit_all', 'delete_all', 'manage_users', 'moderate_board'],
    moderator: ['view_all', 'moderate_board', 'edit_posts', 'delete_posts'],
    user: ['view_all', 'create_post', 'edit_own', 'delete_own'],
  };

  const permissions = rolePermissions[user.role] || [];
  return permissions.includes(permission);
};

/**
 * 로그아웃
 */
export const logout = () => {
  removeToken();
  removeCurrentUser();
};

/**
 * Axios 인터셉터 설정
 * API 요청에 자동으로 Authorization 헤더 추가
 */
export const setupAxiosInterceptor = (axiosInstance) => {
  // 요청 인터셉터
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 401 에러 (권한 없음) - 토큰 갱신 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 토큰 갱신 요청
          const response = await axiosInstance.post('/api/auth/refresh', {
            token: getToken(),
          });

          const { token: newToken } = response.data;
          setToken(newToken);

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신 실패 - 로그아웃
          logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * API 기본 옵션 (헤더 포함)
 */
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * 인증된 fetch 요청
 * fetch API를 사용하면서 자동으로 토큰 추가
 */
export const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 401 에러 처리
    if (response.status === 401) {
      // 토큰 갱신 시도
      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: getToken() }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setToken(data.token);

          // 원래 요청 재시도 (새 토큰 사용)
          headers.Authorization = `Bearer ${data.token}`;
          return fetch(url, {
            ...options,
            headers,
          });
        } else {
          // 갱신 실패 - 로그아웃
          logout();
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('토큰 갱신 실패:', err);
        logout();
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};
