import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { forumCategories } from '../data/content';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getCurrentUser } from '../utils/auth';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', category: forumCategories[0]?.id ?? 1, content: '' });
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = getCurrentUser();

  const formatDate = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value.toDate) return value.toDate().toLocaleDateString('ko-KR');
    if (value instanceof Date) return value.toLocaleDateString('ko-KR');
    return new Date(value).toLocaleDateString('ko-KR');
  };

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
          replies: data.replies ?? 0,
        };
      });
      setPosts(loaded);
    } catch (err) {
      console.error('게시물 로드 실패:', err);
      setError('게시물을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    setSubmitting(true);
    try {
      const authorName = currentUser?.username || currentUser?.email || '익명 연구자';
      const payload = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: Number(newPost.category),
        author: authorName,
        authorEmail: currentUser?.email || null,
        replies: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'forumPosts'), payload);
      console.log('✅ 게시물 저장 완료:', docRef.id);

      const optimisticPost = {
        id: docRef.id,
        ...payload,
        createdAt: new Date(),
      };

      setPosts((prev) => [optimisticPost, ...prev]);
      setNewPost({ title: '', category: forumCategories[0]?.id ?? 1, content: '' });
      setShowForm(false);
      alert('게시물이 저장되었습니다.');
    } catch (error) {
      console.error('❌ 게시물 저장 실패:', error);
      console.error('오류 코드:', error.code);
      console.error('오류 메시지:', error.message);
      alert('게시물 저장에 실패했습니다: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">커뮤니티 게시판</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          천체물리학 이론, 관측 기법, 현대 연구, 수치 시뮬레이션 관련 학술적 질문과 토론을 나누는 공간입니다. 
        </p>
      </div>

      {/* 새 게시물 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition font-medium text-sm sm:text-base"
        >
          {showForm ? '취소' : '새 게시물 작성'}
        </button>
        <button
          onClick={loadPosts}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          새로고침
        </button>
      </div>

      {/* 게시물 작성 폼 */}
      {showForm && (
        <form onSubmit={handlePostSubmit} className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">제목</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-dark-300 px-4 py-2 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="게시물 제목"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">카테고리</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: parseInt(e.target.value) })}
              className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-dark-300 px-4 py-2 rounded text-gray-900 dark:text-white"
            >
              {forumCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">내용</label>
            <textarea
              rows="6"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-dark-300 px-4 py-2 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              placeholder="내용을 입력하세요"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700 disabled:bg-gray-500 text-white px-6 py-2 rounded font-bold transition text-sm sm:text-base"
          >
            {submitting ? '저장 중...' : '게시'}
          </button>
        </form>
      )}

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base ${
            selectedCategory === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-dark-300 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-200'
          }`}
        >
          전체
        </button>
        {forumCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base ${
              selectedCategory === cat.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-dark-300 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 게시물 목록 */}
      <div className="space-y-3 sm:space-y-4">
        {loading && <p className="text-sm text-gray-500 dark:text-gray-400">게시물을 불러오는 중...</p>}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed rounded-lg">
            선택한 카테고리에 게시물이 없습니다.
          </div>
        )}
        {!loading && filteredPosts.map((post) => (
          <Link key={post.id} to={`/forum/${post.id}`} state={{ post }}>
            <div className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300 p-4 sm:p-6 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs bg-gray-200 dark:bg-dark-300 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                      {forumCategories.find((c) => c.id === post.category)?.name || '기타'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 break-words">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{post.content}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {post.author} · {formatDate(post.createdAt)}
                  </p>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">댓글 {post.replies ?? 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
