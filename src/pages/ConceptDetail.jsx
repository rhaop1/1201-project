import { useParams } from 'react-router-dom';
import { conceptsData } from '../data/content';
import MathDisplay from '../components/MathDisplay';

export default function ConceptDetail() {
  const { slug } = useParams();
  const concept = conceptsData.find((c) => c.slug === slug);

  if (!concept) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-300">개념을 찾을 수 없습니다.</div>;
  }

  const { content } = concept;

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{concept.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{concept.description}</p>
      </div>

      {/* 개요 */}
      <section className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">개요</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{content.overview}</p>
      </section>

      {/* 핵심 포인트 */}
      <section className="px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">핵심 포인트</h2>
        <ul className="space-y-2">
          {content.keyPoints.map((point, idx) => (
            <li key={idx} className="flex gap-3 text-sm sm:text-base">
              <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">•</span>
              <span className="text-gray-700 dark:text-gray-300">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 수식 */}
      {content.keyFormulas && content.keyFormulas.length > 0 && (
        <section className="px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">핵심 공식</h2>
          <div className="space-y-4">
            {content.keyFormulas.map((formula, idx) => (
              <div key={idx} className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg overflow-x-auto">
                <MathDisplay tex={formula.tex} />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">{formula.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 관측 사례 */}
      <section className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">관측 사례</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{content.observations}</p>
      </section>

      {/* 관련 논문 */}
      {content.relatedPapers && content.relatedPapers.length > 0 && (
        <section className="px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">관련 논문</h2>
          <ul className="space-y-2">
            {content.relatedPapers.map((paper, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300 border-l-2 border-blue-600 dark:border-blue-400 pl-4 text-sm sm:text-base">
                {paper}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
