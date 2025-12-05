import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { conceptsData, paperSamples } from '../data/content';
import {
  animationPresets,
  containerVariants,
  itemVariants,
} from '../utils/animations';

export default function Home() {
  const { isDark } = useTheme();
  const featuredConcepts = conceptsData.slice(0, 3);

  // 초기화: 테스트 사용자 계정 생성
  useEffect(() => {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (!storedUsers) {
      const initialUsers = {
        [btoa('test@example.com')]: {
          email: 'test@example.com',
          password: btoa('Test1234'), // 간단한 인코딩
          username: '연구자',
          affiliation: '천문학 연구소',
          createdAt: new Date().toISOString(),
        },
      };
      localStorage.setItem('registeredUsers', JSON.stringify(initialUsers));
      console.log('✓ 테스트 계정 초기화됨: test@example.com / Test1234');
    }
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero */}
      <section className="py-8 sm:py-12 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
            천체물리학 허브
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 px-4"
        >
          핵심 개념, 최신 논문, 함께하는 학습 커뮤니티
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/concepts"
              className="block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg hover:shadow-xl"
            >
              개념 탐색
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/papers"
              className="block px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition font-medium shadow-lg hover:shadow-xl"
            >
              논문 요약
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 주요 섹션 소개 */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
      >
        {[
          {
            title: '개념 학습',
            description: '항성, 은하, 우주론의 핵심 개념을 수식과 관측 사례와 함께 정리',
            icon: '📚',
          },
          {
            title: '논문 요약',
            description: '최신 연구를 배경·방법·결과로 구조적으로 요약. 직접 요약 생성도 가능',
            icon: '📄',
          },
          {
            title: '커뮤니티',
            description: '질문, 토론, 학습 자료 공유의 게시판. 함께 성장하는 학습 공간',
            icon: '👥',
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className={`p-6 rounded-lg border transition ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                : 'bg-white border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.title}
            </h3>
            <p className={`text-sm sm:text-base ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* 주요 개념 미리보기 */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        >
          주요 개념
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {featuredConcepts.map((concept) => (
            <motion.div
              key={concept.slug}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={`p-6 rounded-lg border transition cursor-pointer ${
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                  : 'bg-white border-gray-200 hover:border-blue-500'
              }`}
            >
              <Link to={`/concepts/${concept.slug}`}>
                <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {concept.title}
                </h3>
                <p className={`text-sm sm:text-base ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {concept.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 최신 논문 미리보기 */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        >
          최신 논문 요약
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-4"
        >
          {paperSamples.map((paper) => (
            <motion.div
              key={paper.id}
              variants={itemVariants}
              whileHover={{ x: 8 }}
              className={`p-4 sm:p-6 rounded-lg border transition ${
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-orange-500'
                  : 'bg-white border-gray-200 hover:border-orange-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                    {paper.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {paper.authors} ({paper.year})
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded whitespace-nowrap ${
                  isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {paper.year}
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-3 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {paper.abstract}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/papers"
              className="inline-block px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition font-medium shadow-lg hover:shadow-xl"
            >
              더 많은 논문 보기
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
