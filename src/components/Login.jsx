import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { firebaseSignIn, getFirebaseUserData } from '../utils/firebaseService';

export default function Login() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 입력 검증
      if (!formData.email || !formData.password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        setLoading(false);
        return;
      }

      if (!formData.email.includes('@')) {
        setError('올바른 이메일 형식을 입력해주세요.');
        setLoading(false);
        return;
      }

      // Firebase 로그인 시도 (타임아웃 설정)
      let userData = null;
      let firebaseSuccess = false;

      try {
        const firebasePromise = firebaseSignIn(formData.email, formData.password);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firebase 타임아웃')), 3000)
        );

        const user = await Promise.race([firebasePromise, timeoutPromise]);
        userData = {
          uid: user.uid,
          email: user.email,
          username: user.username,
          role: user.role || 'user',
          affiliation: user.affiliation || '',
        };
        firebaseSuccess = true;
      } catch (firebaseErr) {
        console.warn('Firebase 로그인 실패 또는 타임아웃:', firebaseErr.message);
        // Firebase 실패 → 로컬스토리지 폴백
      }

      // Firebase 실패 시 로컬스토리지 폴백
      if (!firebaseSuccess) {
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        const userKey = btoa(formData.email);

        if (!storedUsers[userKey]) {
          // 테스트 계정 자동 생성
          if (formData.email === 'test@example.com' && formData.password === 'Test1234') {
            userData = {
              uid: userKey,
              email: formData.email,
              username: '테스트 사용자',
              role: 'user',
              affiliation: '테스트 계정',
            };
          } else {
            setError('등록되지 않은 계정입니다. 회원가입 후 이용해주세요.');
            setLoading(false);
            return;
          }
        } else {
          const storedUser = storedUsers[userKey];
          // 간단한 비교 (실제로는 bcrypt 사용)
          if (storedUser.password !== btoa(formData.password)) {
            setError('비밀번호가 잘못되었습니다.');
            setLoading(false);
            return;
          }

          userData = {
            uid: userKey,
            email: formData.email,
            username: storedUser.username,
            role: 'user',
            affiliation: storedUser.affiliation || '',
          };
        }
      }

      // 로컬스토리지에 사용자 정보 저장
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.uid);
        console.log('✓ 로그인 성공:', userData.username);

        // 이벤트 발생 후 네비게이션
        window.dispatchEvent(new Event('auth-change'));

        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md space-y-8 rounded-lg shadow-lg p-8 transition-colors duration-200 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* 헤더 */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            로그인
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`transition-colors duration-200 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            천문물리학 연구 플랫폼에 접속하세요
          </motion.p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200"
          >
            {error}
          </motion.div>
        )}

        {/* 폼 */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              이메일
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              비밀번호
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* 로그인 버튼 */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {loading ? '로그인 중...' : '로그인'}
          </motion.button>
        </motion.form>

        {/* 회원가입 링크 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`text-center text-sm transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            회원가입
          </Link>
        </motion.div>

        {/* 비밀번호 찾기 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`text-center text-sm transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <button 
            type="button"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            비밀번호 재설정
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
