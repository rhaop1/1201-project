import { references } from '../data/content';

export default function References() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">참고 자료</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          천체물리학 학습과 연구에 필요한 교과서, 데이터베이스, 도구들을 모았습니다.
        </p>
      </div>

      {/* 교과서 */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">추천 교과서</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {references.textbooks.map((book, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg hover:shadow-md transition"
            >
              <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                {book.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {book.authors} ({book.year})
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 데이터베이스 */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">데이터베이스 및 아카이브</h2>
        <div className="space-y-3 sm:space-y-4">
          {references.databases.map((db, idx) => (
            <a
              key={idx}
              href={db.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition"
            >
              <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">{db.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{db.desc}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 break-all">{db.url}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 도구 */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">관측 및 분석 도구</h2>
        <div className="space-y-3 sm:space-y-4">
          {references.tools.map((tool, idx) => (
            <a
              key={idx}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition"
            >
              <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">{tool.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{tool.desc}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 break-all">{tool.url}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
