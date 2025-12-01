/**
 * Firebase Authentication 서비스
 * Firebase를 사용한 인증 기능
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const USERS_COLLECTION = 'users';

/**
 * 사용자 등록
 */
export const firebaseSignUp = async (email, password, userData) => {
  try {
    // Firebase Auth에 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 프로필 업데이트
    await updateProfile(user, {
      displayName: userData.username,
    });

    // Firestore에 사용자 정보 저장
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      uid: user.uid,
      email: email,
      username: userData.username,
      affiliation: userData.affiliation || '',
      bio: '',
      avatar: '',
      reputation_score: 0,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return {
      uid: user.uid,
      email: user.email,
      username: userData.username,
    };
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw new Error(error.message || '회원가입 실패');
  }
};

/**
 * 로그인
 */
export const firebaseSignIn = async (email, password) => {
  try {
    // 로그인 지속성 설정
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore에서 사용자 정보 조회
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
    const userData = userDoc.data();

    return {
      uid: user.uid,
      email: user.email,
      username: userData?.username || user.displayName,
      role: userData?.role || 'user',
      affiliation: userData?.affiliation || '',
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    throw new Error(error.message || '로그인 실패');
  }
};

/**
 * 로그아웃
 */
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw new Error(error.message || '로그아웃 실패');
  }
};

/**
 * 인증 상태 변화 감시
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * 현재 사용자 가져오기
 */
export const getCurrentFirebaseUser = () => {
  return auth.currentUser;
};

/**
 * 사용자 정보 업데이트
 */
export const updateFirebaseUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    
    await updateDoc(userRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    throw new Error(error.message || '프로필 업데이트 실패');
  }
};

/**
 * 사용자 정보 조회
 */
export const getFirebaseUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    throw new Error(error.message || '사용자 정보 조회 실패');
  }
};

/**
 * Firestore 북마크 저장
 */
export const addBookmark = async (uid, bookmarkData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const bookmarks = userDoc.data().bookmarks || [];
    
    // 중복 확인
    const isDuplicate = bookmarks.some(
      b => b.id === bookmarkData.id && b.type === bookmarkData.type
    );

    if (isDuplicate) {
      throw new Error('이미 북마크되었습니다.');
    }

    await updateDoc(userRef, {
      bookmarks: [
        ...bookmarks,
        {
          ...bookmarkData,
          created_at: new Date().toISOString(),
        },
      ],
      updated_at: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('북마크 추가 오류:', error);
    throw new Error(error.message || '북마크 추가 실패');
  }
};

/**
 * 북마크 제거
 */
export const removeBookmark = async (uid, bookmarkId, bookmarkType) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const bookmarks = userDoc.data().bookmarks || [];
    const updatedBookmarks = bookmarks.filter(
      b => !(b.id === bookmarkId && b.type === bookmarkType)
    );

    await updateDoc(userRef, {
      bookmarks: updatedBookmarks,
      updated_at: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('북마크 제거 오류:', error);
    throw new Error(error.message || '북마크 제거 실패');
  }
};

/**
 * 게시물 저장
 */
export const savePost = async (postData) => {
  try {
    const postsCollection = collection(db, 'posts');
    
    const newPost = {
      ...postData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes: 0,
      replies: 0,
    };

    await setDoc(doc(postsCollection), newPost);
    return true;
  } catch (error) {
    console.error('게시물 저장 오류:', error);
    throw new Error(error.message || '게시물 저장 실패');
  }
};

/**
 * 카테고리별 게시물 조회
 */
export const getPostsByCategory = async (category) => {
  try {
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where('category', '==', category));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('게시물 조회 오류:', error);
    throw new Error(error.message || '게시물 조회 실패');
  }
};

/**
 * 댓글 저장
 */
export const saveComment = async (postId, commentData) => {
  try {
    const commentsCollection = collection(db, `posts/${postId}/comments`);
    
    const newComment = {
      ...commentData,
      created_at: new Date().toISOString(),
      likes: 0,
    };

    await setDoc(doc(commentsCollection), newComment);
    return true;
  } catch (error) {
    console.error('댓글 저장 오류:', error);
    throw new Error(error.message || '댓글 저장 실패');
  }
};
