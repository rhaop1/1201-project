import { useState } from 'react';
import { paperSamples } from '../data/content';

export default function PaperSummary() {
  const [papers, setPapers] = useState(paperSamples);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    abstract: '',
  });

  const handleGenerateSummary = (e) => {
    e.preventDefault();
    if (!formData.abstract.trim()) {
      alert('초록/요지를 입력해주세요.');
      return;
    }

    const summary = generateSummary(formData.abstract);
    const newPaper = {
      id: papers.length + 1,
      title: formData.title || '사용자 요약',
      authors: 'User',
      year: new Date().getFullYear(),
      arxivId: '',
      abstract: formData.abstract,
      summary,
    };

    setPapers([newPaper, ...papers]);
    setFormData({ title: '', link: '', abstract: '' });
  };

  const generateSummary = (text) => {
    const sents = text.split(/[\.\!\?]+/).map((s) => s.trim()).filter(Boolean);

    const score = (s, keywords) =>
      keywords.reduce((acc, k) => acc + (s.toLowerCase().includes(k) ? 1 : 0), 0) +
      Math.min(1, s.length / 180);

    const pickTop = (keywords, fallbackLen = 2) => {
      const ranked = sents
        .map((s, i) => ({ s, i, sc: score(s, keywords) }))
        .sort((a, b) => b.sc - a.sc || a.i - b.i)
        .filter((x) => x.sc > 0)
        .slice(0, 2)
        .map((x) => x.s);
      return ranked.length ? ranked.join(' ') : sents.slice(0, fallbackLen).join(' ');
    };

    return {
      background: pickTop(['we define', 'we address', 'in this paper', '정의', '문제', '목표']),
      method: pickTop(['we propose', 'method', 'approach', '방법', '제안']),
      results: pickTop(['result', 'improve', 'outperform', '성능', '결과']),
      limitations: pickTop(['limitation', 'future work', '한계', '제약'], 1),
    };
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">논문 요약</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          논문 제목과 초록을 붙여넣으면 정의·특성 중심 요약을 자동 생성합니다.
        </p>
      </div>

      {/* 요약 생성 폼 */}
      <section className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-8 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">논문 요약 생성</h2>
        <form onSubmit={handleGenerateSummary} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">제목</label>
            <input
              type="text"
              placeholder="논문 제목을 입력"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-dark-300 px-4 py-2 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">링크 (선택)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-dark-300 px-4 py-2 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">초록/요지</label>
            <textarea
              rows="6"
              placeholder="초록 또는 주요 내용을 붙여넣기"
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-dark-300 px-4 py-2 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 dark:bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-700 text-white px-6 py-3 rounded font-bold transition text-sm sm:text-base"
          >
            요약 생성
          </button>
        </form>
      </section>

      {/* 논문 목록 */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">논문 요약 목록</h2>
        <div className="space-y-4 sm:space-y-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 flex-1">{paper.title}</h3>
                <span className="text-xs bg-gray-200 dark:bg-dark-300 text-gray-700 dark:text-gray-300 px-3 py-1 rounded whitespace-nowrap">
                  {paper.year}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                {paper.authors} {paper.arxivId && <span>· <a href={`https://arxiv.org/abs/${paper.arxivId}`} className="text-blue-600 dark:text-blue-400 hover:underline">{paper.arxivId}</a></span>}
              </p>

              {paper.summary && (
                <div className="space-y-3 bg-gray-50 dark:bg-dark-200 border border-gray-200 dark:border-dark-300 p-4 rounded text-sm">
                  <div>
                    <strong className="text-blue-600 dark:text-blue-300">연구 배경:</strong>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{paper.summary.background}</p>
                  </div>
                  <div>
                    <strong className="text-blue-600 dark:text-blue-300">연구 방법:</strong>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{paper.summary.method}</p>
                  </div>
                  <div>
                    <strong className="text-blue-600 dark:text-blue-300">핵심 결과:</strong>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{paper.summary.results}</p>
                  </div>
                  <div>
                    <strong className="text-blue-600 dark:text-blue-300">한계/의미:</strong>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{paper.summary.limitations}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
