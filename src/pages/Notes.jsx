import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser } from '../utils/auth';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';

export default function Notes() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNote, setNewNote] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState(''); // 저장 알림 상태

  // Firestore에서 현재 사용자의 노트만 로드
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const loadNotes = async () => {
      try {
        const q = query(collection(db, 'notes'), where('userEmail', '==', user.email));
        const snapshot = await getDocs(q);
        const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(loaded);
        console.log('✅ 사용자 노트 로드:', user.email, '개수:', loaded.length);
      } catch (error) {
        console.log('❌ Firestore 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [user?.email]);

  // 새 노트 생성
  const handleNewNote = () => {
    setNewNote(true);
    setSelectedNote(null);
    setEditTitle('');
    setEditContent('');
    setEditTags('');
  };

  // 노트 선택
  const handleSelectNote = (note) => {
    setSelectedNote(note.id);
    setNewNote(false);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
  };

  // 노트 저장
  const handleSaveNote = async () => {
    if (!editTitle.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    try {
      if (newNote) {
        // 새 노트 생성 - 사용자 이메일과 함께 저장
        const docRef = await addDoc(collection(db, 'notes'), {
          title: editTitle,
          content: editContent,
          tags: editTags.split(',').map(t => t.trim()).filter(t => t),
          userEmail: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        const newNoteObj = {
          id: docRef.id,
          title: editTitle,
          content: editContent,
          tags: editTags.split(',').map(t => t.trim()).filter(t => t),
          userEmail: user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedNotes = [newNoteObj, ...notes];
        setNotes(updatedNotes);
        setNewNote(false);
        setSelectedNote(newNoteObj.id);
        // 저장 완료 알림
        setSaveMessage('✅ 노트가 저장되었습니다!');
        setTimeout(() => setSaveMessage(''), 2000);
        console.log('✅ 노트 저장:', user.email, editTitle);
      } else if (selectedNote) {
        // 기존 노트 업데이트
        const noteRef = doc(db, 'notes', selectedNote);
        await updateDoc(noteRef, {
          title: editTitle,
          content: editContent,
          tags: editTags.split(',').map(t => t.trim()).filter(t => t),
          userEmail: user.email,
          updatedAt: serverTimestamp(),
        });
        const updatedNotes = notes.map(note =>
          note.id === selectedNote
            ? {
                ...note,
                title: editTitle,
                content: editContent,
                tags: editTags.split(',').map(t => t.trim()).filter(t => t),
                updatedAt: new Date().toISOString(),
              }
            : note
        );
        setNotes(updatedNotes);
        // 저장 완료 알림
        setSaveMessage('✅ 노트가 수정되었습니다!');
        setTimeout(() => setSaveMessage(''), 2000);
      }
    } catch (error) {
      console.error('노트 저장 실패:', error);
      setSaveMessage('❌ 저장에 실패했습니다.');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  // 노트 삭제
  const handleDeleteNote = async (id) => {
    if (confirm('이 노트를 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'notes', id));
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        if (selectedNote === id) {
          setSelectedNote(null);
          setNewNote(false);
        }
      } catch (error) {
        console.error('노트 삭제 실패:', error);
        alert('노트 삭제에 실패했습니다.');
      }
    }
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const containerClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';
  const labelClass = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="min-h-screen space-y-8">
      {/* 저장 알림 메시지 */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg font-semibold text-white z-50 ${
            saveMessage.includes('❌') 
              ? 'bg-red-600' 
              : 'bg-green-600'
          }`}
        >
          {saveMessage}
        </motion.div>
      )}

      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
          학습 노트
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          개념, 논문, 계산 내용을 정리하고 저장하세요
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 노트 목록 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`p-6 rounded-lg border ${containerClass}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">노트 목록</h2>
            <button
              onClick={handleNewNote}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              + 새 노트
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                노트가 없습니다.
              </p>
            ) : (
              notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedNote === note.id
                      ? isDark
                        ? 'bg-blue-900 border-blue-500'
                        : 'bg-blue-100 border-blue-400'
                      : isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } border`}
                >
                  <p className="font-semibold text-sm truncate">{note.title}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(note.updatedAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* 노트 편집 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`p-6 rounded-lg border lg:col-span-2 ${containerClass}`}
        >
          {(newNote || selectedNote) ? (
            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  제목
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="노트 제목을 입력하세요"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
              </div>

              {/* 태그 */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="예: 블랙홀, Kerr metric, 질량"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
              </div>

              {/* 내용 */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  내용
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="노트 내용을 입력하세요"
                  rows="12"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${inputClass}`}
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setNewNote(false);
                    setSelectedNote(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  취소
                </button>
                {selectedNote && (
                  <button
                    onClick={() => handleDeleteNote(selectedNote)}
                    className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white"
                  >
                    삭제
                  </button>
                )}
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-lg">노트를 선택하거나 새 노트를 만들어 시작하세요</p>
              <p className="text-sm mt-2">💡 팁: 개념, 논문 요약, 계산 과정을 정리해두면 나중에 복습하기 좋습니다!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* 태그 필터 */}
      {notes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`p-6 rounded-lg border ${containerClass}`}
        >
          <h3 className="text-lg font-bold mb-3">태그</h3>
          <div className="flex flex-wrap gap-2">
            {[
              ...new Set(
                notes
                  .flatMap(note => note.tags)
                  .sort()
              ),
            ].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  const filtered = notes.filter(n => n.tags.includes(tag));
                  if (filtered.length > 0) {
                    handleSelectNote(filtered[0]);
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  isDark
                    ? 'bg-gray-700 text-gray-200 hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
