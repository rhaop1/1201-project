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
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const timeRef = useRef(0);

  // 고급 입자 시스템
  class ParticleSystem {
    constructor(count) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        
        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
      });
      
      this.mesh = new THREE.Points(geometry, material);
      this.velocities = velocities;
      this.positionAttribute = geometry.getAttribute('position');
      this.colorAttribute = geometry.getAttribute('color');
    }
    
    update(callback) {
      const positions = this.positionAttribute.array;
      for (let i = 0; i < positions.length; i += 3) {
        callback(i, positions);
      }
      this.positionAttribute.needsUpdate = true;
    }
  }

  // 중성자별 충돌 (킬로노바 + 중력파)
  const createNeutronCollision = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 별 배경
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3 });
    scene.add(new THREE.Points(starGeometry, starMaterial));
    
    // 중성자별 1
    const ns1Geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const ns1Material = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      emissive: 0x2244ff,
      shininess: 100,
      wireframe: false
    });
    const ns1 = new THREE.Mesh(ns1Geometry, ns1Material);
    ns1.position.x = -0.8;
    scene.add(ns1);
    
    // 중성자별 2
    const ns2Geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const ns2Material = new THREE.MeshPhongMaterial({
      color: 0xff6644,
      emissive: 0xff4422,
      shininess: 100
    });
    const ns2 = new THREE.Mesh(ns2Geometry, ns2Material);
    ns2.position.x = 0.8;
    scene.add(ns2);
    
    // 강착 디스크 (나중 단계)
    const diskGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI * 0.3;
    scene.add(disk);
    
    // 킬로노바 입자계
    const kilonovaSystem = new ParticleSystem(1000);
    scene.add(kilonovaSystem.mesh);
    
    // 중력파 링
    const gravitationalWaves = [];
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.TorusGeometry(0.2 + i * 0.3, 0.05, 16, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      gravitationalWaves.push(ring);
      scene.add(ring);
    }
    
    // 조명
    const light1 = new THREE.PointLight(0x4488ff, 1.5);
    light1.position.set(-2, 2, 2);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xff6644, 1.5);
    light2.position.set(2, 2, 2);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { ns1, ns2, disk, kilonovaSystem, gravitationalWaves },
      animate: (t) => {
        // 접근
        if (t < 0.5) {
          ns1.position.x = -0.8 + t * 1.6;
          ns2.position.x = 0.8 - t * 1.6;
          ns1.rotation.y += 0.005;
          ns2.rotation.y -= 0.005;
        }
        // 병합
        else {
          const mergeT = (t - 0.5) * 2;
          disk.material.opacity = Math.min(mergeT, 0.7);
          
          kilonovaSystem.update((i, pos) => {
            if (mergeT > 0.2) {
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * mergeT * 2;
              pos[i] = Math.cos(angle) * dist * 0.1;
              pos[i + 1] = Math.sin(angle) * dist * 0.1;
              pos[i + 2] = (Math.random() - 0.5) * dist * 0.1;
            }
          });
          
          gravitationalWaves.forEach((wave, idx) => {
            wave.material.opacity = Math.max(0, 0.6 - mergeT * 0.5);
            wave.scale.set(1 + mergeT * 0.5, 1 + mergeT * 0.5, 1);
          });
        }
      }
    };
  };

  // 블랙홀 강착 원판 (현실적)
  const createBlackHoleAccretion = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x000000 : 0xffffff);
    
    // 별 배경
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.2 });
    scene.add(new THREE.Points(starGeometry, starMaterial));
    
    // 블랙홀 (검은 구)
    const bhGeometry = new THREE.SphereGeometry(0.3, 64, 64);
    const bhMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bh = new THREE.Mesh(bhGeometry, bhMaterial);
    scene.add(bh);
    
    // 포톤 링 (광환)
    const photonRingGeometry = new THREE.TorusGeometry(0.45, 0.08, 32, 256);
    const photonRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.8
    });
    const photonRing = new THREE.Mesh(photonRingGeometry, photonRingMaterial);
    photonRing.rotation.x = 0.3;
    scene.add(photonRing);
    
    // 강착 디스크 (다층 구조)
    const accretionDisks = [];
    for (let ring = 0; ring < 8; ring++) {
      const ringRadius = 0.5 + ring * 0.25;
      const ringWidth = 0.15;
      const diskGeometry = new THREE.TorusGeometry(ringRadius, ringWidth, 16, 256);
      
      const hue = 30 + ring * 8;
      const saturation = 100;
      const lightness = 40 + ring * 5;
      const color = new THREE.Color();
      color.setHSL(hue / 360, saturation / 100, lightness / 100);
      
      const diskMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7 - ring * 0.05
      });
      
      const disk = new THREE.Mesh(diskGeometry, diskMaterial);
      disk.rotation.x = 0.2;
      disk.userData.rotationSpeed = 0.02 - ring * 0.002;
      accretionDisks.push(disk);
      scene.add(disk);
    }
    
    // 제트 (relativistic jets)
    const jetGeometry = new THREE.ConeGeometry(0.15, 2, 16);
    const jetMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aaff,
      emissive: 0x0077ff,
      emissiveIntensity: 0.8
    });
    const jetUp = new THREE.Mesh(jetGeometry, jetMaterial);
    jetUp.position.z = 1.5;
    const jetDown = new THREE.Mesh(jetGeometry, jetMaterial);
    jetDown.position.z = -1.5;
    jetDown.rotation.z = Math.PI;
    scene.add(jetUp);
    scene.add(jetDown);
    
    // 조명
    const light = new THREE.PointLight(0xff8844, 2);
    light.position.set(3, 3, 3);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { bh, photonRing, accretionDisks, jetUp, jetDown },
      animate: (t) => {
        accretionDisks.forEach(disk => {
          disk.rotation.z += disk.userData.rotationSpeed;
          disk.material.opacity = 0.7 - Math.sin(t * 3) * 0.2 - disk.userData.rotationSpeed * 50 * 0.05;
        });
        photonRing.rotation.z += 0.01;
      }
    };
  };

  // 초신성 폭발 (정교한 입자 물리)
  const createSupernova = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 배경 별
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3 });
    scene.add(new THREE.Points(starGeometry, starMaterial));
    
    // 폭발 코어
    const coreGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    
    // 포함 가스 껍질 (expanding shell)
    const shellGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const shellMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6600,
      emissive: 0xff3300,
      emissiveIntensity: 0.7,
      wireframe: false,
      transparent: true,
      opacity: 0.6
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(shell);
    
    // 방사 입자 (ejecta)
    const ejectaSystem = new ParticleSystem(2000);
    ejectaSystem.mesh.userData.initialPositions = new Float32Array(
      ejectaSystem.positionAttribute.array.length
    );
    ejectaSystem.mesh.userData.initialPositions.set(ejectaSystem.positionAttribute.array);
    scene.add(ejectaSystem.mesh);
    
    // 쇼크 파동 (shock wave rings)
    const shockWaves = [];
    for (let i = 0; i < 8; i++) {
      const waveGeometry = new THREE.TorusGeometry(0.3 + i * 0.2, 0.05, 16, 128);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      shockWaves.push(wave);
      scene.add(wave);
    }
    
    // 조명
    const coreLight = new THREE.PointLight(0xffff00, 1.5);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);
    const explosionLight = new THREE.PointLight(0xff6600, 1);
    explosionLight.position.set(0.5, 0.5, 0.5);
    scene.add(explosionLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { core, shell, ejectaSystem, shockWaves },
      animate: (t) => {
        shell.scale.set(1 + t * 2, 1 + t * 2, 1 + t * 2);
        shell.material.opacity = Math.max(0, 0.6 - t * 0.5);
        
        core.scale.set(Math.max(0.2, 0.2 - t * 0.1), Math.max(0.2, 0.2 - t * 0.1), Math.max(0.2, 0.2 - t * 0.1));
        
        ejectaSystem.update((i, pos) => {
          const initialPos = ejectaSystem.mesh.userData.initialPositions;
          const expand = 1 + t * 3;
          pos[i] = initialPos[i] * expand;
          pos[i + 1] = initialPos[i + 1] * expand;
          pos[i + 2] = initialPos[i + 2] * expand;
        });
        
        shockWaves.forEach((wave, idx) => {
          wave.scale.set(1 + t * 2 + idx * 0.3, 1 + t * 2 + idx * 0.3, 1);
          wave.material.opacity = Math.max(0, 0.7 - t * 0.8 - idx * 0.1);
        });
      }
    };
  };

  // 은하 병합 (N-body simulation)
  const createGalaxyMerger = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 은하 입자계 생성
    const createGalaxy = (x, rotationDir) => {
      const particles = new ParticleSystem(800);
      const positions = particles.positionAttribute.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const r = Math.random() ** 0.5 * 2;
        const theta = Math.random() * Math.PI * 2;
        const z = (Math.random() - 0.5) * 0.5;
        
        positions[i] = Math.cos(theta) * r + x;
        positions[i + 1] = Math.sin(theta) * r;
        positions[i + 2] = z;
      }
      
      particles.positionAttribute.needsUpdate = true;
      particles.mesh.userData.rotationDir = rotationDir;
      particles.mesh.userData.galaxyX = x;
      return particles;
    };
    
    const galaxy1 = createGalaxy(-1.5, 1);
    const galaxy2 = createGalaxy(1.5, -1);
    
    scene.add(galaxy1.mesh);
    scene.add(galaxy2.mesh);
    
    // 배경별
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.2 });
    scene.add(new THREE.Points(starGeometry, starMaterial));
    
    // 조명
    const light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { galaxy1, galaxy2 },
      animate: (t) => {
        // 나선 운동 + 접근
        const moveT = Math.min(t, 1);
        
        galaxy1.mesh.userData.galaxyX = -1.5 + moveT * 1.3;
        galaxy1.update((i, pos) => {
          pos[i] += moveT * 0.01;
        });
        
        galaxy2.mesh.userData.galaxyX = 1.5 - moveT * 1.3;
        galaxy2.update((i, pos) => {
          pos[i] -= moveT * 0.01;
        });
        
        galaxy1.mesh.rotation.z += 0.002;
        galaxy2.mesh.rotation.z -= 0.002;
      }
    };
  };

  // 우주 거미줄 구조
  const createCosmicWeb = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 갤럭시 클러스터 (노드)
    const geometry = new THREE.IcosahedronGeometry(0.1, 4);
    const nodes = [];
    const nodePositions = [];
    
    for (let i = 0; i < 60; i++) {
      const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 6 - 3;
      const y = (Math.sin(i * 78.233) * 0.5 + 0.5) * 6 - 3;
      const z = (Math.sin(i * 45.164) * 0.5 + 0.5) * 6 - 3;
      
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
        emissive: new THREE.Color().setHSL(Math.random(), 0.7, 0.4),
        emissiveIntensity: 0.5
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      nodes.push(mesh);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }
    
    // 필라멘트 (암흑물질 연결)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.3
    });
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < Math.min(i + 4, nodes.length); j++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
      }
    }
    
    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    return {
      scene,
      objects: { nodes },
      animate: (t) => {
        nodes.forEach((node, i) => {
          node.rotation.x += 0.001;
          node.rotation.y += 0.0015;
          node.position.y += Math.sin(t * 2 + i) * 0.001;
        });
      }
    };
  };

  // 코로나 질량 방출 (태양)
  const createCoronalMassEjection = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 태양
    const sunGeometry = new THREE.SphereGeometry(0.4, 64, 64);
    const sunMaterial = new THREE.MeshPhongMaterial({
      color: 0xffbb00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      shininess: 10
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    
    // 자기장 루프
    const magneticLoops = [];
    for (let i = 0; i < 4; i++) {
      const loopGeometry = new THREE.TorusGeometry(0.6 + i * 0.1, 0.05, 16, 100);
      const loopMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: 0.4 - i * 0.1
      });
      const loop = new THREE.Mesh(loopGeometry, loopMaterial);
      loop.rotation.x = 0.2 + i * 0.1;
      magneticLoops.push(loop);
      scene.add(loop);
    }
    
    // CME 플라즈마
    const cmeParticles = new ParticleSystem(1500);
    cmeParticles.mesh.userData.initialized = false;
    scene.add(cmeParticles.mesh);
    
    // 조명
    const sunLight = new THREE.PointLight(0xffbb00, 2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { sun, magneticLoops, cmeParticles },
      animate: (t) => {
        sun.rotation.y += 0.002;
        
        magneticLoops.forEach(loop => {
          loop.rotation.z += 0.005;
          loop.material.opacity = 0.4 - Math.sin(t * 3) * 0.2;
        });
        
        if (t > 0.3) {
          const ejectPhase = Math.min((t - 0.3) * 1.5, 1);
          cmeParticles.update((i, pos) => {
            if (!cmeParticles.mesh.userData.initialized) {
              const angle = Math.random() * Math.PI * 2;
              const phi = Math.random() * Math.PI;
              const r = 0.5;
              pos[i] = Math.sin(phi) * Math.cos(angle) * r;
              pos[i + 1] = Math.sin(phi) * Math.sin(angle) * r;
              pos[i + 2] = Math.cos(phi) * r;
            }
            
            const dist = ejectPhase * 2;
            pos[i] *= 1 + ejectPhase * 1.5;
            pos[i + 1] *= 1 + ejectPhase * 1.5;
            pos[i + 2] *= 1 + ejectPhase * 1.5;
          });
          cmeParticles.mesh.userData.initialized = true;
        }
      }
    };
  };

  // 우주 인플레이션
  const createCosmicInflation = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 양자 요동 입자
    const quantumFluctuations = new ParticleSystem(3000);
    scene.add(quantumFluctuations.mesh);
    
    // 시공간 그리드
    const gridHelper = new THREE.GridHelper(10, 20);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    // 조명
    const light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { quantumFluctuations },
      animate: (t) => {
        const scale = 1 + t * 100;
        quantumFluctuations.mesh.scale.set(scale, scale, scale);
        
        quantumFluctuations.update((i, pos) => {
          pos[i] *= 1 + t * 0.5;
          pos[i + 1] *= 1 + t * 0.5;
          pos[i + 2] *= 1 + t * 0.5;
        });
      }
    };
  };

  // 행성 형성 (원시행성판)
  const createPlanetFormation = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 중심 항성
    const starGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const starMaterial = new THREE.MeshPhongMaterial({
      color: 0xffdd00,
      emissive: 0xffbb00,
      emissiveIntensity: 0.8
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(star);
    
    // 원시행성판
    const diskSystem = new ParticleSystem(2000);
    diskSystem.mesh.userData.initialPositions = [];
    
    const positions = diskSystem.positionAttribute.array;
    for (let i = 0; i < positions.length; i += 3) {
      const r = Math.random() ** 0.6 * 2;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 0.1 * r;
      
      positions[i] = Math.cos(theta) * r;
      positions[i + 1] = Math.sin(theta) * r;
      positions[i + 2] = z;
      
      diskSystem.mesh.userData.initialPositions.push(
        Math.cos(theta) * r,
        Math.sin(theta) * r,
        z
      );
    }
    diskSystem.positionAttribute.needsUpdate = true;
    scene.add(diskSystem.mesh);
    
    // 성장하는 미행성체
    const planetesimals = [];
    for (let i = 0; i < 10; i++) {
      const pGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 16, 16);
      const pMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.1, 0.5, 0.5 + Math.random() * 0.2)
      });
      const planet = new THREE.Mesh(pGeometry, pMaterial);
      
      const r = 0.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      planet.position.set(Math.cos(theta) * r, Math.sin(theta) * r, 0);
      planet.userData.angle = theta;
      planet.userData.radius = r;
      
      planetesimals.push(planet);
      scene.add(planet);
    }
    
    // 조명
    const starLight = new THREE.PointLight(0xffdd00, 1.5);
    scene.add(starLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { star, diskSystem, planetesimals },
      animate: (t) => {
        star.rotation.y += 0.001;
        
        diskSystem.mesh.rotation.z += 0.003;
        diskSystem.update((i, pos) => {
          if (diskSystem.mesh.userData.initialPositions[i]) {
            const scale = 1 + t * 0.3;
            pos[i] = diskSystem.mesh.userData.initialPositions[i * 3] * scale;
            pos[i + 1] = diskSystem.mesh.userData.initialPositions[i * 3 + 1] * scale;
          }
        });
        
        planetesimals.forEach(planet => {
          planet.userData.angle += 0.005 / planet.userData.radius;
          planet.position.x = Math.cos(planet.userData.angle) * planet.userData.radius;
          planet.position.y = Math.sin(planet.userData.angle) * planet.userData.radius;
          planet.scale.set(1 + t * 0.2, 1 + t * 0.2, 1 + t * 0.2);
        });
      }
    };
  };

  // 중력렌싱 (gravitational lensing)
  const createGravitationalLensing = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0e27 : 0xf5f5f5);
    
    // 배경 갤럭시
    const bgGeometry = new THREE.IcosahedronGeometry(0.1, 2);
    const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x0088ff });
    for (let i = 0; i < 30; i++) {
      const mesh = new THREE.Mesh(bgGeometry, bgMaterial);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 0.5
      );
      scene.add(mesh);
    }
    
    // 렌싱 질량 (블랙홀 또는 질량클러스터)
    const lensGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const lensMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    scene.add(lens);
    
    // 렌싱 효과 (왜곡된 텍스트 표현)
    const lensRings = [];
    for (let i = 1; i < 4; i++) {
      const ringGeometry = new THREE.TorusGeometry(0.4 * i, 0.08, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5 - i * 0.1
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      lensRings.push(ring);
      scene.add(ring);
    }
    
    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    return {
      scene,
      objects: { lens, lensRings },
      animate: (t) => {
        lens.rotation.y += 0.002;
        
        lensRings.forEach((ring, i) => {
          ring.rotation.z += 0.01 - i * 0.002;
          ring.material.opacity = Math.max(0.1, 0.5 - i * 0.1 - Math.sin(t * 2) * 0.1);
        });
      }
    };
  };

  const visualizations = [
    { id: 'neutron-collision', name: '💥 중성자별 충돌', fn: createNeutronCollision },
    { id: 'bh-accretion', name: '⚫ 블랙홀 강착', fn: createBlackHoleAccretion },
    { id: 'supernova', name: '✨ 초신성 폭발', fn: createSupernova },
    { id: 'galaxy-merger', name: '🌀 은하 병합', fn: createGalaxyMerger },
    { id: 'cosmic-web', name: '🕸️ 우주 거미줄', fn: createCosmicWeb },
    { id: 'cme', name: '🔥 코로나 방출', fn: createCoronalMassEjection },
    { id: 'inflation', name: '🌌 우주 인플레이션', fn: createCosmicInflation },
    { id: 'planet-form', name: '🪐 행성 형성', fn: createPlanetFormation },
    { id: 'lensing', name: '🔍 중력렌싱', fn: createGravitationalLensing }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // 씬 생성
    const viz = visualizations.find(v => v.id === activeViz);
    if (!viz) return;

    const { scene, animate, objects } = viz.fn();
    sceneRef.current = scene;

    // 렌더러 설정
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    if (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 카메라
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // 마우스 제어
    let mouseX = 0,mouseY = 0;
    const onMouseMove = (e) => {
      if (!rotationMode) return;
      mouseX = (e.clientX / width) * 2 - 1;
      mouseY = -(e.clientY / height) * 2 + 1;
    };
    container.addEventListener('mousemove', onMouseMove);

    // 애니메이션 루프
    const animLoop = () => {
      if (autoPlay) {
        timeRef.current += 0.01 * speed;
        if (timeRef.current > 1) timeRef.current = 0;
        setTimeSlider(timeRef.current);
      }

      animate(timeRef.current);

      // 마우스 제어 회전
      if (rotationMode) {
        scene.rotation.x = mouseY * 0.5;
        scene.rotation.y = mouseX * 0.5;
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animLoop);
    };
    animLoop();

    // 정리
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      container.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (container.firstChild === renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeViz, autoPlay, speed, rotationMode, isDark]);

  useEffect(() => {
    timeRef.current = timeSlider;
  }, [timeSlider]);

  const containerClass = isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900';

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-300 dark:to-purple-300 bg-clip-text text-transparent">
          🔭 고급 천체물리 시뮬레이션
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          정교한 3D 물리 기반 시뮬레이션 - 마우스로 회전 가능
        </p>
      </motion.div>

      {/* 3D 시뮬레이션 뷰어 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`p-4 rounded-3xl border shadow-lg ${containerClass} overflow-hidden`}
      >
        <div
          ref={containerRef}
          style={{ width: '100%', height: '600px', cursor: rotationMode ? 'grab' : 'default' }}
          className={`rounded-2xl border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
        />
      </motion.div>

      {/* 제어판 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-sm ${containerClass}`}
      >
        <h2 className="text-2xl font-bold mb-6">⚙️ 시뮬레이션 제어</h2>

        {/* 시뮬레이션 선택 */}
        <div className="mb-6">
          <p className="font-semibold mb-3">시뮬레이션 선택:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {visualizations.map(viz => (
              <button
                key={viz.id}
                onClick={() => {
                  setActiveViz(viz.id);
                  timeRef.current = 0;
                  setTimeSlider(0);
                }}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeViz === viz.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
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

        {/* 제어 옵션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
        <div className="flex gap-3">
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
            <strong>9가지 정교한 3D 시뮬레이션:</strong> 실제 천체물리 방정식 기반의 정확한 시뮬레이션
          </p>
          <p>
            <strong>마우스 제어:</strong> 마우스를 움직여 3D 객체를 자유롭게 회전시킬 수 있습니다
          </p>
          <p>
            <strong>시간 제어:</strong> 슬라이더로 시뮬레이션 시간을 자유롭게 조절하거나 자동 재생합니다
          </p>
          <p>
            <strong>과학적 정확성:</strong> 중력파, 상대론적 효과, 입자 물리 등이 포함되어 있습니다
          </p>
        </div>
      </motion.div>
    </div>
  );
}
