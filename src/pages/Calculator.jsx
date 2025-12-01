import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Calculator() {
  const { isDark } = useTheme();
  const [activeCalc, setActiveCalc] = useState('schwarzschild');
  
  // 계산기 상태
  const [schInput, setSchInput] = useState({ mass: 10 });
  const [iscoInput, setIscoInput] = useState({ mass: 10, spin: 0.5 });
  const [luminosityInput, setLuminosityInput] = useState({ mass: 1, age: 10 });
  const [lumDistInput, setLumDistInput] = useState({ redshift: 1.0, magnitude: 20 });
  const [cmbInput, setCmbInput] = useState({ redshift: 1000 });

  // Schwarzschild 반지름 계산 (질량 단위: 태양질량)
  const calcSchwarzschild = () => {
    const M_sun_kg = 1.989e30; // kg
    const G = 6.674e-11; // m^3/(kg*s^2)
    const c = 3e8; // m/s
    const M = schInput.mass * M_sun_kg;
    const rs = (2 * G * M) / (c * c);
    return rs / 1000; // km로 변환
  };

  // ISCO 궤도 (Kerr 블랙홀)
  const calcISCO = () => {
    const M_sun_km = 1.477; // 태양질량을 km로 표현
    const M = iscoInput.mass * M_sun_km;
    const a = iscoInput.spin; // 회전 매개변수 (a* = a*c²/GM)
    
    const Z1 = 1 + Math.cbrt(1 - a*a) * (Math.cbrt(1 + a) - Math.cbrt(1 - a));
    const Z2 = Math.sqrt(3 * a * a + Z1 * Z1);
    const r_isco = M * (3 + Z2 - Math.sqrt((3 - Z1) * (3 + Z1 + 2 * Z2)));
    return r_isco;
  };

  // 별의 주계열 수명 추정 (M/L 비율)
  const calcLifetime = () => {
    const M = luminosityInput.mass;
    const L = Math.pow(M, 3.5); // 질량-광도 관계
    const M_sun_L_sun = 1 / 1; // 태양 1배 질량 = 1배 광도
    const lifetime = (M / L) * 10; // Gyr 단위 (태양은 ~10 Gyr)
    return lifetime;
  };

  // 광도 거리 계산 (ΛCDM)
  const calcLuminosityDistance = () => {
    const z = lumDistInput.redshift;
    const H0 = 67.4; // km/s/Mpc
    const c = 300000; // km/s
    const OmegaM = 0.315;
    const OmegaL = 0.685;
    
    // 공움직임 거리 근사 (간단한 수치 통합)
    let comoving_distance = 0;
    const dz = z / 1000;
    for (let i = 0; i < 1000; i++) {
      const z_i = i * dz;
      const E_z = Math.sqrt(OmegaM * (1 + z_i)**3 + OmegaL);
      comoving_distance += c / (H0 * E_z) * dz;
    }
    
    const lum_dist = (1 + z) * comoving_distance;
    return lum_dist;
  };

  // 적색편이로부터 CMB 온도 계산
  const calcCMBTemperature = () => {
    const z = cmbInput.redshift;
    const T0 = 2.725; // 현재 CMB 온도 (K)
    return T0 * (1 + z);
  };

  const containerClass = isDark 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const inputClass = isDark
    ? 'bg-gray-700 border-gray-600 text-white'
    : 'bg-white border-gray-300';

  const labelClass = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="space-y-12">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
          천체물리 계산기
        </h1>
        <p className={`text-sm sm:text-base ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          블랙홀, 항성, 우주론적 매개변수의 빠른 계산
        </p>
      </motion.div>

      {/* 탭 네비게이션 */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {[
          { id: 'schwarzschild', label: 'Schwarzschild 반지름', icon: '⚫' },
          { id: 'isco', label: 'ISCO 궤도', icon: '🔄' },
          { id: 'lifetime', label: '별의 수명', icon: '⭐' },
          { id: 'lumdist', label: '광도 거리', icon: '📏' },
          { id: 'cmb', label: 'CMB 온도', icon: '🌡️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCalc(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeCalc === tab.id
                ? isDark
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schwarzschild 반지름 */}
      {activeCalc === 'schwarzschild' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${containerClass}`}
        >
          <h2 className="text-2xl font-bold mb-4">Schwarzschild 반지름</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 입력 */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  블랙홀 질량 (태양질량 M☉)
                </label>
                <input
                  type="number"
                  value={schInput.mass}
                  onChange={(e) => setSchInput({ mass: parseFloat(e.target.value) || 0 })}
                  min="0.1"
                  max="1e10"
                  step="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  태양: 1, 지구 질량 블랙홀: 3×10⁻⁶, Sgr A*: 4×10⁶
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  공식
                </label>
                <div className={`p-3 rounded text-sm font-mono ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  r_s = 2GM/c² = 2.95 km × (M/M☉)
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  물리적 의미
                </label>
                <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• 블랙홀의 사건지평선 반지름</li>
                  <li>• 광자도 탈출 불가능한 경계</li>
                  <li>• 모든 질량은 이 반지름 내에 압축</li>
                </ul>
              </div>
            </div>

            {/* 결과 */}
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Schwarzschild 반지름
                </p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {calcSchwarzschild().toFixed(2)} km
                </div>
                <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  = {(calcSchwarzschild() / 6.371).toFixed(1)} 지구 반지름
                </p>
              </div>

              <div className={`p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className="font-semibold mb-2">💡 예시:</p>
                <ul className={`space-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• 태양 (1 M☉): r_s ≈ 2.95 km</li>
                  <li>• Sgr A* (4×10⁶ M☉): r_s ≈ 12 백만 km</li>
                  <li>• 지구 크기: r_s = 8.9 mm</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ISCO 궤도 */}
      {activeCalc === 'isco' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${containerClass}`}
        >
          <h2 className="text-2xl font-bold mb-4">ISCO (최내 안정 원형궤도)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 입력 */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  블랙홀 질량 (태양질량 M☉)
                </label>
                <input
                  type="number"
                  value={iscoInput.mass}
                  onChange={(e) => setIscoInput({ ...iscoInput, mass: parseFloat(e.target.value) || 0 })}
                  min="1"
                  max="1e10"
                  step="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  회전 매개변수 a* (0~1)
                </label>
                <input
                  type="number"
                  value={iscoInput.spin}
                  onChange={(e) => setIscoInput({ ...iscoInput, spin: Math.min(1, Math.max(0, parseFloat(e.target.value) || 0)) })}
                  min="0"
                  max="1"
                  step="0.1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  0: 비회전(Schwarzschild), 1: 극단적 회전(Kerr)
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  Schwarzschild ISCO
                </label>
                <div className={`p-3 rounded text-sm font-mono ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  r_ISCO = 6 GM/c²
                </div>
              </div>
            </div>

            {/* 결과 */}
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  ISCO 반지름
                </p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {calcISCO().toFixed(2)} km
                </div>
                <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Schwarzschild 반지름의 {(calcISCO() / (iscoInput.mass * 1.477 * 3)).toFixed(1)}배
                </p>
              </div>

              <div className={`p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className="font-semibold mb-2">💡 해석:</p>
                <ul className={`space-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• a*=0 (Schwarzschild): r_ISCO = 6 GM/c²</li>
                  <li>• a*=1 (극단 Kerr): r_ISCO = GM/c² (r_s/2)</li>
                  <li>• 회전 블랙홀은 ISCO 더 가까움</li>
                  <li>• 강착 에너지 효율 ∝ 1 - √(1 - 2/r_ISCO)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 별의 주계열 수명 */}
      {activeCalc === 'lifetime' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${containerClass}`}
        >
          <h2 className="text-2xl font-bold mb-4">별의 주계열 수명</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 입력 */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  별의 질량 (태양질량 M☉)
                </label>
                <input
                  type="number"
                  value={luminosityInput.mass}
                  onChange={(e) => setLuminosityInput({ ...luminosityInput, mass: parseFloat(e.target.value) || 0.1 })}
                  min="0.1"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  작은 별: 0.1~0.5, 태양: 1, 대질량: 20~50
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  공식
                </label>
                <div className={`p-3 rounded text-sm font-mono ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  t ≈ 10 Gyr × (M/M☉) / L
                  <br className="mt-2" />
                  L ≈ (M/M☉)^3.5
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  참고
                </label>
                <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• 질량-광도 관계: 더 무거운 별일수록 빠르게 연료 소진</li>
                  <li>• 우주 나이: ~13.8 Gyr</li>
                  <li>• 대질량 별: 수백만 년 내 초신성</li>
                </ul>
              </div>
            </div>

            {/* 결과 */}
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  주계열 수명
                </p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {calcLifetime().toFixed(2)} Gyr
                </div>
                <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  = {(calcLifetime() * 1e9).toExponential(2)} 년
                </p>
              </div>

              <div className={`p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className="font-semibold mb-2">💡 예시:</p>
                <ul className={`space-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• M=0.1 M☉: ~700 Gyr (우주보다 오래)</li>
                  <li>• M=1 M☉ (태양): ~10 Gyr</li>
                  <li>• M=10 M☉: ~10 Myr (1천만 년)</li>
                  <li>• M=50 M☉: ~2 Myr (200만 년)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 광도 거리 */}
      {activeCalc === 'lumdist' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${containerClass}`}
        >
          <h2 className="text-2xl font-bold mb-4">광도 거리 (Luminosity Distance)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 입력 */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  적색편이 (z)
                </label>
                <input
                  type="number"
                  value={lumDistInput.redshift}
                  onChange={(e) => setLumDistInput({ ...lumDistInput, redshift: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="10"
                  step="0.1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  근처 은하: z~0.01, 먼 은하: z~1, 초기 은하: z~10+
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  공식
                </label>
                <div className={`p-3 rounded text-sm font-mono ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  d_L = (1+z)×d_c
                  <br className="mt-2" />
                  d_c: 공움직임 거리
                </div>
              </div>
            </div>

            {/* 결과 */}
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  광도 거리
                </p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {calcLuminosityDistance().toFixed(1)} Mpc
                </div>
                <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  = {(calcLuminosityDistance() * 3.086e22).toExponential(2)} m
                </p>
              </div>

              <div className={`p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className="font-semibold mb-2">💡 용도:</p>
                <ul className={`space-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• 겉보기 광도 → 절대 광도 변환</li>
                  <li>• 초신성 거리 측정</li>
                  <li>• 우주론 검증</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* CMB 온도 */}
      {activeCalc === 'cmb' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg border ${containerClass}`}
        >
          <h2 className="text-2xl font-bold mb-4">우주 마이크로파 배경 온도</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 입력 */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  적색편이 (z)
                </label>
                <input
                  type="number"
                  value={cmbInput.redshift}
                  onChange={(e) => setCmbInput({ redshift: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="10000"
                  step="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  재결합: z~1100, 초기 우주: z~10000+
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClass}`}>
                  공식
                </label>
                <div className={`p-3 rounded text-sm font-mono ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  T(z) = T₀(1+z)
                  <br className="mt-2" />
                  T₀ = 2.725 K
                </div>
              </div>
            </div>

            {/* 결과 */}
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  CMB 온도
                </p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {calcCMBTemperature().toFixed(1)} K
                </div>
                <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  = {(calcCMBTemperature() * 8.617e-5).toExponential(2)} eV
                </p>
              </div>

              <div className={`p-4 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className="font-semibold mb-2">💡 의미:</p>
                <ul className={`space-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• 현재(z=0): T = 2.725 K</li>
                  <li>• 재결합(z=1100): T ≈ 3000 K</li>
                  <li>• 우주 나이 비례</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
