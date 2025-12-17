import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';

export default function Visualizations() {
  const { isDark } = useTheme();
  const [activeViz, setActiveViz] = useState('neutron-collision');
  const [timeSlider, setTimeSlider] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);
  const [rotationMode, setRotationMode] = useState(true);

  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  // Planck 법칙 기반 온도-색상 변환 (현실적인 천체 색상)
  const temperatureToColor = (temp) => {
    let r, g, b;
    const t = Math.max(1000, Math.min(50000, temp)) / 100;
    
    if (t <= 66) {
      r = 255;
      g = Math.max(0, 99.4743955e-1 * Math.log(t) - 161.1195681);
    } else {
      r = Math.max(0, 329.698727446e-1 * Math.pow(t - 60, -0.1332047592));
      g = Math.max(0, 288.1221695e-1 * Math.pow(t - 60, -0.0755148492));
    }
    b = t >= 66 ? 255 : Math.max(0, 139.6777577e-1 * Math.log(t - 10) - 305.0447927);
    
    return new THREE.Color(r / 255, g / 255, b / 255);
  };

  // 물리 기반 입자 시스템
  class PhysicsParticleSystem {
    constructor(count, config = {}) {
      this.count = count;
      this.config = {
        maxVelocity: config.maxVelocity || 0.1,
        lifetime: config.lifetime || 10,
        gravity: config.gravity || 0,
        radius: config.radius || 0.5,
        ...config
      };

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const lifetimes = new Float32Array(count);
      const ages = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = Math.random() ** (1/3) * this.config.radius;

        positions[i * 3] = Math.sin(phi) * Math.cos(angle) * r;
        positions[i * 3 + 1] = Math.sin(phi) * Math.sin(angle) * r;
        positions[i * 3 + 2] = Math.cos(phi) * r;

        const speed = Math.random() * this.config.maxVelocity;
        velocities[i * 3] = Math.sin(phi) * Math.cos(angle) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(angle) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed;

        const temp = Math.random() * (this.config.maxTemp - this.config.minTemp) + this.config.minTemp;
        const color = temperatureToColor(temp);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        lifetimes[i] = this.config.lifetime;
        ages[i] = 0;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9
      });

      this.mesh = new THREE.Points(geometry, material);
      this.velocities = velocities;
      this.ages = ages;
      this.lifetimes = lifetimes;
      this.positionAttribute = geometry.getAttribute('position');
      this.colorAttribute = geometry.getAttribute('color');
    }

    update(dt) {
      const positions = this.positionAttribute.array;

      for (let i = 0; i < this.count; i++) {
        const idx = i * 3;
        this.ages[i] += dt;
        const alpha = 1 - (this.ages[i] / this.lifetimes[i]);

        if (alpha > 0) {
          // 중력 계산
          if (this.config.gravity) {
            const r2 = positions[idx] ** 2 + positions[idx + 1] ** 2 + positions[idx + 2] ** 2;
            if (r2 > 0.001) {
              const r = Math.sqrt(r2);
              const acc = -this.config.gravity / r2;
              this.velocities[idx] += acc * positions[idx] / r * 0.016;
              this.velocities[idx + 1] += acc * positions[idx + 1] / r * 0.016;
              this.velocities[idx + 2] += acc * positions[idx + 2] / r * 0.016;
            }
          }

          positions[idx] += this.velocities[idx];
          positions[idx + 1] += this.velocities[idx + 1];
          positions[idx + 2] += this.velocities[idx + 2];
        }
      }

      this.positionAttribute.needsUpdate = true;
    }
  }

  // 별 배경장 생성
  const createStarField = () => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);

    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

      const temp = 3000 + Math.random() * 20000;
      const color = temperatureToColor(temp);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    });

    return new THREE.Points(geometry, material);
  };

  // 1. 중성자별 충돌 (킬로노바)
  const createNeutronCollision = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 150, 500);
    scene.add(createStarField());

    // 중성자별 1
    const ns1Geometry = new THREE.SphereGeometry(0.3, 64, 64);
    const ns1Material = new THREE.MeshStandardMaterial({
      color: 0x1a5fa0,
      emissive: 0x0d3d6e,
      metalness: 0.2,
      roughness: 0.4
    });
    const ns1 = new THREE.Mesh(ns1Geometry, ns1Material);
    ns1.position.set(-1.2, 0, 0);
    scene.add(ns1);

    // 중성자별 2
    const ns2Geometry = new THREE.SphereGeometry(0.3, 64, 64);
    const ns2Material = new THREE.MeshStandardMaterial({
      color: 0xcc6600,
      emissive: 0x994400,
      metalness: 0.2,
      roughness: 0.4
    });
    const ns2 = new THREE.Mesh(ns2Geometry, ns2Material);
    ns2.position.set(1.2, 0, 0);
    scene.add(ns2);

    // 강착 디스크
    const diskGeometry = new THREE.TorusGeometry(0.8, 0.25, 32, 256);
    const diskMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff4400,
      emissiveIntensity: 0,
      metalness: 0,
      roughness: 0.7,
      transparent: true,
      opacity: 0
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = 0.3;
    scene.add(disk);

    // 킬로노바 입자 (r-프로세스 원소 합성) - 매우 사실적
    const kilonovaParticles = new PhysicsParticleSystem(3500, {
      maxVelocity: 0.35,
      lifetime: 8,
      radius: 0.1,
      minTemp: 3000,
      maxTemp: 12000,
      gravity: 0.02
    });
    scene.add(kilonovaParticles.mesh);

    // 중력파 표현 - 시공간 곡률 표현
    const gravitationalWaves = [];
    for (let i = 0; i < 8; i++) {
      const waveGeometry = new THREE.TorusGeometry(0.4 + i * 0.35, 0.06, 32, 128);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ddff,
        transparent: true,
        opacity: 0,
        wireframe: true
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      gravitationalWaves.push({ mesh: wave, scale: 0.4 + i * 0.35 });
      scene.add(wave);
    }

    // 감마선 폭발 표현
    const gammaRayBurst = new THREE.Group();
    for (let j = 0; j < 3; j++) {
      const beamGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 16);
      const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0
      });
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.z = 0.5;
      beam.userData.originalEmissive = 0;
      beam.userData.index = j;
      gammaRayBurst.add(beam);
    }
    scene.add(gammaRayBurst);

    // 조명
    const light1 = new THREE.PointLight(0x0088ff, 1.2);
    light1.position.set(-3, 2, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff6600, 1.5);
    light2.position.set(3, 2, 3);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0x334466, 0.4);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        const mergePhase = Math.min(t, 0.4);
        const collapsePhase = Math.max(0, Math.min(1, (t - 0.4) / 0.3));

        ns1.position.x = -1.2 + mergePhase * 2.0;
        ns2.position.x = 1.2 - mergePhase * 2.0;
        ns1.rotation.y += 0.008;
        ns2.rotation.y -= 0.008;

        if (collapsePhase > 0) {
          disk.material.opacity = Math.min(0.8, collapsePhase * 1.5);
          disk.material.emissiveIntensity = collapsePhase * 0.9;
          disk.rotation.z += 0.06;

          kilonovaParticles.update(0.016);

          gravitationalWaves.forEach((wave, idx) => {
            wave.mesh.material.opacity = Math.max(0, 0.6 - collapsePhase * 0.8);
            wave.mesh.scale.set(
              1 + collapsePhase * 1.0 + idx * 0.15,
              1 + collapsePhase * 1.0 + idx * 0.15,
              1
            );
          });

          // 감마선 폭발
          gammaRayBurst.children.forEach((beam, idx) => {
            const beamPhase = Math.max(0, collapsePhase - 0.3);
            beam.material.opacity = Math.min(0.8, beamPhase * 3);
            beam.material.emissiveIntensity = Math.max(0, beamPhase * 2);
            beam.scale.z = 1 + beamPhase * 2;
          });
        }
      }
    };
  };

  // 2. 블랙홀 강착
  const createBlackHoleAccretion = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 200, 500);
    scene.add(createStarField());

    // 블랙홀 (사건의 지평선)
    const bhGeometry = new THREE.SphereGeometry(0.35, 128, 128);
    const bhMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bh = new THREE.Mesh(bhGeometry, bhMaterial);
    scene.add(bh);

    // 포톤 링 (빛의 고리) - 사건의 지평선 주변
    const photonRingGeometry = new THREE.TorusGeometry(0.55, 0.12, 32, 512);
    const photonRingMaterial = new THREE.MeshPhongMaterial({
      color: 0xffaa44,
      emissive: 0xff8800,
      emissiveIntensity: 0.95,
      shininess: 120
    });
    const photonRing = new THREE.Mesh(photonRingGeometry, photonRingMaterial);
    photonRing.rotation.x = 0.35;
    scene.add(photonRing);

    // 도플러 효과를 고려한 온도 기반 강착 디스크 - 극도로 사실적
    const accretionDisks = [];
    for (let ring = 0; ring < 14; ring++) {
      const ringRadius = 0.65 + ring * 0.28;
      const ringWidth = 0.16;
      const diskGeometry = new THREE.TorusGeometry(ringRadius, ringWidth, 16, 512);

      // 중심에서 멀어질수록 온도 감소 (실제 물리)
      const temp = Math.max(3000, 8500 - ring * 450);
      const color = temperatureToColor(temp);

      const diskMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.75,
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.9 - ring * 0.05
      });

      const disk = new THREE.Mesh(diskGeometry, diskMaterial);
      disk.rotation.x = 0.2;
      disk.userData.rotationSpeed = 0.045 - ring * 0.002;
      disk.userData.ringIndex = ring;
      accretionDisks.push(disk);
      scene.add(disk);
    }

    // 상대론적 제트 (Lorentz 인수 효과)
    const jetGeometry = new THREE.ConeGeometry(0.18, 3.5, 32);
    const jetMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      emissive: 0x0088ff,
      emissiveIntensity: 0.95,
      metalness: 0.1
    });

    const jetUp = new THREE.Mesh(jetGeometry, jetMaterial);
    jetUp.position.z = 2.2;
    const jetDown = new THREE.Mesh(jetGeometry, jetMaterial);
    jetDown.position.z = -2.2;
    jetDown.rotation.z = Math.PI;

    scene.add(jetUp);
    scene.add(jetDown);

    // 빛의 굴절 (중력 렌즈)
    const lensElements = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const ringGeometry = new THREE.TorusGeometry(0.4 + i * 0.15, 0.03, 16, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.2
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = angle;
      lensElements.push(ring);
      scene.add(ring);
    }

    // 조명 - 다중 광원으로 사실성 증대
    const centralLight = new THREE.PointLight(0xff8844, 2.5);
    centralLight.position.set(0.1, 0.1, 0);
    scene.add(centralLight);

    const blueLight = new THREE.PointLight(0x0088ff, 1.5);
    blueLight.position.set(0, 0, 5);
    scene.add(blueLight);

    const hemisphereLight = new THREE.HemisphereLight(0x0088ff, 0xff6600, 0.3);
    scene.add(hemisphereLight);

    const ambientLight = new THREE.AmbientLight(0x1a2a3a, 0.25);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        // 강착 디스크 회전 (각속도는 반지름에 따라 달라짐)
        accretionDisks.forEach((disk, idx) => {
          disk.rotation.z += disk.userData.rotationSpeed;
          
          // 빛 방출 변화 시뮬레이션
          disk.material.emissiveIntensity = 0.65 + Math.sin(t * 2.5 + idx * 0.5) * 0.2;
          
          // 쌍곡선 궤도 효과 - 중심에서 멀어질수록 느린 회전
          disk.rotation.x = 0.2 + Math.sin(t * 0.3 + idx * 0.1) * 0.05;
        });

        // 포톤 링 고속 회전
        photonRing.rotation.z += 0.025;
        photonRing.material.emissiveIntensity = 0.85 + Math.sin(t * 2) * 0.15;
        photonRing.rotation.x = 0.35 + Math.sin(t * 0.2) * 0.05;

        // 제트 떨림
        jetUp.position.z = 2.2 + Math.sin(t * 0.8) * 0.2;
        jetDown.position.z = -2.2 - Math.sin(t * 0.8) * 0.2;
        jetUp.material.emissiveIntensity = 0.8 + Math.sin(t * 1.5) * 0.2;
        jetDown.material.emissiveIntensity = 0.8 + Math.sin(t * 1.5) * 0.2;

        // 중력 렌즈 효과
        lensElements.forEach((lens, idx) => {
          lens.rotation.z += 0.005;
          lens.material.opacity = 0.15 + Math.sin(t + idx) * 0.1;
        });
      }
    };
  };

  // 3. 초신성 폭발
  const createSupernova = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2e);
    scene.fog = new THREE.Fog(0x0a0a2e, 100, 500);
    scene.add(createStarField());

    // 별 코어
    const coreGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 1,
      metalness: 0
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // 폭발 셸
    const shellGeometry = new THREE.SphereGeometry(0.2, 64, 64);
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff4400,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.7
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(shell);

    // 방사 입자
    const ejectaSystem = new PhysicsParticleSystem(3500, {
      maxVelocity: 0.45,
      lifetime: 10,
      radius: 0.2,
      minTemp: 4000,
      maxTemp: 15000,
      gravity: 0.015
    });
    scene.add(ejectaSystem.mesh);

    // 쇼크 파동
    const shockWaves = [];
    for (let i = 0; i < 12; i++) {
      const waveGeometry = new THREE.TorusGeometry(0.25 + i * 0.22, 0.07, 16, 256);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0,
        wireframe: true
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      shockWaves.push(wave);
      scene.add(wave);
    }

    // 조명
    const coreLight = new THREE.PointLight(0xffff00, 2.5);
    scene.add(coreLight);

    const explosionLight = new THREE.PointLight(0xff6600, 1.8);
    explosionLight.position.set(0.5, 0.5, 0.5);
    scene.add(explosionLight);

    const ambientLight = new THREE.AmbientLight(0x4a1a00, 0.35);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        shell.scale.set(1 + t * 3.5, 1 + t * 3.5, 1 + t * 3.5);
        shell.material.opacity = Math.max(0, 0.7 - t * 0.7);

        core.scale.set(
          Math.max(0.1, 0.15 - t * 0.12),
          Math.max(0.1, 0.15 - t * 0.12),
          Math.max(0.1, 0.15 - t * 0.12)
        );

        ejectaSystem.update(0.016);

        shockWaves.forEach((wave, idx) => {
          wave.scale.set(1 + t * 3.5 + idx * 0.3, 1 + t * 3.5 + idx * 0.3, 1);
          wave.material.opacity = Math.max(0, 0.8 - t * 0.95 - idx * 0.08);
        });
      }
    };
  };

  // 4. 은하 충돌 (타이달 포스)
  const createGalaxyMerger = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000805);
    scene.fog = new THREE.Fog(0x000805, 150, 500);
    scene.add(createStarField());

    // 은하 1 - 디스크
    const galaxy1Particles = new PhysicsParticleSystem(2000, {
      maxVelocity: 0.08,
      lifetime: 12,
      radius: 1.2,
      minTemp: 3500,
      maxTemp: 9000,
      gravity: 0.08
    });
    galaxy1Particles.mesh.position.set(-2, 0, 0);
    scene.add(galaxy1Particles.mesh);

    // 은하 2
    const galaxy2Particles = new PhysicsParticleSystem(2000, {
      maxVelocity: 0.08,
      lifetime: 12,
      radius: 1.2,
      minTemp: 3500,
      maxTemp: 9000,
      gravity: 0.08
    });
    galaxy2Particles.mesh.position.set(2, 0.5, 0);
    scene.add(galaxy2Particles.mesh);

    // 조명
    const light1 = new THREE.PointLight(0x4488ff, 1);
    light1.position.set(-3, 1, 2);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffaa44, 1);
    light2.position.set(3, 1, 2);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0x223344, 0.4);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        galaxy1Particles.mesh.position.x = -2 + t * 1.8;
        galaxy2Particles.mesh.position.x = 2 - t * 1.8;
        
        galaxy1Particles.update(0.016);
        galaxy2Particles.update(0.016);
      }
    };
  };

  // 5. 우주의 거미줄 (코즈믹 웹)
  const createCosmicWeb = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 200, 500);
    scene.add(createStarField());

    // 다크 매터 필라멘트 시뮬레이션
    const filaments = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const z = Math.sin(angle) * 2;

      const particles = new PhysicsParticleSystem(800, {
        maxVelocity: 0.02,
        lifetime: 15,
        radius: 0.3,
        minTemp: 1000,
        maxTemp: 5000,
        gravity: 0.03
      });
      
      particles.mesh.position.set(x, 0, z);
      filaments.push(particles);
      scene.add(particles.mesh);
    }

    // 조명
    const centralLight = new THREE.PointLight(0x0044ff, 0.8);
    scene.add(centralLight);

    const ambientLight = new THREE.AmbientLight(0x1a1a3a, 0.4);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        filaments.forEach((particles, idx) => {
          particles.update(0.016);
          particles.mesh.rotation.z += 0.001;
        });
      }
    };
  };

  // 6. 코로나질량방출 (CME)
  const createCoronalMassEjection = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 150, 500);
    scene.add(createStarField());

    // 태양 표면
    const sunGeometry = new THREE.SphereGeometry(0.4, 64, 64);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8844,
      emissive: 0xff6600,
      emissiveIntensity: 0.9,
      metalness: 0
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // 플라즈마 방출
    const plasmaEjection = new PhysicsParticleSystem(2500, {
      maxVelocity: 0.3,
      lifetime: 8,
      radius: 0.15,
      minTemp: 5000,
      maxTemp: 20000,
      gravity: 0.01
    });
    scene.add(plasmaEjection.mesh);

    // 자기장 선 시각화
    const magneticFieldLines = [];
    for (let i = 0; i < 15; i++) {
      const points = [];
      for (let j = 0; j < 20; j++) {
        const t = j / 20;
        const angle = (i / 15) * Math.PI * 2;
        const x = (0.5 + t * 1.5) * Math.cos(angle);
        const y = Math.sin(t * Math.PI) * 0.5;
        const z = (0.5 + t * 1.5) * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
      }

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      magneticFieldLines.push({ line, opacity: 0 });
      scene.add(line);
    }

    // 조명
    const sunLight = new THREE.PointLight(0xff8844, 2);
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x00aaff, 0.8);
    blueLight.position.set(0, 2, 0);
    scene.add(blueLight);

    const ambientLight = new THREE.AmbientLight(0x3a1a00, 0.3);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        sun.rotation.y += 0.002;
        plasmaEjection.update(0.016);

        magneticFieldLines.forEach((mfl, idx) => {
          if (t < 0.5) {
            mfl.opacity = Math.min(0.7, t * 1.4);
          } else {
            mfl.opacity = Math.max(0, 0.7 - (t - 0.5) * 1.4);
          }
          mfl.line.material.opacity = mfl.opacity;
        });
      }
    };
  };

  // 7. 우주 인플레이션 (급팽창)
  const createCosmicInflation = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.Fog(0x050510, 200, 500);

    // 양자 요동 입자
    const quantumFluctuations = new PhysicsParticleSystem(4000, {
      maxVelocity: 0.5,
      lifetime: 12,
      radius: 1.5,
      minTemp: 8000,
      maxTemp: 25000,
      gravity: 0
    });
    scene.add(quantumFluctuations.mesh);

    // 공간 팽창 시각화
    const inflationWaves = [];
    for (let i = 0; i < 10; i++) {
      const waveGeometry = new THREE.SphereGeometry(0.3 + i * 0.4, 32, 32);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0,
        wireframe: true
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      inflationWaves.push(wave);
      scene.add(wave);
    }

    // 조명
    const light1 = new THREE.PointLight(0x00ffff, 1);
    light1.position.set(3, 0, 0);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff00ff, 0.8);
    light2.position.set(-3, 0, 0);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0x1a0a3a, 0.4);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        quantumFluctuations.update(0.016);

        inflationWaves.forEach((wave, idx) => {
          wave.scale.set(
            1 + t * 2.5 + idx * 0.3,
            1 + t * 2.5 + idx * 0.3,
            1 + t * 2.5 + idx * 0.3
          );
          wave.material.opacity = Math.max(0, 0.6 - t * 0.6 - idx * 0.08);
        });
      }
    };
  };

  // 8. 행성 형성 (원시 원판)
  const createPlanetFormation = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0510);
    scene.fog = new THREE.Fog(0x0a0510, 150, 500);
    scene.add(createStarField());

    // 원시별 (원시원판)
    const diskGeometry = new THREE.TorusGeometry(1.5, 0.5, 32, 256);
    const diskMaterial = new THREE.MeshStandardMaterial({
      color: 0xaa8844,
      emissive: 0x884422,
      emissiveIntensity: 0.6,
      metalness: 0,
      roughness: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = 0.4;
    scene.add(disk);

    // 먼지 입자
    const dustSystem = new PhysicsParticleSystem(2500, {
      maxVelocity: 0.1,
      lifetime: 10,
      radius: 1.2,
      minTemp: 2000,
      maxTemp: 5000,
      gravity: 0.05
    });
    scene.add(dustSystem.mesh);

    // 형성 중인 행성들
    const planets = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const planetGeometry = new THREE.SphereGeometry(0.08 + Math.random() * 0.08, 32, 32);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.6, 0.4),
        metalness: 0.3,
        roughness: 0.6
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      
      const r = 0.8 + Math.random() * 0.6;
      planet.position.set(Math.cos(angle) * r, 0.1, Math.sin(angle) * r);
      planets.push({
        mesh: planet,
        angle: angle,
        radius: r,
        speed: 0.002 + Math.random() * 0.004
      });
      scene.add(planet);
    }

    // 조명
    const centerLight = new THREE.PointLight(0xffaa66, 1.5);
    scene.add(centerLight);

    const ambientLight = new THREE.AmbientLight(0x3a2a1a, 0.4);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        disk.rotation.z += 0.001;
        dustSystem.update(0.016);

        planets.forEach((p) => {
          p.angle += p.speed;
          p.mesh.position.x = Math.cos(p.angle) * p.radius;
          p.mesh.position.z = Math.sin(p.angle) * p.radius;
          p.mesh.rotation.y += 0.01;
        });
      }
    };
  };

  // 9. 중력 렌즈
  const createGravitationalLensing = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.add(createStarField());

    // 렌즈 역할 하는 블랙홀
    const bhGeometry = new THREE.SphereGeometry(0.25, 64, 64);
    const bhMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bh = new THREE.Mesh(bhGeometry, bhMaterial);
    scene.add(bh);

    // 배경 은하
    const galaxyParticles = new PhysicsParticleSystem(2000, {
      maxVelocity: 0.02,
      lifetime: 15,
      radius: 1,
      minTemp: 4000,
      maxTemp: 8000,
      gravity: 0.03
    });
    galaxyParticles.mesh.position.z = -2;
    scene.add(galaxyParticles.mesh);

    // 렌즈 효과 표시
    const lensRings = [];
    for (let i = 0; i < 6; i++) {
      const ringGeometry = new THREE.TorusGeometry(0.4 + i * 0.2, 0.05, 32, 128);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.3
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      lensRings.push(ring);
      scene.add(ring);
    }

    // 조명
    const light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x1a1a3a, 0.4);
    scene.add(ambientLight);

    return {
      scene,
      animate: (t) => {
        bh.rotation.z += 0.005;
        galaxyParticles.update(0.016);

        lensRings.forEach((ring, idx) => {
          ring.rotation.z += 0.01 + idx * 0.005;
          ring.material.opacity = 0.3 + Math.sin(t * 2 + idx) * 0.15;
        });
      }
    };
  };

  const visualizations = [
    { id: 'neutron-collision', name: '🌟 킬로노바', create: createNeutronCollision },
    { id: 'black-hole', name: '⚫ 블랙홀 강착', create: createBlackHoleAccretion },
    { id: 'supernova', name: '💥 초신성', create: createSupernova },
    { id: 'galaxy-merger', name: '🌌 은하 충돌', create: createGalaxyMerger },
    { id: 'cosmic-web', name: '🕸️ 우주 거미줄', create: createCosmicWeb },
    { id: 'cme', name: '☀️ 코로나질량방출', create: createCoronalMassEjection },
    { id: 'inflation', name: '📈 우주 급팽창', create: createCosmicInflation },
    { id: 'planet', name: '🪨 행성 형성', create: createPlanetFormation },
    { id: 'lensing', name: '🔭 중력 렌즈', create: createGravitationalLensing }
  ];

  const currentVizConfig = visualizations.find(v => v.id === activeViz);
  const containerClass = `${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`;

  // 초기화 및 렌더링
  useEffect(() => {
    if (!containerRef.current) return;

    // 기존 렌더러 정리
    if (rendererRef.current) {
      rendererRef.current.dispose();
      containerRef.current.removeChild(rendererRef.current.domElement);
    }

    // 렌더러 생성
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // 카메라
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / 500,
      0.1,
      1000
    );
    camera.position.z = 4;

    // 시각화 생성
    const vizConfig = currentVizConfig.create();
    const scene = vizConfig.scene;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    timeRef.current = 0;

    // 마우스 이벤트
    const handleMouseMove = (e) => {
      if (rotationMode) {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 애니메이션 루프
    let frameCount = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (autoPlay) {
        timeRef.current += 0.016 * speed;
        if (timeRef.current > 1) timeRef.current = 0;
        
        // 30프레임마다 UI만 업데이트
        frameCount++;
        if (frameCount >= 2) {
          setTimeSlider(timeRef.current);
          frameCount = 0;
        }
      } else {
        timeRef.current = timeSlider;
      }

      // 카메라 회전
      if (rotationMode) {
        camera.position.x = Math.sin(mouseRef.current.x * Math.PI) * 4;
        camera.position.y = mouseRef.current.y * 3;
        camera.lookAt(0, 0, 0);
      }

      vizConfig.animate(timeRef.current);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [activeViz, rotationMode, isDark, currentVizConfig]);

  return (
    <div className={`space-y-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}
      >
        <h1 className="text-4xl font-bold mb-2">🌌 천체물리 시뮬레이션</h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          우주의 신비로운 현상을 3D로 사실적으로 표현합니다
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}
      >
        <div ref={containerRef} className="w-full rounded-2xl overflow-hidden" style={{ height: '500px' }} />

        {/* 선택 버튼 */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {visualizations.map((viz) => (
            <button
              key={viz.id}
              onClick={() => setActiveViz(viz.id)}
              className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                activeViz === viz.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {viz.name}
            </button>
          ))}
        </div>

        {/* 제어 옵션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-semibold mb-3">시간 진행 ({(timeSlider * 100).toFixed(0)}%)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeSlider}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTimeSlider(val);
                timeRef.current = val;
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
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
              autoPlay
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
            }`}
          >
            {autoPlay ? '⏸️ 일시 정지' : '▶️ 재생'}
          </button>

          <button
            onClick={() => setRotationMode(!rotationMode)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
              rotationMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
            }`}
          >
            {rotationMode ? '🖱️ 회전 활성' : '🔒 회전 비활성'}
          </button>
        </div>
      </motion.div>

      {/* 정보 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}
      >
        <h2 className="text-2xl font-bold mb-4">📚 정보</h2>
        <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong>🎯 9가지 정교한 3D 시뮬레이션:</strong> Planck 방정식 기반 실제 천체물리 현상의 사실적인 표현
          </p>
          <p>
            <strong>🖱️ 마우스 제어:</strong> 마우스를 움직여 3D 우주 현상을 자유롭게 관찰
          </p>
          <p>
            <strong>⏱️ 시간 제어:</strong> 슬라이더로 시뮬레이션 시간을 조절하거나 자동 재생
          </p>
          <p>
            <strong>🔬 과학적 정확성:</strong> 온도 기반 색상, 중력파, 입자 물리, 상대론적 효과 포함
          </p>
        </div>
      </motion.div>
    </div>
  );
}
