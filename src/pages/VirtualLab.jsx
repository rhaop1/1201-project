import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function OrbitSimulator() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const timeRef = useRef(0);

  const [eccentricity, setEccentricity] = useState(0.25);
  const [semiMajorAxis, setSemiMajorAxis] = useState(1.2); // AU
  const [massRatio, setMassRatio] = useState(0.6); // M_secondary / M_primary
  const [timeScale, setTimeScale] = useState(1.0);
  const [isRunning, setIsRunning] = useState(true);
  const { isDark } = useTheme();

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const background = isDark ? '#020617' : '#f8fafc';
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const massPrimary = 1;
    const massSecondary = clamp(massRatio, 0.1, 5);
    const totalMass = massPrimary + massSecondary;

    const maxRadius = semiMajorAxis * (1 + eccentricity);
    const margin = 48;
    const scale = (Math.min(width, height) / 2 - margin) / maxRadius;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 360; i += 2) {
      const theta = (i * Math.PI) / 180;
      const r = (semiMajorAxis * (1 - eccentricity ** 2)) / (1 + eccentricity * Math.cos(theta));
      const x = centerX + r * Math.cos(theta) * scale;
      const y = centerY + r * Math.sin(theta) * scale;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    const G = 4 * Math.PI ** 2; // AU^3 / (Msun yr^2)
    const orbitalPeriodYears = Math.sqrt((semiMajorAxis ** 3) / totalMass);
    const meanMotion = (2 * Math.PI) / orbitalPeriodYears;
    const meanAnomaly = (timeRef.current * timeScale * meanMotion) % (2 * Math.PI);

    const solveEccentricAnomaly = (M, e) => {
      let E = M;
      for (let i = 0; i < 6; i += 1) {
        E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      }
      return E;
    };

    const eccentricAnomaly = solveEccentricAnomaly(meanAnomaly, eccentricity);
    const radius = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly));
    const trueAnomaly = 2 * Math.atan2(
      Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
      Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
    );

    const visViva = Math.sqrt(
      G * totalMass * (2 / radius - 1 / semiMajorAxis)
    );

    const barycentricFactor = massSecondary / totalMass;
    const primaryX = centerX - barycentricFactor * radius * Math.cos(trueAnomaly) * scale;
    const primaryY = centerY - barycentricFactor * radius * Math.sin(trueAnomaly) * scale;

    const secondaryFactor = massPrimary / totalMass;
    const secondaryX = centerX + secondaryFactor * radius * Math.cos(trueAnomaly) * scale;
    const secondaryY = centerY + secondaryFactor * radius * Math.sin(trueAnomaly) * scale;

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(primaryX, primaryY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(secondaryX, secondaryY, 7, 0, Math.PI * 2);
    ctx.fill();

    const velocityScale = 30;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(secondaryX, secondaryY);
    ctx.lineTo(
      secondaryX - Math.sin(trueAnomaly) * visViva * velocityScale,
      secondaryY + Math.cos(trueAnomaly) * visViva * velocityScale
    );
    ctx.stroke();

    ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
    ctx.font = '14px "Fira Sans", system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`P = ${(orbitalPeriodYears * 365.25).toFixed(1)} 일`, 20, 30);
    ctx.fillText(`v = ${visViva.toFixed(2)} AU/년`, 20, 52);
    ctx.fillText(`e = ${eccentricity.toFixed(2)}`, 20, 74);
  }, [eccentricity, isDark, massRatio, semiMajorAxis, timeScale]);

  useEffect(() => {
    resizeCanvas();
    drawScene();
  }, [drawScene, resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {};
    }

    const handleResize = () => {
      resizeCanvas();
      drawScene();
    };

    window.addEventListener('resize', handleResize);

    const step = (timestamp) => {
      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      if (isRunning) {
        timeRef.current += delta;
        drawScene();
      }
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawScene, isRunning, resizeCanvas]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">이중계 궤도 실험실</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            케플러 방정식과 중력 상호작용을 사용해 이중계의 궤도와 속도를 추적합니다. eccentricity와 질량비를 조절하면서 vis-viva 방정식의 영향을 확인하세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            이심률
            <input
              type="range"
              min="0.0"
              max="0.9"
              step="0.01"
              value={eccentricity}
              onChange={(event) => setEccentricity(Number(event.target.value))}
            />
            <span className="w-10 text-right text-xs text-slate-500">{eccentricity.toFixed(2)}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            반장축(AU)
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={semiMajorAxis}
              onChange={(event) => setSemiMajorAxis(Number(event.target.value))}
            />
            <span className="w-10 text-right text-xs text-slate-500">{semiMajorAxis.toFixed(1)}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            질량비(M2/M1)
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={massRatio}
              onChange={(event) => setMassRatio(Number(event.target.value))}
            />
            <span className="w-10 text-right text-xs text-slate-500">{massRatio.toFixed(1)}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            시간배율
            <input
              type="range"
              min="0.2"
              max="8"
              step="0.2"
              value={timeScale}
              onChange={(event) => setTimeScale(Number(event.target.value))}
            />
            <span className="w-10 text-right text-xs text-slate-500">{timeScale.toFixed(1)}x</span>
          </label>
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className="ml-auto inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            {isRunning ? '일시 정지' : '재생'}
          </button>
        </div>
      </div>
      <div className="relative h-80 w-full overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </section>
  );
}

