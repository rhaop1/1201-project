import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { forumPosts, forumCategories } from '../data/content';

export default function ForumPostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [replies, setReplies] = useState([
    {
      id: 1,
      author: '연구자1',
      content: '좋은 질문입니다. 관련 논문을 참고하시면 도움이 될 것 같습니다.',
      date: '2025-12-04',
      likes: 3,
    },
    {
      id: 2,
      author: '연구자2',
      content: '저도 비슷한 의문을 가지고 있었습니다. 함께 토론해봅시다.',
      date: '2025-12-05',
      likes: 1,
    },
  ]);
  const [newReply, setNewReply] = useState('');

  // 게시물 찾기
  const post = forumPosts.find((p) => p.id === parseInt(postId));
  const category = forumCategories.find((c) => c.id === post?.category);

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          게시물을 찾을 수 없습니다.
        </h1>
        <Link to="/forum" className="text-blue-600 hover:text-blue-700 font-medium">
          게시판으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!newReply.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }

    const reply = {
      id: replies.length + 1,
      author: '현재 사용자',
      content: newReply,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };

    setReplies([...replies, reply]);
    setNewReply('');
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/forum"
          className={`inline-flex items-center gap-2 mb-4 transition ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          ← 게시판으로 돌아가기
        </Link>

        <div
          className={`p-6 rounded-lg border ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {/* 카테고리 배지 */}
          <div className="mb-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                isDark
                  ? 'bg-blue-900 text-blue-300'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {category?.name}
            </span>
          </div>

          {/* 제목 */}
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {post.title}
          </h1>

          {/* 게시물 정보 */}
          <div className={`flex flex-wrap gap-4 mb-6 pb-6 border-b ${
            isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
          } text-sm`}>
            <div>
              <span className="font-medium">작성자:</span> {post.author}
            </div>
            <div>
              <span className="font-medium">날짜:</span> {post.date}
            </div>
            <div>
              <span className="font-medium">댓글:</span> {post.replies}개
            </div>
            <div>
              <span className="font-medium">조회:</span> {post.views || 0}회
            </div>
          </div>

          {/* 게시물 내용 */}
          <div className={`prose prose-sm ${isDark ? 'prose-invert' : ''} max-w-none mb-8`}>
            <div className={`${isDark ? 'text-gray-200' : 'text-gray-700'} leading-7 whitespace-pre-wrap`}>
              {post.content}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 댓글 작성 폼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`p-6 rounded-lg border ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          댓글 작성
        </h2>
        <form onSubmit={handleReplySubmit} className="space-y-4">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="댓글을 입력해주세요..."
            rows="4"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            댓글 등록
          </button>
        </form>
      </motion.div>

      {/* 댓글 목록 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          댓글 {replies.length}개
        </h2>

        {replies.map((reply) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className={`flex justify-between items-start mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } text-sm`}>
              <div>
                <span className="font-medium">{reply.author}</span>
                <span className="ml-4">{reply.date}</span>
              </div>
              <button
                className={`transition ${
                  isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                👍 {reply.likes}
              </button>
            </div>
            <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} leading-6`}>
              {reply.content}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
