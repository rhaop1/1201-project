import { useState } from 'react';
import { glossaryData } from '../data/content';

export default function Glossary() {
  const [search, setSearch] = useState('');

  const filtered = glossaryData.filter(
    (item) =>
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">용어 사전</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6">
          천체물리학의 핵심 개념과 용어를 명확하고 간결하게 정리했습니다.
        </p>

        {/* 검색창 */}
        <input
          type="search"
          placeholder="용어 또는 정의 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-dark-300 px-4 py-2 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
        />
      </div>

      {/* 용어 목록 */}
      <div className="space-y-3 sm:space-y-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg hover:shadow-md transition"
          >
            <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">{item.term}</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item.definition}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm sm:text-base">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {/* 통계 */}
      <div className="bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 rounded-lg text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
        총 {glossaryData.length}개 용어 · {filtered.length}개 검색 결과
      </div>
    </div>
  );
}
