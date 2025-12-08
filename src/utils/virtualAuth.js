/**
 * 순수 로컬스토리지 기반 인증 시스템
 * Firebase 없이 작동하는 더미 계정
 */

// 기본 더미 계정
const DUMMY_ACCOUNT = {
  email: 'demo@astrophysics.hub',
  password: 'Demo12345',
  username: '천체물리 연구자',
  affiliation: 'Astrophysics Research Institute',
};

const AUTH_KEY = 'authToken';
const USER_KEY = 'currentUser';

/**
 * 더미 계정 로그인
 */
export const virtualLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === DUMMY_ACCOUNT.email && password === DUMMY_ACCOUNT.password) {
        const user = {
          uid: 'dummy-user-001',
          email: DUMMY_ACCOUNT.email,
          username: DUMMY_ACCOUNT.username,
          affiliation: DUMMY_ACCOUNT.affiliation,
          role: 'user',
          loginTime: new Date().toISOString(),
        };

        // 로컬스토리지 저장
        localStorage.setItem(AUTH_KEY, JSON.stringify({
          token: 'dummy-token-' + Date.now(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }));
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        resolve(user);
      } else {
        reject(new Error('이메일 또는 비밀번호가 일치하지 않습니다.'));
      }
    }, 500); // 네트워크 지연 시뮬레이션
  });
};

/**
 * 더미 계정 회원가입 (항상 실패 - 더미 계정만 사용)
 */
export const virtualSignup = (email, password, userData) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('더미 계정만 사용 가능합니다. demo@astrophysics.hub로 로그인해주세요.'));
    }, 500);
  });
};

/**
 * 로그아웃
 */
export const virtualLogout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export const getCurrentVirtualUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    const authStr = localStorage.getItem(AUTH_KEY);
    if (!authStr) return null;

    const auth = JSON.parse(authStr);
    if (new Date(auth.expiresAt) < new Date()) {
      // 토큰 만료됨
      virtualLogout();
      return null;
    }

    return user;
  } catch (e) {
    return null;
  }
};

/**
 * 로그인 상태 확인
 */
export const isVirtualUserLoggedIn = () => {
  return getCurrentVirtualUser() !== null;
};

/**
 * 더미 계정 정보 반환 (로그인 화면에서 표시용)
 */
export const getDummyAccountInfo = () => {
  return {
    email: DUMMY_ACCOUNT.email,
    password: DUMMY_ACCOUNT.password,
    username: DUMMY_ACCOUNT.username,
  };
};
