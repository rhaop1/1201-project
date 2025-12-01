import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { conceptsData } from '../data/content';
import {
  animationPresets,
  containerVariants,
  itemVariants,
} from '../utils/animations';

export default function Concepts() {
  const { isDark } = useTheme();

  const categories = {
    relativity: '일반상대성이론',
    stars: '항성물리학',
    galaxies: '은하동역학',
    cosmology: '우주론',
    observations: '관측천문학',
  };

  const categoryColors = {
    relativity: 'from-red-500 to-pink-500',
    stars: 'from-yellow-500 to-orange-500',
    galaxies: 'from-purple-500 to-indigo-500',
    cosmology: 'from-blue-500 to-cyan-500',
    observations: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          천체물리학 개념
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-sm sm:text-base ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          현대 천체물리학의 5개 핵심 주제, 14개 세부 이론을 연구자 수준으로 다룹니다.
        </motion.p>
      </motion.div>

      {/* 카테고리별 섹션 */}
      {Object.entries(categories).map(([catKey, catName], sectionIndex) => {
        const items = conceptsData.filter((c) => c.category === catKey);
        if (items.length === 0) return null;

        return (
          <motion.section
            key={catKey}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* 카테고리 제목 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className={`inline-block bg-gradient-to-r ${categoryColors[catKey]} p-0.5 rounded-lg`}>
                <div className={`px-4 py-2 rounded-md ${
                  isDark ? 'bg-gray-900' : 'bg-white'
                }`}>
                  <h2 className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${categoryColors[catKey]} bg-clip-text text-transparent`}>
                    {catName}
                  </h2>
                </div>
              </div>
            </motion.div>

            {/* 개념 카드 그리드 */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              {items.map((concept, itemIndex) => (
                <motion.div
                  key={concept.slug}
                  variants={itemVariants}
                  whileHover={{ y: -12, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' }}
                  className={`group relative overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                    isDark
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500'
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-500'
                  }`}
                >
                  {/* 배경 그래디언트 오버레이 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[catKey]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* 카드 내용 */}
                  <Link to={`/concepts/${concept.slug}`} className="relative block p-6">
                    {/* 카테고리 배지 */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        isDark
                          ? 'bg-gray-700 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {catName}
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      {concept.title}
                    </h3>

                    {/* 설명 */}
                    <p className={`text-sm sm:text-base line-clamp-2 mb-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {concept.description}
                    </p>

                    {/* 키포인트 미리보기 */}
                    <div className={`text-xs space-y-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {concept.content.keyPoints.slice(0, 2).map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          <span className="line-clamp-1">{point}</span>
                        </div>
                      ))}
                      {concept.content.keyPoints.length > 2 && (
                        <div className="text-blue-500 font-medium">
                          + {concept.content.keyPoints.length - 2}개 더...
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        );
      })}
    </div>
  );
}