function SpectralLineSimulator() {
  const [temperature, setTemperature] = useState(8500);
  const [turbulence, setTurbulence] = useState(12); // km/s
  const [rotation, setRotation] = useState(120); // km/s
  const [opticalDepth, setOpticalDepth] = useState(0.55);
  const { isDark } = useTheme();

  const lineProfile = useMemo(() => {
    const points = [];
    const lambda0 = 656.28; // nm (H-alpha)
    const kB = 1.380649e-23;
    const massHydrogen = 1.6735575e-27;
    const c = 299792458; // m/s
    const temp = temperature;
    const thermalVelocity = Math.sqrt((2 * kB * temp) / massHydrogen); // m/s
    const turbulenceMS = turbulence * 1000;
    const rotationMS = rotation * 1000;

    const gaussianSigmaMeters = lambda0 * 1e-9 * Math.sqrt((thermalVelocity ** 2 + turbulenceMS ** 2) / c ** 2);
    const gaussianSigma = gaussianSigmaMeters * 1e9; // convert to nm
    const rotationWidth = (rotationMS / c) * lambda0;

    const depth = clamp(opticalDepth, 0.1, 0.95);

    for (let i = 0; i <= 320; i += 1) {
      const offset = (i / 320 - 0.5) * 1.6; // +-0.8 nm window
      const lambda = lambda0 + offset;
      const gauss = Math.exp(-(offset ** 2) / (2 * gaussianSigma ** 2));
      const rotKernelBase = rotationWidth > 0 ? Math.max(0, 1 - (offset ** 2) / (rotationWidth ** 2)) : 1;
      const rotationKernel = rotationWidth > 0 ? Math.sqrt(rotKernelBase) : 1;
      const intensity = 1 - depth * gauss * rotationKernel;
      points.push({ lambda, intensity });
    }
    return points;
  }, [temperature, turbulence, rotation, opticalDepth]);

  const pathData = useMemo(() => {
    if (!lineProfile.length) {
      return '';
    }
    const minLambda = lineProfile[0].lambda;
    const maxLambda = lineProfile[lineProfile.length - 1].lambda;
    const width = maxLambda - minLambda;

    return lineProfile
      .map((point, index) => {
        const x = ((point.lambda - minLambda) / width) * 100;
        const y = (1 - point.intensity) * 100;
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(3)},${y.toFixed(3)}`;
      })
      .join(' ');
  }, [lineProfile]);

  const equivalentWidth = useMemo(() => {
    if (!lineProfile.length) {
      return 0;
    }
    let ew = 0;
    for (let i = 1; i < lineProfile.length; i += 1) {
      const prev = lineProfile[i - 1];
      const curr = lineProfile[i];
      const avgIntensity = (prev.intensity + curr.intensity) / 2;
      const deltaLambda = curr.lambda - prev.lambda;
      ew += (1 - avgIntensity) * deltaLambda;
    }
    return ew;
  }, [lineProfile]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-6 border-b border-slate-200 p-6 lg:grid-cols-[auto,1fr] dark:border-slate-700">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">스펙트럼 선 폭 가상 실험</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            열폭과 난류, 자전 속도를 조절하여 Hα 선형의 Voigt 프로파일을 근사합니다. Equivalent Width와 잔류 강도를 실시간으로 산출합니다.
          </p>
          <dl className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <dt className="w-24 font-medium">Equivalent Width</dt>
              <dd>{equivalentWidth.toFixed(3)} nm</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="w-24 font-medium">잔류 강도</dt>
              <dd>{Math.min(...lineProfile.map((p) => p.intensity)).toFixed(3)}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            온도(K)
            <input
              type="range"
              min="3500"
              max="22000"
              step="100"
              value={temperature}
              onChange={(event) => setTemperature(Number(event.target.value))}
            />
            <span className="w-16 text-right text-xs text-slate-500">{temperature}K</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            난류(km/s)
            <input
              type="range"
              min="1"
              max="80"
              step="1"
              value={turbulence}
              onChange={(event) => setTurbulence(Number(event.target.value))}
            />
            <span className="w-16 text-right text-xs text-slate-500">{turbulence} km/s</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            자전(km/s)
            <input
              type="range"
              min="0"
              max="250"
              step="5"
              value={rotation}
              onChange={(event) => setRotation(Number(event.target.value))}
            />
            <span className="w-16 text-right text-xs text-slate-500">{rotation} km/s</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            광학두께
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={opticalDepth}
              onChange={(event) => setOpticalDepth(Number(event.target.value))}
            />
            <span className="w-16 text-right text-xs text-slate-500">{opticalDepth.toFixed(2)}</span>
          </label>
        </div>
      </div>
      <div className="relative h-72 w-full">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="profileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#38bdf8' : '#0ea5e9'} stopOpacity="0.85" />
              <stop offset="100%" stopColor={isDark ? '#1d4ed8' : '#2563eb'} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill={isDark ? '#0f172a' : '#f8fafc'} />
          <path d={pathData} fill="none" stroke="url(#profileGradient)" strokeWidth="1.75" />
          <line x1="0" y1="75" x2="100" y2="75" stroke={isDark ? '#334155' : '#cbd5f5'} strokeDasharray="2 3" strokeWidth="0.4" />
          <text x="50" y="96" textAnchor="middle" fontSize="4" fill={isDark ? '#cbd5f5' : '#475569'}>
            Wavelength (nm)
          </text>
          <text x="4" y="8" fontSize="4" fill={isDark ? '#cbd5f5' : '#475569'}>
            Normalized Intensity
          </text>
        </svg>
      </div>
    </section>
  );
}

function InterferometerModule() {
  const [baseline, setBaseline] = useState(85); // m
  const [wavelength, setWavelength] = useState(2.2); // micron
  const [snr, setSnr] = useState(45);

  const resolution = useMemo(() => {
    const lambdaMeters = wavelength * 1e-6;
    const thetaRadians = (1.22 * lambdaMeters) / (baseline || 1);
    const milliArcsec = thetaRadians * (180 / Math.PI) * 3600 * 1000;
    return milliArcsec;
  }, [baseline, wavelength]);

  const limitingMagnitude = useMemo(() => {
    const baseMag = 7.5 + Math.log10(baseline) * 0.8;
    const snrFactor = Math.log10(Math.max(snr, 1)) * 1.1;
    return (baseMag + snrFactor).toFixed(2);
  }, [baseline, snr]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-6 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">장기선 간섭계 설계기</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          기저 길이, 관측 파장, S/N을 조정하여 VLTi, CHARA 등 간섭계의 분해능과 감도로부터 적합한 관측 전략을 도출합니다.
        </p>
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            기저 길이 (m)
            <input
              type="range"
              min="10"
              max="330"
              step="5"
              value={baseline}
              onChange={(event) => setBaseline(Number(event.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right text-xs text-slate-500">{baseline.toFixed(0)} m</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            파장 (μm)
            <input
              type="range"
              min="0.4"
              max="13"
              step="0.1"
              value={wavelength}
              onChange={(event) => setWavelength(Number(event.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right text-xs text-slate-500">{wavelength.toFixed(1)} μm</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            S/N 목표
            <input
              type="range"
              min="5"
              max="120"
              step="1"
              value={snr}
              onChange={(event) => setSnr(Number(event.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right text-xs text-slate-500">{snr.toFixed(0)}</span>
          </label>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-200">각분해능</span>
            <span className="text-slate-900 dark:text-slate-100">{resolution.toFixed(3)} mas</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-200">관측 가능 등급</span>
            <span className="text-slate-900 dark:text-slate-100">{limitingMagnitude} 등급</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            θ = 1.22 λ / B 근사를 기반으로 합니다. 파장이 길어질수록 분해능이 약화되므로, 열적 배경이 지배적일 때에는 고기저-저파장 세션을 병행하세요.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function VirtualLab() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">가상 실험실</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            궤도역학, 분광학, 간섭계 설계를 통합한 실험실 모듈로 관측 캠페인과 이론 모델링을 사전 검증합니다. 각 모듈은 입력 매개변수에 따라 실시간으로 수치 결과를 재계산합니다.
          </p>
        </header>
        <OrbitSimulator />
        <SpectralLineSimulator />
        <InterferometerModule />
      </div>
    </div>
  );
}
