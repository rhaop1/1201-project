import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Bookmarks() {
  const { isDark } = useTheme();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/users/bookmarks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('북마크를 불러올 수 없습니다.');
      }

      const data = await response.json();
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      const response = await fetch(`/api/users/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('북마크 삭제 실패');
      }

      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        북마크
      </h1>

      {error && (
        <div className={`mb-4 p-4 rounded-lg ${
          isDark
            ? 'bg-red-900 text-red-200 border border-red-700'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {error}
        </div>
      )}

      {loading ? (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          로딩 중...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="mb-4">아직 북마크가 없습니다.</p>
          <Link
            to="/concepts"
            className={`px-4 py-2 rounded-lg inline-block transition ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            콘텐츠 찾아보기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className={`p-6 rounded-lg border transition ${
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {bookmark.title}
                  </h2>

                  <p className={`text-sm mb-3 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    유형: <span className="font-medium">
                      {bookmark.type === 'paper' ? '논문' : '이론'}
                    </span>
                  </p>

                  <p className={`line-clamp-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {bookmark.description}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={bookmark.type === 'paper' ? `/papers/${bookmark.slug}` : `/concepts/${bookmark.slug}`}
                    className={`px-4 py-2 rounded-lg transition ${
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white text-sm`}
                  >
                    보기
                  </Link>

                  <button
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    className={`px-4 py-2 rounded-lg transition ${
                      isDark
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white text-sm`}
                  >
                    삭제
                  </button>
                </div>
              </div>

              <p className={`text-xs mt-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                북마크 추가: {new Date(bookmark.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
