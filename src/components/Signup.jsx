import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { gitHubPageSignUp, saveLoginState } from '../utils/firebaseAuthGitHub';

export default function Signup() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    affiliation: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [authMethod, setAuthMethod] = useState('auto'); // 'auto', 'firebase', 'local'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력해주세요.';
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자명은 3자 이상이어야 합니다.';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!formData.email.includes('@')) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '약관에 동의해주세요.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      let registered = false;
      let error = null;

      // Firebase 시도
      if (authMethod === 'auto' || authMethod === 'firebase') {
        try {
          const user = await gitHubPageSignUp(formData.email, formData.password, {
            username: formData.username,
            affiliation: formData.affiliation,
          });

          console.log('✓ 회원가입 성공:', user.username);
          registered = true;
        } catch (firebaseErr) {
          console.warn('Firebase 회원가입 실패:', firebaseErr.message);
          error = firebaseErr.message;
          
          if (authMethod === 'firebase') {
            setErrors({ submit: firebaseErr.message });
            setLoading(false);
            return;
          }
          // auto 모드에서는 폴백 계속 진행
        }
      }

      // 로컬 저장소 시도 (Firebase 실패 시 또는 명시적 선택)
      if (!registered && (authMethod === 'auto' || authMethod === 'local')) {
        const users = JSON.parse(localStorage.getItem('firebaseUsers') || '{}');
        const userHash = btoa(formData.email);
        
        if (users[userHash]) {
          setErrors({ submit: '이미 등록된 이메일입니다.' });
          setLoading(false);
          return;
        }

        const newUser = {
          uid: 'local-' + Date.now(),
          email: formData.email,
          password: btoa(formData.password),
          username: formData.username,
          affiliation: formData.affiliation || '',
          bio: '',
          created_at: new Date().toISOString(),
          isLocal: true,
        };

        users[userHash] = newUser;
        localStorage.setItem('firebaseUsers', JSON.stringify(users));
        console.log('✓ 로컬 저장소 회원가입 성공');
        registered = true;
      }

      if (registered) {
        setSuccessMessage('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      setErrors({
        submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
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
            회원가입
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`transition-colors duration-200 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            천문물리학 연구 커뮤니티에 참가하세요
          </motion.p>
        </div>

        {/* 인증 방식 선택 */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-3">인증 방식 선택:</p>
          <div className="space-y-2">
            <label className={`flex items-center p-2 rounded cursor-pointer transition ${
              authMethod === 'auto'
                ? isDark ? 'bg-blue-800' : 'bg-blue-100'
                : isDark ? 'hover:bg-blue-900/50' : 'hover:bg-blue-50'
            }`}>
              <input
                type="radio"
                name="authMethod"
                value="auto"
                checked={authMethod === 'auto'}
                onChange={(e) => setAuthMethod(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">자동 (Firebase 우선)</span>
            </label>
            <label className={`flex items-center p-2 rounded cursor-pointer transition ${
              authMethod === 'firebase'
                ? isDark ? 'bg-blue-800' : 'bg-blue-100'
                : isDark ? 'hover:bg-blue-900/50' : 'hover:bg-blue-50'
            }`}>
              <input
                type="radio"
                name="authMethod"
                value="firebase"
                checked={authMethod === 'firebase'}
                onChange={(e) => setAuthMethod(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Firebase 만 사용</span>
            </label>
            <label className={`flex items-center p-2 rounded cursor-pointer transition ${
              authMethod === 'local'
                ? isDark ? 'bg-blue-800' : 'bg-blue-100'
                : isDark ? 'hover:bg-blue-900/50' : 'hover:bg-blue-50'
            }`}>
              <input
                type="radio"
                name="authMethod"
                value="local"
                checked={authMethod === 'local'}
                onChange={(e) => setAuthMethod(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">로컬 저장소만 사용</span>
            </label>
          </div>
        </div>

        {/* 성공 메시지 */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg dark:bg-green-900 dark:border-green-700 dark:text-green-200"
          >
            {successMessage}
          </motion.div>
        )}

        {/* 제출 에러 */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200"
          >
            {errors.submit}
          </motion.div>
        )}

        {/* 폼 */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* 사용자명 */}
          <div>
            <label htmlFor="username" className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              사용자명
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="학명 또는 닉네임"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1 dark:text-red-400">{errors.username}</p>
            )}
          </div>

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
              placeholder="your@institution.edu"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* 소속 기관 */}
          <div>
            <label htmlFor="affiliation" className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              소속 기관 (선택사항)
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              id="affiliation"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
              placeholder="대학, 연구소 등"
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
              } ${errors.password ? 'border-red-500' : ''}`}
            />
            <p className={`text-xs mt-1 transition-colors duration-200 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              최소 8자, 대문자/소문자/숫자 포함
            </p>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              비밀번호 확인
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1 dark:text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded"
            />
            <label htmlFor="agreeTerms" className={`ml-3 text-sm transition-colors duration-200 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              이용약관 및 개인정보처리방침에 동의합니다
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-600 text-sm mt-1 dark:text-red-400">{errors.agreeTerms}</p>
          )}

          {/* 회원가입 버튼 */}
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
            {loading ? '가입 중...' : '회원가입'}
          </motion.button>
        </motion.form>

        {/* 로그인 링크 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`text-center text-sm transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            로그인
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
