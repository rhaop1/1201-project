import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, BarChart
} from 'recharts';

export default function Visualizations() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('cmb');

  // CMB 파워 스펙트럼 데이터
  const cmbData = [
    { l: 10, Cl: 2400 },
    { l: 50, Cl: 5000 },
    { l: 100, Cl: 5500 },
    { l: 150, Cl: 5200 },
    { l: 200, Cl: 4800 },
    { l: 300, Cl: 3500 },
    { l: 500, Cl: 2800 },
    { l: 800, Cl: 2200 },
    { l: 1000, Cl: 1800 },
    { l: 1500, Cl: 1200 },
    { l: 2000, Cl: 800 },
    { l: 2500, Cl: 500 },
  ];

  // 회전 곡선 데이터
  const rotationCurveData = [
    { r: 1, v_obs: 100, v_disk: 100, v_dm: 0 },
    { r: 2, v_obs: 140, v_disk: 130, v_dm: 40 },
    { r: 3, v_obs: 160, v_disk: 145, v_dm: 80 },
    { r: 4, v_obs: 170, v_disk: 155, v_dm: 110 },
    { r: 5, v_obs: 175, v_disk: 160, v_dm: 130 },
    { r: 6, v_obs: 178, v_disk: 162, v_dm: 145 },
    { r: 8, v_obs: 180, v_disk: 165, v_dm: 160 },
    { r: 10, v_obs: 180, v_disk: 166, v_dm: 170 },
    { r: 15, v_obs: 180, v_disk: 168, v_dm: 175 },
    { r: 20, v_obs: 180, v_disk: 169, v_dm: 178 },
  ];

  // HR 다이어그램 데이터
  const hrData = [
    { temp: 3000, mag: 15, type: 'Main Sequence' },
    { temp: 4000, mag: 10, type: 'Main Sequence' },
    { temp: 5500, mag: 4.8, type: 'Main Sequence' },
    { temp: 6500, mag: 3, type: 'Main Sequence' },
    { temp: 8000, mag: 1.5, type: 'Main Sequence' },
    { temp: 10000, mag: -1, type: 'Main Sequence' },
    { temp: 3500, mag: -2, type: 'Giants' },
    { temp: 4500, mag: -3, type: 'Giants' },
    { temp: 5500, mag: -4, type: 'Giants' },
    { temp: 3000, mag: -6, type: 'Supergiants' },
    { temp: 4000, mag: -7, type: 'Supergiants' },
    { temp: 20000, mag: 8, type: 'White Dwarfs' },
    { temp: 15000, mag: 10, type: 'White Dwarfs' },
    { temp: 8000, mag: 12, type: 'White Dwarfs' },
  ];

  // 중력파 파형
  const gwWaveformData = [
    { t: 0, h: 0.00001 },
    { t: 0.1, h: 0.000015 },
    { t: 0.2, h: 0.000025 },
    { t: 0.3, h: 0.000040 },
    { t: 0.4, h: 0.000065 },
    { t: 0.5, h: 0.000100 },
    { t: 0.6, h: 0.000150 },
    { t: 0.7, h: 0.000220 },
    { t: 0.8, h: 0.000320 },
    { t: 0.9, h: 0.000450 },
    { t: 1.0, h: 0.0005 },
  ];

  // 태외행성 통과 광도
  const exoplanetTransitData = Array.from({ length: 40 }, (_, i) => {
    const phase = ((i - 20) / 20);
    const transitDepth = 0.01;
    const flux = 1.0 - (transitDepth * Math.max(0, 1 - Math.abs(phase) * 1.5));
    return { phase: (phase).toFixed(2), flux: parseFloat(flux.toFixed(5)) };
  });

  // Type Ia 초신성 광곡선
  const sn1aLightCurveData = [
    { day: -10, mag: 20 },
    { day: -5, mag: 18 },
    { day: 0, mag: -19.3 },
    { day: 5, mag: -18.5 },
    { day: 10, mag: -17.8 },
    { day: 15, mag: -16.5 },
    { day: 20, mag: -15.2 },
    { day: 30, mag: -12 },
    { day: 40, mag: -8 },
    { day: 50, mag: -4 },
  ];

  // WIMP 검출 한계 (소수 위 데이터로 Recharts 호환)
  const wimpDetectionData = [
    { mass: 10, currentLimit: 1e-42, futureLimit: 1e-47 },
    { mass: 50, currentLimit: 1.5e-42, futureLimit: 1.2e-47 },
    { mass: 100, currentLimit: 1e-43, futureLimit: 1e-48 },
    { mass: 500, currentLimit: 2e-43, futureLimit: 1.5e-48 },
    { mass: 1000, currentLimit: 1e-44, futureLimit: 1e-49 },
  ];

  const colors = {
    grid: isDark ? '#374151' : '#e5e7eb',
    text: isDark ? '#d1d5db' : '#374151',
  };

  return (
    <div className="space-y-12">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
          천체물리 시각화 도구
        </h1>
        <p className={`text-sm sm:text-base ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          우주론, 항성물리, 관측, 암흑물질 검출의 인터랙티브 시각화 (7가지 주제)
        </p>
      </motion.div>

      {/* 탭 네비게이션 */}
      <div className="overflow-x-auto flex gap-2 border-b border-gray-300 dark:border-gray-700 pb-2">
        {[
          { id: 'cmb', label: 'CMB 스펙트럼', icon: '📊' },
          { id: 'rotation', label: '회전곡선', icon: '🌀' },
          { id: 'hr', label: 'HR 다이어그램', icon: '⭐' },
          { id: 'gw', label: '중력파', icon: '〰️' },
          { id: 'exoplanet', label: '태외행성', icon: '🪐' },
          { id: 'supernovae', label: 'SN Ia', icon: '💫' },
          { id: 'dm-wimp', label: '암흑물질', icon: '🔍' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? isDark
                  ? 'text-blue-400 border-blue-400'
                  : 'text-blue-600 border-blue-600'
                : isDark
                ? 'text-gray-400 border-transparent hover:text-gray-300'
                : 'text-gray-600 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* CMB 파워 스펙트럼 */}
      {activeTab === 'cmb' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">우주 마이크로파 배경 각파워스펙트럼</h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            다중극 모멘트 ℓ에 따른 온도 변동 전력. 첫 번째 피크는 우주 곡률 (Ω_k=0), 
            음향 봉우리는 물질 밀도를 결정합니다.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={cmbData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="l" label={{ value: 'ℓ (다중극 모멘트)', position: 'bottom', offset: 10 }} tick={{ fill: colors.text }} />
              <YAxis label={{ value: 'C_ℓ', angle: -90, position: 'insideLeft' }} tick={{ fill: colors.text }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: `1px solid ${isDark ? '#374151' : '#d1d5db'}` }} />
              <Legend />
              <Line type="monotone" dataKey="Cl" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="CMB Power" />
            </LineChart>
          </ResponsiveContainer>
          <div className={`mt-6 p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-semibold mb-2">📌 해석:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>첫 번째 피크</strong> (ℓ~220): 음향 지평선, 우주 크기 결정</li>
              <li>• <strong>진동</strong>: 초기 우주의 음파 공명</li>
              <li>• <strong>Ω_Λ h²=0.1197, Ω_m h²=0.1220</strong> (Planck 2018)</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* 은하 회전 곡선 */}
      {activeTab === 'rotation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">은하 회전 곡선과 암흑물질</h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            관측된 회전 속도(v_obs)는 원판만으로는 설명 불가. 암흑물질 할로(v_dm)가 외부 지역의 속도를 유지시킵니다.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={rotationCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="r" label={{ value: '반지름 r (kpc)', position: 'bottom', offset: 10 }} tick={{ fill: colors.text }} />
              <YAxis label={{ value: '속도 (km/s)', angle: -90, position: 'insideLeft' }} tick={{ fill: colors.text }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }} />
              <Legend />
              <Line type="monotone" dataKey="v_obs" stroke="#3b82f6" strokeWidth={3} name="관측 (Total)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="v_disk" stroke="#f59e0b" strokeWidth={2} name="원판 컴포넌트" />
              <Line type="monotone" dataKey="v_dm" stroke="#8b5cf6" strokeWidth={2} name="암흑물질" strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className={`mt-6 p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-semibold mb-2">📌 해석:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Flat rotation curve</strong>: 원판과 암흑물질의 기여도 조합</li>
              <li>• <strong>암흑물질 비율</strong>: 은하의 90%가 암흑물질</li>
              <li>• <strong>ΛCDM 성공</strong>: 암흑물질 할로로 자연스럽게 설명</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* HR 다이어그램 */}
      {activeTab === 'hr' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">Hertzsprung-Russell 다이어그램</h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            별의 온도(색지수)와 절대등급(내재 광도)의 관계. 별의 진화 경로를 보여줍니다.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart data={hrData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis type="number" dataKey="temp" name="온도 (K)" label={{ value: '표면 온도 (K)', position: 'bottom', offset: 10 }} tick={{ fill: colors.text }} />
              <YAxis type="number" dataKey="mag" name="절대등급" label={{ value: '절대 등급 (밝을수록 -)', angle: -90, position: 'insideLeft' }} tick={{ fill: colors.text }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }} />
              <Scatter name="주계열성" data={hrData.filter(d => d.type === 'Main Sequence')} fill="#ef4444" />
              <Scatter name="거성" data={hrData.filter(d => d.type === 'Giants')} fill="#f59e0b" />
              <Scatter name="초거성" data={hrData.filter(d => d.type === 'Supergiants')} fill="#ec4899" />
              <Scatter name="백색왜성" data={hrData.filter(d => d.type === 'White Dwarfs')} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
          <div className={`mt-6 p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-semibold mb-2">📌 해석:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>주계열성</strong>: 별의 대부분이 위치하는 진화 단계</li>
              <li>• <strong>거성/초거성</strong>: 핵 소진 후 팽창, 낮은 온도 높은 광도</li>
              <li>• <strong>백색왜성</strong>: 별의 최종 상태, 높은 온도 낮은 광도</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* 중력파 */}
      {activeTab === 'gw' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">중력파 변형률 (Binary BH Merger)</h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            쌍별 블랙홀 병합 중 LIGO 검출기가 감지하는 시공간 변형률 h(t). Chirp 신호로 알려져 있습니다.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={gwWaveformData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="t" label={{ value: '시간 (초)', position: 'bottom', offset: 10 }} tick={{ fill: colors.text }} />
              <YAxis scale="log" label={{ value: '변형률 h(t)', angle: -90, position: 'insideLeft' }} tick={{ fill: colors.text }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }} />
              <Line type="monotone" dataKey="h" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className={`mt-6 p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-semibold mb-2">📌 해석:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Chirp 신호</strong>: 주파수 증가 + 진폭 증가 (병합 직전)</li>
              <li>• <strong>GW150914</strong>: 36+29 M☉ BH 병합, SNR=24</li>
              <li>• <strong>신호 지속</strong>: LIGO 밴드폭(35-250 Hz)에서 ~100초</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* 태외행성 통과 */}
      {activeTab === 'exoplanet' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">태외행성 통과 광도 곡선 (Transit)</h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            행성이 항성 앞을 지나가며 광도가 ~0.01% 감소. Kepler, TESS로 5500+ 행성 발견.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={exoplanetTransitData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="phase" label={{ value: '궤도 위상', position: 'bottom', offset: 10 }} tick={{ fill: colors.text }} />
              <YAxis label={{ value: '상대 플럭스', angle: -90, position: 'insideLeft' }} tick={{ fill: colors.text }} domain={[0.989, 1.001]} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }} />
              <Line type="monotone" dataKey="flux" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className={`mt-6 p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-semibold mb-2">📌 해석:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>통과 깊이</strong>: ΔF/F = (R_p/R_*)² ~ 0.01% (지구)</li>
              <li>• <strong>행성 반지름</strong>: 통과 깊이로부터 측정</li>
              <li>• <strong>TESS 성과</strong>: 600+ 태외행성 발견 (계속 증가)</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Type Ia 초신성 */}
      {activeTab === 'supernovae' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">Type Ia 초신성 광곡선 (표준초)</h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            백색왜성 폭발의 광도 곡선. 최대 광도 M_V ≈ -19.3. Phillips 관계식으로 표준초 활용하여 우주 거리 측정.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={sn1aLightCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="day" label={{ value: '일수 (폭발 후)', position: 'bottom', offset: 10 }} tick={{ fill: colors.text }} />
              <YAxis label={{ value: '겉보기 등급 (어두울수록 +)', angle: -90, position: 'insideLeft' }} reversed tick={{ fill: colors.text }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }} />
              <Line type="monotone" dataKey="mag" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className={`mt-6 p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-semibold mb-2">📌 해석:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>표준초</strong>: Phillips 관계식으로 광도 보정 후 표준화</li>
              <li>• <strong>우주 가속팽창 발견</strong>: 1998년 Riess, Perlmutter (Nobel 2011)</li>
              <li>• <strong>H₀ 측정</strong>: SH0ES로 H₀ = 73.04±1.04 km/s/Mpc (2022)</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* 암흑물질 검출 */}
      {activeTab === 'dm-wimp' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">WIMP 직접 검출 한계 (XENON, LUX)</h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            WIMP-핵 산란 단면적의 상한 (현재 한계 vs 미래 목표). 질량 100 GeV에서 가장 민감한 영역.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={wimpDetectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="mass" scale="log" label={{ value: 'WIMP 질량 (GeV/c²)', position: 'bottom', offset: 10 }} tick={{ fill: colors.text }} />
              <YAxis scale="log" label={{ value: '산란 단면적 (cm²)', angle: -90, position: 'insideLeft' }} tick={{ fill: colors.text }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }} />
              <Legend />
              <Line type="monotone" dataKey="currentLimit" stroke="#ef4444" strokeWidth={2} name="현재 한계 (XENON1T)" />
              <Line type="monotone" dataKey="futureLimit" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" name="미래 목표 (DARWIN)" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className={`mt-6 p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-semibold mb-2">📌 해석:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>검출 원리</strong>: WIMP-핵 재결합 신호를 지하 감지기로 포착</li>
              <li>• <strong>민감도</strong>: σ ~ 10⁻⁴⁷ cm² (현재), 10⁻⁴⁹ cm² (미래 목표)</li>
              <li>• <strong>신호 음성</strong>: 직접 WIMP 검출 아직 성공 못함 → 간접 탐색, 가속기 탐색 병행</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
