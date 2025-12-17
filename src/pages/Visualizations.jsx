import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Visualizations() {
  const { isDark } = useTheme();
  const [activeViz, setActiveViz] = useState('inflation');
  const [timeSlider, setTimeSlider] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);

  const canvasRef = useRef(null);

  // 캔버스 드로잉 유틸
  const drawInflation = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 우주 인플레이션 시각화
    const scale = 0.2 + t * 2; // 시간에 따라 확대
    const centerX = width / 2;
    const centerY = height / 2;

    // 배경 그리드
    ctx.strokeStyle = isDark ? '#333' : '#ddd';
    ctx.lineWidth = 1;
    for (let i = -5; i < 6; i++) {
      const x = centerX + i * 50 * scale;
      const y1 = centerY - 250 * scale;
      const y2 = centerY + 250 * scale;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();

      const y = centerY + i * 50 * scale;
      const x1 = centerX - 250 * scale;
      const x2 = centerX + 250 * scale;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }

    // 양자 요동 (fluctuations)
    ctx.fillStyle = `rgba(100, 200, 255, ${0.3 + 0.2 * Math.sin(t * 5)})`;
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2 + t;
      const r = 80 * scale + Math.sin(t * 3 + i) * 20;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      const size = 3 + Math.sin(t * 2 + i) * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 중심 특이점
    const coreSize = 5 + t * 10;
    ctx.fillStyle = `rgba(255, 100, 100, ${1 - t})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
    ctx.fill();

    // 팽창 파동
    ctx.strokeStyle = `rgba(100, 200, 255, ${0.5 - t * 0.3})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const radius = (50 + i * 40) * scale;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawBlackHoleAccretion = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 별자리 배경
    ctx.fillStyle = isDark ? '#fff' : '#000';
    for (let i = 0; i < 100; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453) % width;
      const y = (Math.sin(i * 78.233) * 43758.5453) % height;
      ctx.fillRect(x, y, 1, 1);
    }

    // 강착 원판 (Accretion disk)
    for (let ring = 0; ring < 8; ring++) {
      const radius = 50 + ring * 15;
      const opacity = 0.1 + ring * 0.08;
      const hue = 50 + ring * 20 + t * 50;
      
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 회전 입자
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * (3 - ring * 0.3);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius + Math.sin(t * 2 + i) * 3;
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
        ctx.fillRect(x - 2, y - 1, 4, 2);
      }
    }

    // 블랙홀 (event horizon)
    const bhRadius = 15;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, bhRadius, 0, Math.PI * 2);
    ctx.fill();

    // 광환 (photon ring)
    ctx.strokeStyle = `rgba(255, 150, 0, ${0.6 + 0.2 * Math.sin(t * 3)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, bhRadius * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // 상대론적 제트 (relativistic jet)
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.7)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const offset = i * 40 - 40;
      ctx.beginPath();
      ctx.moveTo(centerX + offset, centerY - bhRadius - 20);
      ctx.lineTo(centerX + offset - 15 * Math.sin(t * 2), centerY - bhRadius - 100);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + offset, centerY + bhRadius + 20);
      ctx.lineTo(centerX + offset + 15 * Math.sin(t * 2), centerY + bhRadius + 100);
      ctx.stroke();
    }
  };

  const drawGalaxyMerger = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 갤럭시 1 (좌측)
    const g1X = width / 2 - 80 + t * 60;
    const g1Y = height / 2;
    drawGalaxySpiral(ctx, g1X, g1Y, 40, t * 0.5);

    // 갤럭시 2 (우측)
    const g2X = width / 2 + 80 - t * 60;
    const g2Y = height / 2;
    drawGalaxySpiral(ctx, g2X, g2Y, 40, -t * 0.6);

    // 중력상호작용 (조석 뻗음)
    ctx.strokeStyle = `rgba(100, 150, 255, ${0.2 + 0.1 * Math.sin(t * 5)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(g1X + 40, g1Y);
    ctx.lineTo(g2X - 40, g2Y);
    ctx.stroke();

    // 진행도 표시
    if (t > 0.5) {
      ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
      const mergeX = width / 2 + Math.sin(t * 2) * 30;
      const mergeY = height / 2 + Math.cos(t * 2) * 30;
      ctx.beginPath();
      ctx.arc(mergeX, mergeY, 50, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawGalaxySpiral = (ctx, x, y, size, rotation) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // 중심 팽대부
    ctx.fillStyle = isDark ? 'rgba(255, 200, 100, 0.8)' : 'rgba(255, 180, 50, 0.7)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 나선팔
    for (let arm = 0; arm < 3; arm++) {
      ctx.strokeStyle = `rgba(${100 + arm * 50}, ${150 + arm * 30}, 255, 0.6)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const armAngle = (arm / 3) * Math.PI * 2;
      for (let i = 0; i < 20; i++) {
        const angle = armAngle + (i / 20) * Math.PI * 3;
        const r = (i / 20) * size;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawNeutronStarCollision = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    const progress = t % 1;
    const centerX = width / 2;
    const centerY = height / 2;

    if (progress < 0.5) {
      // 접근 단계
      const dist = 150 * (1 - progress * 2);
      
      // 중성자별 1
      ctx.fillStyle = `rgba(100, 150, 255, 0.9)`;
      ctx.beginPath();
      ctx.arc(centerX - dist, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // 중성자별 2
      ctx.fillStyle = `rgba(255, 100, 100, 0.9)`;
      ctx.beginPath();
      ctx.arc(centerX + dist, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // 중력파 (ripple)
      ctx.strokeStyle = `rgba(100, 200, 255, ${0.5 - progress})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const r = (50 + i * 40) * (1 - progress);
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      // 병합 단계
      const mergeProgress = (progress - 0.5) * 2;
      ctx.fillStyle = `rgba(255, 150, 0, ${1 - mergeProgress})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20 * mergeProgress, 0, Math.PI * 2);
      ctx.fill();

      // 강력한 중력파
      ctx.strokeStyle = `rgba(100, 200, 255, ${0.8 - mergeProgress * 0.5})`;
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        const r = 50 + i * 30 + mergeProgress * 100;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 킬로노바 (kilonova) 폭발
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const distance = 100 * mergeProgress;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        ctx.fillStyle = `rgba(255, ${200 - mergeProgress * 100}, 0, ${1 - mergeProgress})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawSupernovaExplosion = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    const explosionT = t % 1;

    // 폭발 파동
    ctx.strokeStyle = `rgba(255, 100, 50, ${0.8 - explosionT * 0.8})`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const r = 30 + explosionT * 150 + i * 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 방사성 물질 분출
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const distance = 40 + explosionT * 120;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const hue = 30 + Math.random() * 30;
      const opacity = 1 - explosionT;
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity * 0.7})`;
      
      const size = 2 + Math.random() * 4;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }

    // 중심 핵
    ctx.fillStyle = `rgba(255, 200, 0, ${1 - explosionT * 0.5})`;
    const coreSize = 20 - explosionT * 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(coreSize, 5), 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCosmicWebStructure = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 암흑물질 필라멘트와 보이드 시뮬레이션
    const scale = 2 + t * 0.5;

    for (let i = 0; i < 50; i++) {
      const x1 = (Math.sin(i * 12.9898 + t) * 0.5 + 0.5) * width;
      const y1 = (Math.sin(i * 78.233 + t * 0.7) * 0.5 + 0.5) * height;
      
      // 갤럭시 클러스터
      ctx.fillStyle = `hsla(${i * 7}, 100%, 60%, 0.8)`;
      const clusterSize = 3 + Math.sin(t + i) * 2;
      ctx.beginPath();
      ctx.arc(x1, y1, clusterSize, 0, Math.PI * 2);
      ctx.fill();

      // 필라멘트 연결
      if (i < 25) {
        const x2 = (Math.sin((i + 1) * 12.9898 + t) * 0.5 + 0.5) * width;
        const y2 = (Math.sin((i + 1) * 78.233 + t * 0.7) * 0.5 + 0.5) * height;
        
        ctx.strokeStyle = `rgba(100, 150, 255, ${0.3 + 0.1 * Math.sin(t + i)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  };

  const drawExoplanetOrbits = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 중심 항성
    ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();

    // 항성 표면 무늬
    ctx.strokeStyle = 'rgba(255, 150, 0, 0.6)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t * 0.3;
      const x1 = centerX + Math.cos(angle) * 18;
      const y1 = centerY + Math.sin(angle) * 18;
      const x2 = centerX + Math.cos(angle + 0.3) * 20;
      const y2 = centerY + Math.sin(angle + 0.3) * 20;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 행성 궤도
    const planets = [
      { radius: 80, period: 2, size: 4, color: 'rgba(100, 150, 255, 0.8)' },
      { radius: 120, period: 4, size: 6, color: 'rgba(255, 100, 100, 0.8)' },
      { radius: 150, period: 6, size: 5, color: 'rgba(100, 200, 100, 0.8)' },
      { radius: 180, period: 8, size: 4, color: 'rgba(255, 200, 100, 0.8)' }
    ];

    planets.forEach((planet) => {
      // 궤도선
      ctx.strokeStyle = `${planet.color.slice(0, -3)}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.radius, 0, Math.PI * 2);
      ctx.stroke();

      // 행성
      const angle = (t / planet.period) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * planet.radius;
      const y = centerY + Math.sin(angle) * planet.radius;
      
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(x, y, planet.size, 0, Math.PI * 2);
      ctx.fill();

      // 행성 축
      ctx.strokeStyle = planet.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle + Math.PI / 4) * 3, y + Math.sin(angle + Math.PI / 4) * 3);
      ctx.stroke();
    });
  };

  const drawPulsarRotation = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 펄서 자기장
    ctx.strokeStyle = `rgba(100, 150, 255, ${0.2 + 0.1 * Math.sin(t * 10)})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const r = 40 + i * 20;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 펄서 회전
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(t * 8);

    // 펄서 물질
    ctx.fillStyle = 'rgba(200, 100, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    // 방출 빔
    ctx.fillStyle = `rgba(100, 200, 255, ${0.5 + 0.3 * Math.sin(t * 10)})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(30, 15);
    ctx.lineTo(80, 5);
    ctx.lineTo(50, -5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(30, -15);
    ctx.lineTo(80, -5);
    ctx.lineTo(50, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 신호 강도 표시 (신호음파)
    ctx.strokeStyle = `rgba(100, 200, 255, ${0.5 - (t % 0.2) * 2.5})`;
    ctx.lineWidth = 2;
    const signalR = 100 + (t % 0.2) * 100;
    ctx.beginPath();
    ctx.arc(centerX, centerY, signalR, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawMagnetar = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 극강 자기장 선
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const startR = 30;
      const endR = 120;

      ctx.strokeStyle = `rgba(255, ${100 + i * 15}, 100, ${0.3 + 0.2 * Math.sin(t * 3 + i)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let j = 0; j < 50; j++) {
        const r = startR + (endR - startR) * (j / 50);
        const curve = Math.sin(angle * 2 + j * 0.1) * 10;
        const x = centerX + Math.cos(angle) * r + curve;
        const y = centerY + Math.sin(angle) * r;

        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 중성자별 표면
    ctx.fillStyle = 'rgba(150, 100, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();

    // 플레어 폭발
    if (Math.sin(t * 5) > 0.5) {
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 50 + Math.random() * 80;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, ${0.7 + Math.random() * 0.3})`;
        const size = 2 + Math.random() * 6;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawQuasarJet = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 배경 성단
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < 50; i++) {
      const x = Math.sin(i * 12.9898) * width * 0.4 + width / 2;
      const y = Math.sin(i * 78.233) * height * 0.4 + height / 2;
      const size = 0.5 + Math.sin(t + i) * 0.5;
      ctx.fillRect(x, y, size, size);
    }

    // 쿠에이사 (활동은하핵)
    ctx.fillStyle = 'rgba(255, 100, 50, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fill();

    // 제트 분사
    const jetLength = 150;
    const jetAngle1 = t * 0.5;
    const jetAngle2 = jetAngle1 + Math.PI;

    for (let i = 0; i < 2; i++) {
      const angle = i === 0 ? jetAngle1 : jetAngle2;
      
      // 제트 기본 구조
      ctx.strokeStyle = `rgba(100, 150, 255, 0.8)`;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * 15, centerY + Math.sin(angle) * 15);
      ctx.lineTo(
        centerX + Math.cos(angle) * (15 + jetLength),
        centerY + Math.sin(angle) * (15 + jetLength)
      );
      ctx.stroke();

      // 플라즈마 흐름
      for (let j = 0; j < 20; j++) {
        const dist = 20 + (t * 100 + j * 10) % jetLength;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;

        ctx.fillStyle = `hsla(200, 100%, ${50 + j * 2}%, ${1 - dist / jetLength})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawWormhole = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 배경 별
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
    for (let i = 0; i < 80; i++) {
      const x = Math.sin(i * 12.9898 + t * 0.2) * width * 0.45 + width / 2;
      const y = Math.sin(i * 78.233 + t * 0.2) * height * 0.45 + height / 2;
      const size = Math.sin(t * 2 + i) * 0.5 + 0.5;
      ctx.fillRect(x, y, size, size);
    }

    // 웜홀 구조
    for (let ring = 0; ring < 20; ring++) {
      const ringT = (ring / 20 + t * 0.5) % 1;
      const radius = 30 + ring * 5;
      const opacity = Math.sin(ringT * Math.PI) * 0.8;

      ctx.strokeStyle = `hsla(${280 + ring * 5}, 100%, ${50 + ring * 2}%, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 중심 특이점
    ctx.fillStyle = `rgba(100, 50, 200, ${0.5 + 0.3 * Math.sin(t * 5)})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();

    // 스파게티화 효과
    ctx.strokeStyle = `rgba(255, 100, 100, ${0.5 - (t % 0.5) * 1})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const stretch = 50 + (t % 0.5) * 100;
      ctx.beginPath();
      ctx.moveTo(centerX - 30 + i * 15, centerY - stretch);
      ctx.lineTo(centerX - 30 + i * 15, centerY + stretch);
      ctx.stroke();
    }
  };

  const drawVolumetricClouds = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 분자운 입자 시뮬레이션
    for (let i = 0; i < 200; i++) {
      const x = (Math.sin(i * 12.9898 + t) * 0.5 + 0.5) * width;
      const y = (Math.sin(i * 78.233 + t * 0.8) * 0.5 + 0.5) * height;
      
      const density = Math.sin(x * 0.01 + t) * Math.sin(y * 0.01 + t * 0.7);
      const hue = 200 + density * 60;
      const opacity = Math.max(0, density) * 0.8;

      ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${opacity})`;
      const size = 1 + Math.sin(t * 2 + i) * 0.5;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }

    // 별 형성 영역
    ctx.fillStyle = `rgba(255, 150, 0, ${0.4 + 0.2 * Math.sin(t * 3)})`;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t * 0.3;
      const r = 100;
      const x = width / 2 + Math.cos(angle) * r;
      const y = height / 2 + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 5 + Math.sin(t * 2 + i) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawCoronalMassEjection = (ctx, t) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDark ? '#111' : '#fff';
    ctx.fillRect(0, 0, width, height);

    // 태양 표면
    ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fill();

    // 태양 자기장 루프
    ctx.strokeStyle = `rgba(255, 100, 100, ${0.4 + 0.2 * Math.sin(t * 4)})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const baseX = centerX - 40 + i * 40;
      ctx.beginPath();
      ctx.arc(baseX, centerY - 40, 20 + i * 10, 0, Math.PI);
      ctx.stroke();
    }

    // CME 분출 (조건부)
    const ejectPhase = (t * 2) % 3;
    if (ejectPhase > 1) {
      const ejectProgress = (ejectPhase - 1) / 1;
      
      // 플라즈마 구름
      ctx.fillStyle = `rgba(100, 150, 255, ${0.8 - ejectProgress * 0.8})`;
      ctx.beginPath();
      const radius = 40 + ejectProgress * 100;
      ctx.arc(centerX, centerY - 30, radius, 0, Math.PI * 2);
      ctx.fill();

      // 분출 입자
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const distance = 50 + ejectProgress * 120;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY - 30 + Math.sin(angle) * distance;

        ctx.fillStyle = `rgba(255, 150, 100, ${1 - ejectProgress})`;
        const size = 2 + Math.random() * 2;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
  };

  const visualizations = [
    { id: 'inflation', name: '🌌 인플레이션', fn: drawInflation },
    { id: 'bh-accretion', name: '⚫ 블랙홀', fn: drawBlackHoleAccretion },
    { id: 'galaxy-merger', name: '🌀 은하 병합', fn: drawGalaxyMerger },
    { id: 'ns-collision', name: '💥 중성자별 충돌', fn: drawNeutronStarCollision },
    { id: 'supernova', name: '✨ 초신성', fn: drawSupernovaExplosion },
    { id: 'cosmic-web', name: '🕸️ 우주 거미줄', fn: drawCosmicWebStructure },
    { id: 'exoplanet', name: '🪐 외계행성', fn: drawExoplanetOrbits },
    { id: 'pulsar', name: '📡 펄서', fn: drawPulsarRotation },
    { id: 'magnetar', name: '🧲 자기별', fn: drawMagnetar },
    { id: 'quasar', name: '☄️ 쿠에이사', fn: drawQuasarJet },
    { id: 'wormhole', name: '🌀 웜홀', fn: drawWormhole },
    { id: 'clouds', name: '☁️ 분자운', fn: drawVolumetricClouds },
    { id: 'cme', name: '🔥 코로나 방출', fn: drawCoronalMassEjection }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let currentTime = 0;

    const animate = () => {
      const viz = visualizations.find(v => v.id === activeViz);
      if (viz) {
        const displayTime = autoPlay ? currentTime : timeSlider;
        viz.fn(ctx, displayTime);
      }

      if (autoPlay) {
        currentTime += 0.01 * speed;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [activeViz, timeSlider, autoPlay, speed, isDark]);

  const containerClass = isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900';

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
          🔭 천체물리 시뮬레이션
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          13가지 우주 현상을 시간에 따라 변하는 3D 시각화로 탐색합니다
        </p>
      </motion.div>

      {/* 시뮬레이션 캔버스 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`p-6 rounded-3xl border shadow-lg ${containerClass}`}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className={`w-full border rounded-2xl ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
        />
      </motion.div>

      {/* 제어판 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}
      >
        <h2 className="text-2xl font-bold mb-6">⚙️ 제어 및 설정</h2>

        {/* 시뮬레이션 선택 */}
        <div className="mb-6">
          <p className="font-semibold mb-3">시뮬레이션 선택:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {visualizations.map(viz => (
              <button
                key={viz.id}
                onClick={() => setActiveViz(viz.id)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeViz === viz.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : isDark
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {viz.name}
              </button>
            ))}
          </div>
        </div>

        {/* 시간 제어 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold mb-3">시간 진행 ({(timeSlider * 100).toFixed(0)}%)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeSlider}
              onChange={(e) => {
                setTimeSlider(parseFloat(e.target.value));
                setAutoPlay(false);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">재생 속도</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
        </div>

        {/* 재생 버튼 */}
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${
            autoPlay
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
              : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
          }`}
        >
          {autoPlay ? '⏸️ 일시 정지' : '▶️ 재생'}
        </button>
      </motion.div>

      {/* 정보 섹션 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}
      >
        <h2 className="text-2xl font-bold mb-4">📚 현재 선택: {visualizations.find(v => v.id === activeViz)?.name}</h2>
        <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong>팁:</strong> 각 시뮬레이션은 우주의 다양한 극한 현상을 보여줍니다.
          </p>
          <p>
            시간 슬라이더를 드래그하거나 재생 버튼으로 자동 진행을 제어할 수 있습니다.
          </p>
          <p>
            실제 물리를 기반으로 한 근사 시뮬레이션이며, 교육 목적으로 단순화되었습니다.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
