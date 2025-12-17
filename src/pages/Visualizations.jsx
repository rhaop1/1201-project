import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export default function Visualizations() {
  const { isDark } = useTheme();
  
  // 우주론 파라미터
  const [omega_m, setOmega_m] = useState(0.3); // 물질 밀도 파라미터
  const [omega_lambda, setOmega_lambda] = useState(0.7); // 암흑에너지 밀도 파라미터
  const [h, setH] = useState(0.7); // 허블상수 스케일 (H0 = 100h km/s/Mpc)
  const [w, setW] = useState(-1); // 암흑에너지 상태방정식 (w = -1은 우주상수)
  
  // 계산 결과
  const [results, setResults] = useState(null);
  const [hubbleData, setHubbleData] = useState([]);

  // 기본 상수
  const H0 = h * 100; // km/s/Mpc
  const c = 299792; // km/s
  const Mpc_to_m = 3.086e22; // 1 Mpc in meters

  // 허블함수 계산: H(z) = H0 * sqrt(Omega_m(1+z)^3 + Omega_lambda*(1+z)^(3(1+w)) + Omega_k(1+z)^2)
  const hubbleFunction = (z) => {
    const omega_k = Math.max(0, 1 - omega_m - omega_lambda);
    const term_m = omega_m * Math.pow(1 + z, 3);
    const term_lambda = omega_lambda * Math.pow(1 + z, 3 * (1 + w));
    const term_k = omega_k * Math.pow(1 + z, 2);
    return H0 * Math.sqrt(term_m + term_lambda + term_k);
  };

  // 우주 나이 계산 (적분으로 근사)
  const ageOfUniverse = () => {
    const dz = 0.01;
    let integral = 0;
    for (let z = 0; z < 1000; z += dz) {
      integral += dz / (hubbleFunction(z) * (1 + z));
    }
    const age_Gyr = (integral * Mpc_to_m / (1e9 * 365.25 * 24 * 3600 * c)) / 1e9;
    return age_Gyr;
  };

  // 스케일 팩터 진화: a(z) = 1/(1+z)
  const generateHubbleData = () => {
    const data = [];
    for (let z = 0; z <= 10; z += 0.2) {
      data.push({
        z: parseFloat(z.toFixed(1)),
        H_z: parseFloat(hubbleFunction(z).toFixed(2)),
        a: parseFloat((1 / (1 + z)).toFixed(3))
      });
    }
    return data;
  };

  // 밀도 파라미터 계산
  const densityParameters = () => {
    const omega_k = Math.max(0, 1 - omega_m - omega_lambda);
    return {
      matter: parseFloat((omega_m * 100).toFixed(2)),
      dark_energy: parseFloat((omega_lambda * 100).toFixed(2)),
      radiation: parseFloat(((1 - omega_m - omega_lambda) * 100).toFixed(2)),
      total: parseFloat((omega_m + omega_lambda + omega_k).toFixed(3))
    };
  };

  // 계산 실행
  const handleSimulate = () => {
    const age = ageOfUniverse();
    const h_data = generateHubbleData();
    const density = densityParameters();
    
    setResults({
      age,
      H0: parseFloat(H0.toFixed(2)),
      density,
      omega_k: Math.max(0, 1 - omega_m - omega_lambda)
    });
    setHubbleData(h_data);
  };

  const containerClass = isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900';

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-300 dark:to-blue-300 bg-clip-text text-transparent">
          🌌 우주론 시뮬레이터
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          우주 파라미터를 조정하고 허블함수, 우주 나이, 밀도 진화를 실시간으로 계산합니다.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 패널 */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}>
          <h2 className="text-2xl font-bold mb-6">파라미터 설정</h2>
          
          <div className="space-y-5">
            {/* Omega_m */}
            <div>
              <label className={`block text-sm font-semibold mb-2`}>
                물질 밀도 파라미터 (Ω_m) = {omega_m.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={omega_m}
                onChange={(e) => setOmega_m(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                우주의 암흑물질 + 통상물질 비율
              </p>
            </div>

            {/* Omega_lambda */}
            <div>
              <label className={`block text-sm font-semibold mb-2`}>
                암흑에너지 밀도 파라미터 (Ω_Λ) = {omega_lambda.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={omega_lambda}
                onChange={(e) => setOmega_lambda(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                우주 가속 팽창을 일으키는 에너지
              </p>
            </div>

            {/* h (허블상수) */}
            <div>
              <label className={`block text-sm font-semibold mb-2`}>
                허블상수 스케일 (h) = {h.toFixed(2)} → H₀ = {H0.toFixed(1)} km/s/Mpc
              </label>
              <input
                type="range"
                min="0.5"
                max="0.9"
                step="0.01"
                value={h}
                onChange={(e) => setH(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                우주 팽창 속도
              </p>
            </div>

            {/* w (암흑에너지 상태방정식) */}
            <div>
              <label className={`block text-sm font-semibold mb-2`}>
                암흑에너지 상태방정식 (w) = {w.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="-0.3"
                step="0.1"
                value={w}
                onChange={(e) => setW(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                w = -1 (우주상수), w &lt; -1 (phantom)
              </p>
            </div>

            {/* 계산 버튼 */}
            <button
              onClick={handleSimulate}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold rounded-xl mt-6"
            >
              🚀 시뮬레이션 실행
            </button>
          </div>

          {/* 초기 조건 */}
          <div className={`mt-8 p-4 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-xs font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              ΛCDM 기준값 설정
            </p>
            <div className="space-y-2">
              <button
                onClick={() => { setOmega_m(0.3); setOmega_lambda(0.7); setH(0.7); setW(-1); }}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}
              >
                ΛCDM 표준모형
              </button>
              <button
                onClick={() => { setOmega_m(0.1); setOmega_lambda(0.9); setH(0.68); setW(-1); }}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}
              >
                어두운 에너지 지배
              </button>
              <button
                onClick={() => { setOmega_m(0.5); setOmega_lambda(0.5); setH(0.7); setW(-1); }}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}
              >
                평탄 우주 (5050)
              </button>
            </div>
          </div>
        </motion.div>

        {/* 결과 패널 */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}>
          <h2 className="text-2xl font-bold mb-6">계산 결과</h2>

          {results ? (
            <div className="space-y-6">
              {/* 주요 결과값 */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-indigo-50 border-indigo-200'}`}>
                  <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    우주 나이
                  </p>
                  <p className="text-2xl font-bold mt-2">{results.age.toFixed(2)} Gyr</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                  <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                    허블 상수
                  </p>
                  <p className="text-2xl font-bold mt-2">H₀ = {results.H0} km/s/Mpc</p>
                </div>
              </div>

              {/* 밀도 파라미터 */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className="font-semibold mb-3">밀도 파라미터</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>물질 (Ω_m)</span>
                    <span className="font-mono font-bold">{results.density.matter}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>암흑에너지 (Ω_Λ)</span>
                    <span className="font-mono font-bold">{results.density.dark_energy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>곡률 (Ω_k)</span>
                    <span className="font-mono font-bold">{(results.density.radiation).toFixed(2)}%</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-semibold">
                    <span>합계</span>
                    <span className="font-mono">{results.density.total}</span>
                  </div>
                </div>
              </div>

              {/* 우주론 파라미터 */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className="font-semibold mb-3">현재 우주 상태</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>스케일 팩터 (a)</span>
                    <span className="font-mono font-bold">1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>적색이동 (z)</span>
                    <span className="font-mono font-bold">0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>암흑에너지 방정식 (w)</span>
                    <span className="font-mono font-bold">{w}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>좌측 패널에서 파라미터를 설정하고</p>
              <p>🚀 시뮬레이션 실행 버튼을 클릭하세요</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* 허블함수 그래프 */}
      {hubbleData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}>
          <h2 className="text-2xl font-bold mb-6">허블 함수 진화 H(z)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hubbleData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
              <XAxis 
                dataKey="z" 
                label={{ value: '적색이동 (z)', position: 'insideBottomRight', offset: -5 }}
                stroke={isDark ? '#666' : '#999'}
              />
              <YAxis 
                label={{ value: 'H(z) [km/s/Mpc]', angle: -90, position: 'insideLeft' }}
                stroke={isDark ? '#666' : '#999'}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                  color: isDark ? '#fff' : '#000'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="H_z" 
                stroke="#3b82f6" 
                name="H(z)"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className={`text-xs mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            📊 과거 우주의 팽창 속도: 적색이동이 클수록 과거를 나타냅니다
          </p>
        </motion.div>
      )}

      {/* 스케일 팩터 진화 */}
      {hubbleData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}>
          <h2 className="text-2xl font-bold mb-6">스케일 팩터 진화 a(z)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hubbleData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
              <XAxis 
                dataKey="z" 
                label={{ value: '적색이동 (z)', position: 'insideBottomRight', offset: -5 }}
                stroke={isDark ? '#666' : '#999'}
              />
              <YAxis 
                label={{ value: '스케일 팩터 a(z)', angle: -90, position: 'insideLeft' }}
                stroke={isDark ? '#666' : '#999'}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                  color: isDark ? '#fff' : '#000'
                }}
              />
              <Legend />
              <Bar 
                dataKey="a" 
                fill="#8b5cf6"
                name="a(z) = 1/(1+z)"
              />
            </BarChart>
          </ResponsiveContainer>
          <p className={`text-xs mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            📈 우주 크기의 시간 진화: a=1은 현재, a&lt;1은 과거 우주의 더 작은 상태
          </p>
        </motion.div>
      )}

      {/* 정보 섹션 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}>
        <h2 className="text-2xl font-bold mb-4">🔬 우주론 배경</h2>
        <div className={`space-y-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong>Ω_m (물질 밀도 파라미터)</strong>: 우주 전체 에너지 밀도에서 차지하는 물질(암흑물질 포함)의 비율
          </p>
          <p>
            <strong>Ω_Λ (암흑에너지 파라미터)</strong>: 우주 가속 팽창을 일으키는 에너지의 비율 (우주상수 모형)
          </p>
          <p>
            <strong>h (허블 파라미터)</strong>: 현재 우주 팽창 속도를 나타내는 무차원 수. H₀ = 100h km/s/Mpc
          </p>
          <p>
            <strong>w (암흑에너지 상태방정식)</strong>: w = -1이면 우주상수, w &lt; -1이면 phantom 에너지 (우주 팽창 가속화)
          </p>
          <p>
            <strong>허블 함수 H(z)</strong>: 적색이동이 z인 거리에서의 팽창 속도. 과거 우주의 상태를 나타냅니다
          </p>
        </div>
      </motion.div>
    </div>
  );
}
