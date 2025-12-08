import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { virtualLogin, getDummyAccountInfo } from '../utils/virtualAuth';

export default function Login() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

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

      // virtualAuth를 사용한 로그인 시도
      try {
        const user = await virtualLogin(formData.email, formData.password);
        
        // 로그인 성공
        const userData = {
          uid: user.uid,
          email: user.email,
          username: user.username,
          role: user.role || 'user',
          authProvider: 'virtual',
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('isAuthenticated', 'true');

        console.log('✅ 로그인 성공 (Virtual Auth):', userData.username);
        window.dispatchEvent(new Event('auth-change'));

        setTimeout(() => navigate('/'), 500);
      } catch (virtualErr) {
        console.error('Virtual auth 실패:', virtualErr);
        setError('로그인 실패: 등록되지 않은 계정이거나 비밀번호가 잘못되었습니다.');
        setLoading(false);
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 중 오류가 발생했습니다.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const dummyAccount = getDummyAccountInfo();

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

        {/* 더미 계정 정보 */}
        {!showDemoInfo && (
          <motion.button
            type="button"
            onClick={() => setShowDemoInfo(true)}
            className={`w-full text-xs py-2 px-3 rounded border transition-colors duration-200 ${
              isDark
                ? 'border-blue-600 text-blue-400 hover:bg-blue-600/10'
                : 'border-blue-500 text-blue-600 hover:bg-blue-50'
            }`}
          >
            💡 데모 계정 확인
          </motion.button>
        )}

        {showDemoInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded text-sm border-l-4 transition-colors duration-200 ${
              isDark
                ? 'bg-blue-900/30 border-blue-600 text-blue-200'
                : 'bg-blue-50 border-blue-500 text-blue-800'
            }`}
          >
            <div className="font-semibold mb-2">데모 계정으로 시험해보세요:</div>
            <div className="font-mono text-xs space-y-1">
              <div>📧 {dummyAccount.email}</div>
              <div>🔑 {dummyAccount.password}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowDemoInfo(false)}
              className="mt-2 text-xs opacity-70 hover:opacity-100"
            >
              ✕ 닫기
            </button>
          </motion.div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm border-l-4 transition-colors duration-200 ${
              isDark
                ? 'bg-red-900/30 border-red-600 text-red-200'
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
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
      </motion.div>
    </div>
  );
}
