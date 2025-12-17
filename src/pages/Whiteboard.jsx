import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser } from '../utils/auth';

const BOARD_ID = 'global-whiteboard';
const HEARTBEAT_INTERVAL_MS = 15000;
const PRESENCE_TIMEOUT_MS = 45000;

const createUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const heartbeatRef = useRef(null);
  const [strokes, setStrokes] = useState([]);
  const [activeStroke, setActiveStroke] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#0ea5e9');
  const [brushSize, setBrushSize] = useState(4);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('세션을 초기화하는 중입니다...');
  const [error, setError] = useState(null);
  const { isDark } = useTheme();
  const user = useMemo(() => getCurrentUser(), []);
  const presenceId = useMemo(createUUID, []);

  const sessionRef = useMemo(() => doc(db, 'whiteboardSessions', BOARD_ID), []);
  const strokesQuery = useMemo(
    () => query(collection(db, 'whiteboardSessions', BOARD_ID, 'strokes'), orderBy('createdAt')),
    []
  );
  const presenceCollection = useMemo(
    () => collection(db, 'whiteboardSessions', BOARD_ID, 'presence'),
    []
  );

  const ensureSessionDocument = useCallback(async () => {
    try {
      const snap = await getDoc(sessionRef);
      if (!snap.exists()) {
        await setDoc(sessionRef, {
          createdAt: serverTimestamp(),
          lastActivity: serverTimestamp(),
          title: 'Research Collaboration Whiteboard',
        });
      }
    } catch (err) {
      setError('화이트보드 세션을 준비하지 못했습니다. 새로고침을 시도해 주세요.');
      console.error(err);
    }
  }, [sessionRef]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }
    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, []);

  const drawStroke = useCallback((ctx, stroke) => {
    if (!stroke?.points?.length) {
      return;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.globalAlpha = stroke.opacity ?? 1;
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i += 1) {
      const point = stroke.points[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);

  const redrawCanvas = useCallback(
    (overlayStroke = null) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext('2d');
      const background = isDark ? '#020617' : '#f8fafc';
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      strokes.forEach((stroke) => drawStroke(ctx, stroke));
      if (overlayStroke) {
        drawStroke(ctx, overlayStroke);
      }
      ctx.restore();
    },
    [drawStroke, isDark, strokes]
  );

  useEffect(() => {
    resizeCanvas();
    redrawCanvas(activeStroke);
  }, [activeStroke, redrawCanvas, resizeCanvas]);

  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
      redrawCanvas(activeStroke);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeStroke, redrawCanvas, resizeCanvas]);

  useEffect(() => {
    ensureSessionDocument();
  }, [ensureSessionDocument]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      strokesQuery,
      (snapshot) => {
        const remoteStrokes = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          color: docSnap.data().color,
          size: docSnap.data().size,
          opacity: docSnap.data().opacity ?? 1,
          points: docSnap.data().points ?? [],
        }));
        setStrokes(remoteStrokes);
        setStatus('동기화 완료');
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('화이트보드 데이터를 불러오지 못했습니다.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [strokesQuery]);

  useEffect(() => {
    const presenceRef = doc(presenceCollection, presenceId);

    const registerPresence = async () => {
      try {
        await setDoc(
          presenceRef,
          {
            userId: user?.uid ?? presenceId,
            displayName: user?.username ?? '익명 연구자',
            affiliation: user?.affiliation ?? '',
            updatedAt: serverTimestamp(),
            joinedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error(err);
      }
    };

    const sendHeartbeat = async () => {
      try {
        await updateDoc(presenceRef, {
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error(err);
      }
    };

    registerPresence();
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(heartbeatRef.current);
      updateDoc(presenceRef, {
        updatedAt: serverTimestamp(),
        leftAt: serverTimestamp(),
      })
        .catch(() => {})
        .finally(() => deleteDoc(presenceRef).catch(() => {}));
    };
  }, [presenceCollection, presenceId, user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      presenceCollection,
      (snapshot) => {
        const now = Date.now();
        const activeParticipants = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((participant) => {
            if (!participant.updatedAt?.toMillis) {
              return false;
            }
            return now - participant.updatedAt.toMillis() < PRESENCE_TIMEOUT_MS;
          })
          .sort((a, b) => {
            const aTime = a.updatedAt?.toMillis?.() ?? 0;
            const bTime = b.updatedAt?.toMillis?.() ?? 0;
            return bTime - aTime;
          });
        setParticipants(activeParticipants);
      },
      (err) => console.error(err)
    );
    return () => unsubscribe();
  }, [presenceCollection]);

  const extractPoint = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }
    const rect = canvas.getBoundingClientRect();
    const { clientX, clientY } = event;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const handlePointerDown = (event) => {
    event.preventDefault();
    const point = extractPoint(event);
    if (!point) {
      return;
    }
    const stroke = {
      color: brushColor,
      size: brushSize,
      points: [point],
    };
    setActiveStroke(stroke);
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    if (!isDrawing) {
      return;
    }
    event.preventDefault();
    const point = extractPoint(event);
    if (!point) {
      return;
    }
    setActiveStroke((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        points: [...prev.points, point],
      };
    });
  };

  const persistStroke = useCallback(
    async (stroke) => {
      try {
        setStatus('변경 사항을 저장하는 중입니다...');
        await addDoc(collection(db, 'whiteboardSessions', BOARD_ID, 'strokes'), {
          color: stroke.color,
          size: stroke.size,
          opacity: stroke.opacity ?? 1,
          points: stroke.points,
          userId: user?.uid ?? 'guest',
          createdAt: serverTimestamp(),
        });
        await updateDoc(sessionRef, {
          lastActivity: serverTimestamp(),
        });
        setStatus('동기화 완료');
      } catch (err) {
        console.error(err);
        setError('획 저장에 실패했습니다. 연결 상태를 확인하세요.');
        setStatus('저장 실패');
      }
    },
    [sessionRef, user]
  );

  const handlePointerUp = (event) => {
    if (!isDrawing) {
      return;
    }
    event.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (err) {
        // ignored
      }
    }
    setIsDrawing(false);
    setActiveStroke((prev) => {
      if (prev && prev.points.length) {
        persistStroke(prev);
      }
      return null;
    });
  };

  const handlePointerLeave = (event) => {
    if (isDrawing) {
      handlePointerUp(event);
    }
  };

  const handleClearBoard = async () => {
    try {
      setStatus('화이트보드를 초기화하는 중입니다...');
      const strokeSnapshot = await getDocs(collection(db, 'whiteboardSessions', BOARD_ID, 'strokes'));
      const batch = writeBatch(db);
      strokeSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
      await batch.commit();
      await updateDoc(sessionRef, {
        lastActivity: serverTimestamp(),
      });
      setStatus('동기화 완료');
    } catch (err) {
      console.error(err);
      setError('화이트보드를 초기화하지 못했습니다.');
      setStatus('초기화 실패');
    }
  };

  const handleExportBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `whiteboard-export-${Date.now()}.png`;
    link.click();
  };

  useEffect(() => {
    setError(null);
  }, [brushColor, brushSize]);

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <section className="flex-1 space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">실시간 협업 화이트보드</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              연구팀이 동시에 수식 도출, 가설 설정, 관측 데이터 해석을 진행할 수 있는 공유 작업 공간입니다.
              모든 스트로크는 Firestore를 통해 실시간으로 동기화되며, 참여자 목록에서 현재 접속 중인 연구원을 확인할 수 있습니다.
            </p>
          </header>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <label htmlFor="brush-color" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  펜 색상
                </label>
                <input
                  id="brush-color"
                  type="color"
                  value={brushColor}
                  onChange={(event) => setBrushColor(event.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="brush-size" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  선 두께
                </label>
                <input
                  id="brush-size"
                  type="range"
                  min="2"
                  max="16"
                  value={brushSize}
                  onChange={(event) => setBrushSize(Number(event.target.value))}
                  className="h-9 w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{brushSize}px</span>
              </div>
              <button
                type="button"
                onClick={handleClearBoard}
                className="ml-auto inline-flex items-center gap-1 rounded-md bg-rose-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                보드 초기화
              </button>
              <button
                type="button"
                onClick={handleExportBoard}
                className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900"
              >
                PNG 내보내기
              </button>
            </div>

            <div className="relative overflow-hidden rounded-b-xl" ref={containerRef}>
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-sm font-medium text-slate-600 dark:bg-slate-900/80 dark:text-slate-200">
                  세션을 불러오는 중입니다...
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="h-[540px] w-full touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerLeave}
              />
            </div>
          </div>

          <footer className="space-y-1 text-sm">
            <p className="font-medium text-slate-700 dark:text-slate-200">상태: <span className="font-normal text-slate-600 dark:text-slate-300">{status}</span></p>
            {error && <p className="text-sm text-rose-500">{error}</p>}
          </footer>
        </section>

        <aside className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">참여 중인 연구원</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {participants.length > 0
                ? `현재 ${participants.length}명이 접속 중입니다.`
                : '활성 참여자가 없습니다. 링크를 공유해 팀을 초대하세요.'}
            </p>
          </div>
          <ul className="space-y-3">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
              >
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{participant.displayName}</p>
                  {participant.affiliation && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{participant.affiliation}</p>
                  )}
                  <p className="text-xs text-slate-400">최근 활동: {participant.updatedAt?.toDate?.().toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' }) ?? '정보 없음'}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            화이트보드 데이터는 Firestore에 저장되며, 실험 설계나 관측 계획 단계별 스냅숏을 내보내기 기능으로 보존할 수 있습니다.
          </div>
        </aside>
      </div>
    </div>
  );
}
