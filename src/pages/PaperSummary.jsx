import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { extractTextFromPDF, summarizePaper } from '../utils/aiSummaryService';
import { db } from '../config/firebase';
import { getCurrentUser } from '../utils/auth';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PAGE_LIMIT = 15;

export default function PaperSummary() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [method, setMethod] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [communitySummaries, setCommunitySummaries] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const summariesRef = collection(db, 'paperSummaries');
    const summariesQuery = query(summariesRef, orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(
      summariesQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCommunitySummaries(items);
        setFeedLoading(false);
      },
      (err) => {
        console.error('요약 피드 구독 실패:', err);
        setFeedLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const formatTimestamp = (stamp) => {
    if (!stamp) return '방금 전';
    if (stamp.toDate) {
      return stamp
        .toDate()
        .toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return new Date(stamp).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setTitle(selectedFile.name.replace('.pdf', ''));
        setError(null);
      } else {
        setError('PDF 파일만 업로드 가능합니다.');
        setFile(null);
      }
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      setError('PDF 파일을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      // PDF에서 텍스트 추출
      const text = await extractTextFromPDF(file);
      
      if (!text || text.trim().length < 100) {
        throw new Error('추출된 텍스트가 너무 짧습니다. 다른 PDF를 시도해주세요.');
      }

      // AI 요약
      const result = await summarizePaper(text);
      setSummary(result.summary);
      setMethod(result.method);
    } catch (err) {
      setError(err.message || '요약 생성 중 오류가 발생했습니다.');
      console.error('요약 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSummary = async () => {
    if (!summary) {
      setError('먼저 요약을 생성해주세요.');
      return;
    }
    if (!user?.email) {
      setError('요약을 게시하려면 로그인해주세요.');
      return;
    }

    try {
      setUploadStatus('loading');
      await addDoc(collection(db, 'paperSummaries'), {
        title: title || '제목 없는 요약',
        summary,
        method,
        authorEmail: user.email,
        authorName: user.username || user.email.split('@')[0],
        createdAt: serverTimestamp(),
        publishedAt: new Date().toISOString(),
      });
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2500);
    } catch (err) {
      console.error('요약 업로드 실패:', err);
      setError('요약 업로드 중 문제가 발생했습니다.');
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-50 pt-24 pb-12">
      <motion.div
        className="max-w-4xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          📄 논문 요약 AI
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          PDF 파일을 업로드하면 AI가 자동으로 논문을 요약해드립니다.
        </p>

        {/* PDF 업로드 섹션 */}
        <motion.div
          className="bg-gray-50 dark:bg-dark-100 rounded-lg p-8 mb-8 border-2 border-dashed border-blue-400"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer block"
            >
              <div className="text-6xl mb-4">📑</div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                PDF 파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                (최대 {PAGE_LIMIT}페이지만 분석됩니다)
              </p>
            </label>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-400">
              <p className="text-blue-900 dark:text-blue-100">
                ✓ 선택됨: <strong>{file.name}</strong>
              </p>
            </div>
          )}
        </motion.div>

        {/* 요약 버튼 */}
        <div className="flex gap-4 mb-8">
          <motion.button
            onClick={handleSummarize}
            disabled={!file || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {loading ? '⏳ 요약 생성 중...' : '🚀 AI로 요약하기'}
          </motion.button>
          <motion.button
            onClick={() => {
              setFile(null);
              setTitle('');
              setSummary(null);
              setError(null);
            }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            🔄 초기화
          </motion.button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <strong>오류:</strong> {error}
          </motion.div>
        )}

        {/* 요약 결과 */}
        {summary && (
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">✨</span>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  방식: {method === 'AI' ? '🤖 AI 요약 (Hugging Face)' : '📋 규칙 기반 요약'}
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-100 p-4 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {summary}
              </p>
            </div>

            {/* 저장 옵션 */}
            <div className="mt-4 flex flex-wrap gap-2">
              <motion.button
                onClick={() => {
                  const element = document.createElement('a');
                  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(summary));
                  element.setAttribute('download', `${title}_summary.txt`);
                  element.style.display = 'none';
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition text-sm"
              >
                💾 요약 저장
              </motion.button>
              <motion.button
                onClick={() => {
                  navigator.clipboard.writeText(summary);
                  alert('요약이 복사되었습니다!');
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition text-sm"
              >
                📋 복사
              </motion.button>
              <motion.button
                onClick={handlePublishSummary}
                disabled={uploadStatus === 'loading' || !summary}
                whileHover={{ scale: summary ? 1.05 : 1 }}
                className={`py-2 px-4 rounded transition text-sm font-semibold ${
                  uploadStatus === 'success'
                    ? 'bg-emerald-600 text-white'
                    : uploadStatus === 'loading'
                    ? 'bg-gray-400 text-gray-100'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {uploadStatus === 'success' ? '✅ 게시 완료' : uploadStatus === 'loading' ? '업로드 중...' : '📤 페이지에 게시'}
              </motion.button>
            </div>
            {!user && <p className="text-xs text-yellow-600 mt-2">로그인하면 요약을 페이지에 게시할 수 있습니다.</p>}
          </motion.div>
        )}

        {/* 공유된 요약 */}
        <motion.div
          className="mt-12 bg-gray-50 dark:bg-dark-100 rounded-lg p-6 border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">📰 최신 커뮤니티 요약</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">최대 15개가 표시됩니다</span>
          </div>
          {feedLoading ? (
            <p className="text-sm text-gray-500">요약을 불러오는 중...</p>
          ) : communitySummaries.length === 0 ? (
            <p className="text-sm text-gray-500">아직 게시된 요약이 없습니다. 첫 요약을 공유해보세요!</p>
          ) : (
            <div className="space-y-4">
              {communitySummaries.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.authorName || '익명 연구자'} · {formatTimestamp(item.createdAt || item.publishedAt)}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                      {item.method === 'AI' ? 'AI 요약' : 'Rule 기반'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 사용 가이드 */}
        <motion.div
          className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📖 사용 방법
          </h3>
          <ol className="space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>1.</strong> 위에서 논문 PDF 파일을 선택합니다</li>
            <li><strong>2.</strong> "AI로 요약하기" 버튼을 클릭합니다</li>
            <li><strong>3.</strong> AI가 자동으로 논문을 분석하고 요약합니다</li>
            <li><strong>4.</strong> 요약된 내용을 저장하거나 복사할 수 있습니다</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 <strong>팁:</strong> PDF 파일은 최대 5페이지만 분석됩니다. 
              영어 논문이 한국어보다 더 정확한 요약을 생성합니다.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
