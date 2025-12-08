/**
 * GitHub Pages용 Firebase 인증 (Hybrid 방식)
 * Firebase를 사용하되, 로컬스토리지 백업으로 오프라인 지원
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Firebase 에뮬레이터 연결 (개발 환경)
 */
export const initFirebaseEmulator = () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    } catch (error) {
      console.log('에뮬레이터 이미 연결됨');
    }
  }
};

/**
 * GitHub Pages용 회원가입 (Firebase + 로컬스토리지 백업)
 */
export const gitHubPageSignUp = async (email, password, userData) => {
  try {
    // 로컬스토리지에 지속성 설정
    await setPersistence(auth, browserLocalPersistence);

    let firebaseUser = null;
    try {
      // Firebase 시도
      const userCredential = await Promise.race([
        createUserWithEmailAndPassword(auth, email, password),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firebase timeout')), 5000)
        ),
      ]);
      firebaseUser = userCredential.user;
    } catch (fbError) {
      console.warn('Firebase 회원가입 실패, 로컬 저장으로 진행:', fbError.message);
      // Firebase 실패 시에도 계속 진행 (로컬 저장)
    }

    // 로컬스토리지에 백업 저장
    const users = JSON.parse(localStorage.getItem('firebaseUsers') || '{}');
    const userHash = btoa(email);
    
    if (users[userHash]) {
      throw new Error('이미 가입된 이메일입니다.');
    }

    const localUser = {
      uid: firebaseUser?.uid || 'local-' + Date.now(),
      email,
      password: btoa(password), // 간단한 인코딩 (실제로는 bcrypt 사용)
      username: userData.username,
      affiliation: userData.affiliation || '',
      bio: '',
      created_at: new Date().toISOString(),
      isLocal: !firebaseUser,
    };

    users[userHash] = localUser;
    localStorage.setItem('firebaseUsers', JSON.stringify(users));

    return {
      uid: localUser.uid,
      email: localUser.email,
      username: localUser.username,
      isLocal: localUser.isLocal,
    };
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw new Error(error.message || '회원가입 실패');
  }
};

/**
 * GitHub Pages용 로그인 (Firebase + 로컬스토리지)
 */
export const gitHubPageSignIn = async (email, password) => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    let firebaseUser = null;
    let isLocal = false;

    // Firebase 시도
    try {
      const userCredential = await Promise.race([
        signInWithEmailAndPassword(auth, email, password),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firebase timeout')), 5000)
        ),
      ]);
      firebaseUser = userCredential.user;
    } catch (fbError) {
      console.warn('Firebase 로그인 실패, 로컬 저장소 확인:', fbError.message);
      
      // 로컬스토리지에서 찾기
      const users = JSON.parse(localStorage.getItem('firebaseUsers') || '{}');
      const userHash = btoa(email);
      
      if (users[userHash]) {
        const savedUser = users[userHash];
        // 비밀번호 확인 (간단한 비교)
        if (btoa(password) === savedUser.password) {
          isLocal = true;
          firebaseUser = {
            uid: savedUser.uid,
            email: savedUser.email,
            displayName: savedUser.username,
          };
        } else {
          throw new Error('비밀번호가 잘못되었습니다.');
        }
      } else {
        throw new Error('등록되지 않은 계정입니다.');
      }
    }

    if (!firebaseUser) {
      throw new Error('로그인 실패');
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName || email.split('@')[0],
      isLocal,
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    throw new Error(error.message || '로그인 실패');
  }
};

/**
 * 로그아웃
 */
export const gitHubPageSignOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw new Error('로그아웃 실패');
  }
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export const getCurrentGitHubPageUser = () => {
  const savedUser = localStorage.getItem('currentUser');
  return savedUser ? JSON.parse(savedUser) : null;
};

/**
 * 사용자 로그인 상태 저장
 */
export const saveLoginState = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('authToken', user.uid);
};

export default {
  initFirebaseEmulator,
  gitHubPageSignUp,
  gitHubPageSignIn,
  gitHubPageSignOut,
  getCurrentGitHubPageUser,
  saveLoginState,
};
