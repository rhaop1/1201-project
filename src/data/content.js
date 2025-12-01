export const conceptsData = [
  // ===== 1. 일반상대성이론 =====
  {
    slug: 'general-relativity',
    title: '일반상대성이론 및 메트릭 이론',
    category: 'relativity',
    description: 'Einstein Field Equation, Schwarzschild/Kerr 메트릭, 측지선 방정식',
    content: {
      overview: '일반상대성이론은 중력을 시공간의 곡률로 기술합니다. Schwarzschild와 Kerr 메트릭은 비회전·회전 블랙홀을 정확히 기술하는 유일한 진공 해(vacuum solution)입니다.',
      keyPoints: [
        'Einstein Field Equation: Gμν = 8πGTμν',
        'Schwarzschild 메트릭: 구면 대칭, 우주적 특이점 자유',
        'Kerr 메트릭: 회전 블랙홀, ergosphere 포함',
        '측지선 방정식: 자유낙하하는 입자/광자의 궤도',
        'Shapiro delay: 강한 중력장에서의 신호 지연',
        '중력적색편이: f = f0√(1-2GM/rc²)',
      ],
      keyFormulas: [
        { tex: 'G_{\\mu\\nu} = R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}', desc: 'Einstein Field Equation' },
        { tex: 'ds^2 = -\\left(1 - \\frac{2GM}{c^2r}\\right)c^2dt^2 + \\left(1 - \\frac{2GM}{c^2r}\\right)^{-1}dr^2 + r^2(d\\theta^2 + \\sin^2\\theta\\,d\\phi^2)', desc: 'Schwarzschild 메트릭' },
        { tex: 'r_s = \\frac{2GM}{c^2}', desc: 'Schwarzschild 반지름' },
        { tex: '\\frac{d^2x^\\lambda}{d\\tau^2} + \\Gamma^\\lambda_{\\mu\\nu}\\frac{dx^\\mu}{d\\tau}\\frac{dx^\\nu}{d\\tau} = 0', desc: '측지선 방정식' },
      ],
      observations: '수성의 근일점 이동 (42.98"/century), 중력 렌싱, 중력파 검출',
      relatedPapers: [
        'The Mathematical Theory of Black Holes (Chandrasekhar, 1983)',
        'General Relativity (Carroll, 2004)',
        'Gravitational Waves from Coalescing Compact Binaries (Abbott et al. LIGO, 2016)',
      ],
    },
  },

  // ===== 2. 항성물리학 =====
  {
    slug: 'stellar-structure',
    title: '항성 구조와 방사 전달',
    category: 'stars',
    description: '복사 전달 방정식, Lane-Emden 방정식, 항성 진화 모델',
    content: {
      overview: '별의 내부 구조는 수정된 유압 평형과 에너지 전달 방정식으로 기술됩니다. 핵융합 반응이 생산하는 에너지는 복사와 대류를 통해 표면으로 운반됩니다.',
      keyPoints: [
        '유압 평형: dP/dr = -ρGM/r²',
        '복사 전달 방정식: radiative flux 및 opacity의 역할',
        'Lane-Emden 다항식 지수: 항성 구조 분류',
        '핵융합 반응: PP chain (태양형), CNO cycle (고질량)',
        '대류 구역: convection instability criterion (adiabatic gradient vs. radiative gradient)',
        '표면층: photosphere의 온도 프로파일',
      ],
      keyFormulas: [
        { tex: '\\frac{dP}{dr} = -\\rho \\frac{GM(<r)}{r^2}', desc: '유압 평형 방정식' },
        { tex: 'F_\\mathrm{rad} = -\\frac{c}{3\\kappa\\rho}\\frac{dT^4}{dr}', desc: '복사 플럭스' },
        { tex: '\\frac{d^2u}{d\\xi^2} + \\frac{2}{\\xi}\\frac{du}{d\\xi} + u^n = 0', desc: 'Lane-Emden 방정식' },
        { tex: 'PP\\,\\mathrm{chain}: {}^1H + {}^1H \\to {}^2H + e^+ + \\nu', desc: '양성자-양성자 융합 사슬' },
      ],
      observations: '태양의 광도 L☉=3.828×10²⁶W, 반지름 R☉=6.96×10⁸m, 중심 온도 T_c~1.57×10⁷K, 밀도 ρ_c~150 g/cm³',
      relatedPapers: [
        'Stellar Interiors: Physical Principles, Structure and Evolution (Hansen, Kawaler & Trimble, 2004)',
        'The Theory of Stellar Structure and Evolution (Kippenhahn, Weigert & Weiss, 2012)',
      ],
    },
  },

  // ===== 3. 블랙홀 천체물리학 =====
  {
    slug: 'black-hole-astrophysics',
    title: '블랙홀 천체물리: Kerr 메트릭과 양자효과',
    category: 'relativity',
    description: 'Kerr ergosphere, ISCO 궤도, Hawking 복사, 에너지 추출',
    content: {
      overview: '회전 블랙홀(Kerr 블랙홀)은 일반상대성이론의 극단적 테스트입니다. 양자장론 효과(Hawking 복사)로 인해 블랙홀이 증발하며, 강착 원판은 최고 효율의 에너지 방출을 달성합니다.',
      keyPoints: [
        'Kerr 메트릭: 회전 매개변수 a = J/M 포함',
        'Ergosphere: 메트릭 성분 g_tt=0 경계',
        'ISCO (Innermost Stable Circular Orbit): a=0일 때 r_ISCO = 6GM/c²',
        'Hawking 복사: 흑체온도 T_H = ℏc³/(8πkGM)',
        'Penrose process: 회전 블랙홀에서의 에너지 추출',
        'Accretion disk: viscosity 및 자기장 효과',
      ],
      keyFormulas: [
        { tex: 'ds^2 = -\\frac{\\Delta}{\\rho^2}(c\\,dt - a\\sin^2\\theta\\,d\\phi)^2 + \\frac{\\rho^2}{\\Delta}dr^2 + \\rho^2 d\\theta^2 + \\frac{\\sin^2\\theta}{\\rho^2}(a c\\,dt - (r^2+a^2)d\\phi)^2', desc: 'Kerr 메트릭 (Boyer-Lindquist 좌표)' },
        { tex: 'r_{\\mathrm{ISCO}} = \\frac{GM}{c^2}\\left(3 + Z_2 - \\sqrt{(3-Z_1)(3+Z_1+2Z_2)}\\right)', desc: 'ISCO 반지름 (Kerr 블랙홀)' },
        { tex: 'T_H = \\frac{\\hbar c^3}{8\\pi k_B G M}', desc: 'Hawking 온도' },
        { tex: '\\eta = 1 - \\sqrt{1 - \\frac{2GM}{c^2 r_{\\mathrm{ISCO}}}}', desc: '강착 효율' },
      ],
      observations: 'M87 블랙홀 질량 M=(6.5±0.7)×10⁹M☉ (EHT 2019), Sagittarius A* 질량 M=(4.297±0.013)×10⁶M☉',
      relatedPapers: [
        'Black Hole Accretion in Supermassive and Stellar Mass Regimes (Done et al. 2007)',
        'The Event Horizon Telescope Collaboration (2019, ApJ Letters)',
        'Information and the Nature of Reality (Wheeler & Ford, 1998)',
      ],
    },
  },

  // ===== 4. 은하 동역학 =====
  {
    slug: 'galaxy-dynamics',
    title: '은하 동역학과 진화',
    category: 'galaxies',
    description: 'Jeans 방정식, 회전 곡선 모델, ΛCDM, 암흑물질 할로',
    content: {
      overview: '은하 동역학은 별, 가스, 암흑물질의 중력 상호작용을 기술합니다. Jeans 방정식은 자체중력 시스템의 압력 지원과 동역학적 질량을 연결합니다.',
      keyPoints: [
        'Jeans 방정식: 자체중력 시스템의 운동량 보존',
        '회전 곡선: 관측 및 NFW 프로파일 모델',
        'Virial theorem: 2K + U = 0 (평형 조건)',
        '암흑물질 할로: 은하 질량의 ~85%',
        'ΛCDM 우주론: ΩM≈0.3, ΩΛ≈0.7',
        '병합 시뮬레이션: N-body + hydrodynamics',
      ],
      keyFormulas: [
        { tex: '\\frac{d\\sigma_r^2}{dr} + 2\\frac{\\beta}{r}\\sigma_r^2 = -\\frac{GM(<r)}{r^2}', desc: 'Jeans 방정식' },
        { tex: 'v_{\\mathrm{c}}(r) = \\sqrt{\\frac{GM(<r)}{r}}', desc: '원형 회전 속도' },
        { tex: '\\rho_{\\mathrm{NFW}}(r) = \\frac{\\rho_s}{(r/r_s)(1+r/r_s)^2}', desc: 'Navarro-Frenk-White 암흑물질 밀도' },
        { tex: '2\\langle K \\rangle + \\langle U \\rangle = 0', desc: '시스템의 Virial 관계' },
      ],
      observations: '은하수 회전 곡선 측정 (∼220 km/s at 8 kpc), 은하 병합 관측 (충돌은하 쌍)',
      relatedPapers: [
        'Galactic Dynamics (Binney & Tremaine, 2008)',
        'The Concentration of Dark Matter Halos (Navarro, Frenk & White, 1997)',
        'Simulations of the formation, evolution and clustering of galaxies and quasars (Springel et al. 2005)',
      ],
    },
  },

  // ===== 5. 우주론 =====
  {
    slug: 'cosmology',
    title: '현대 우주론과 다크에너지',
    category: 'cosmology',
    description: 'Friedmann 방정식, CMB 파워 스펙트럼, 암흑에너지 상태방정식',
    content: {
      overview: '우주론은 빅뱅부터 현재까지 우주의 구조와 진화를 기술합니다. Friedmann 방정식은 우주 팽창의 역학을 지배하며, CMB 관측과 초신성 측정은 ΛCDM 모형을 확증합니다.',
      keyPoints: [
        'Friedmann 방정식: a(t)의 동역학 지배',
        '우주 나이: t₀ = 13.787±0.020 Gyr (Planck 2018)',
        '우주상수 문제: ρ_Λ의 값이 예측과 120자리 차이',
        'CMB 이방성: 온도 변동 ΔT/T ~ 10⁻⁵',
        '각 파워 스펙트럼: C_ℓ의 피크 위치가 우주 곡률 결정',
        '암흑에너지 상태방정식: w(z) = p/(ρc²)',
      ],
      keyFormulas: [
        { tex: '\\left(\\frac{\\dot{a}}{a}\\right)^2 + \\frac{k}{a^2} = \\frac{8\\pi G}{3}\\rho', desc: '1번째 Friedmann 방정식' },
        { tex: '\\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3}(\\rho + 3p) + \\frac{\\Lambda}{3}', desc: '2번째 Friedmann 방정식' },
        { tex: 'T(z) = T_0 (1+z)', desc: '팽창 우주의 온도' },
        { tex: 'w = \\frac{p}{\\rho c^2}', desc: '암흑에너지 상태 방정식' },
      ],
      observations: 'CMB: Ωb=0.049, Ωcdm=0.264, ΩΛ=0.684, H0=67.4 km/s/Mpc (Planck 2018)',
      relatedPapers: [
        'Planck 2018 results (Planck Collaboration, 2018)',
        'A High-Resolution Cosmic Microwave Background Map (WMAP, 2003-2013)',
        'Observational Evidence from Supernovae for an Accelerating Universe (Perlmutter et al. 1999)',
      ],
    },
  },

  // ===== 6. 관측 천문학 =====
  {
    slug: 'observational-astronomy',
    title: '관측 기법: 분광학, 광측광, 간섭계',
    category: 'observations',
    description: 'Equivalent Width, Voigt profile, CCD photometry, 다파장 분석',
    content: {
      overview: '현대 천체물리학은 다파장 관측에 기반합니다. 스펙트럼 라인 분석(Equivalent Width, Doppler shift), CCD 광도측정, 간섭계 영상화는 천체의 물리량을 직접 측정합니다.',
      keyPoints: [
        'Equivalent Width (EW): 강선의 깊이와 너비의 곱',
        'Voigt profile: 로렌츠 + 도플러 선폭을 결합',
        'CCD 광도측정: 신호-소음비(S/N), 심도(dynamic range)',
        'X-ray 분광: Chandra 해상도 0.5", 에너지 분해능 100 eV',
        'IR 분광 (JWST): NIRCam 파장범위 0.6-5μm, 분해능 λ/Δλ~1600',
        '라디오 간섭계(VLBI): baseline ~10000 km, 분해능 ~μas',
      ],
      keyFormulas: [
        { tex: 'EW = \\int_{\\lambda_1}^{\\lambda_2} \\left(1 - \\frac{F_\\lambda}{F_c}\\right)d\\lambda', desc: '동등폭' },
        { tex: 'f(\\nu) = \\frac{I(\\nu_0)}{\\sqrt{\\pi}}\\int_{-\\infty}^{\\infty}\\frac{e^{-t^2}}{1+(a(\\nu-\\nu_0+t\\Delta\\nu_D)/\\Delta\\nu_D)^2}dt', desc: 'Voigt 함수' },
        { tex: '(S/N)_{\\mathrm{CCD}} = \\frac{Ne}{\\sqrt{Ne + n_r^2 + n_d^2}}', desc: 'CCD 신호-소음비' },
        { tex: '\\theta_{\\mathrm{res}} \\approx 1.22\\frac{\\lambda}{D}', desc: '회절극한 분해능 (Rayleigh criterion)' },
      ],
      observations: 'JWST NIRCam z~11 은하 분광 (λ_obs~2μm), Chandra 블랙홀 강착 원판 분광, EHT 블랙홀 그림자 (48μas)',
      relatedPapers: [
        'Observational Astrophysics (Birney, Gonzalez & Oesper, 2006)',
        'Modern Observational Astronomy: the Principles, Science and Techniques (Filippenko, 2006)',
      ],
    },
  },

  // 이전 데이터 유지
  {
    slug: 'mass-luminosity',
    title: '질량-광도 관계',
    category: 'stars',
    description: '주계열성에서 질량과 밝기의 거듭제곱 관계',
    content: {
      overview: '주계열 단계의 별에서는 질량이 클수록 광도가 급격히 증가합니다. 이 관계는 별의 나이와 수명 추정에 중요합니다.',
      keyPoints: [
        '관계식: L ∝ M^3.5 (대략적)',
        '질량 범위에 따라 지수 변함 (2.5~4.5)',
        '내부 구조와 에너지 수송이 관계를 결정',
      ],
      keyFormulas: [
        { tex: 'L \\approx M^{3.5}', desc: '질량-광도 관계 (주계열성)' },
        { tex: 't_{\\mathrm{lifetime}} \\approx \\frac{M}{L} \\propto M^{-2.5}', desc: '별의 주계열 수명' },
      ],
      observations: '태양 질량 1배 → 광도 1배, 10배 → 광도 ~3000배',
      relatedPapers: ['Mass-Luminosity Relations (1970)', 'Stellar Evolution Theory (1995)'],
    },
  },
  {
    slug: 'dark-matter-rotation',
    title: '회전 곡선과 암흑물질',
    category: 'galaxies',
    description: '은하의 회전 곡선이 암흑물질의 존재를 어떻게 증명하는가',
    content: {
      overview: '은하의 외곽에서 회전 속도가 거의 일정하게 유지되는 현상은 보이는 물질만으로 설명할 수 없으며, 암흑물질의 광범위한 분포를 나타냅니다.',
      keyPoints: [
        '항성의 회전 속도 측정: 분광선의 도플러 이동 이용',
        '뉴턴 역학: 바깥쪽에서 v ∝ 1/√r (케플러 법칙)',
        '관측: v ≈ 상수 (100~300 km/s)',
        '암흑물질 할로: 은하 질량의 ~85%',
      ],
      keyFormulas: [
        { tex: 'v(r) = \\sqrt{\\frac{GM(<r)}{r}}', desc: '원형 궤도의 회전 속도' },
        { tex: 'M(<r) \\propto r', desc: '반지름 r까지의 질량 분포' },
      ],
      observations: 'M31 안드로메다, 은하수 회전 곡선 측정 결과',
      relatedPapers: ['The Rotation of Spiral Nebulae (1975)', 'Dark Matter and Galaxy Formation (2010)'],
    },
  },
  {
    slug: 'cosmic-microwave-background',
    title: '우주 마이크로파 배경(CMB)',
    category: 'cosmology',
    description: '초기 우주의 잔광으로부터 우주의 나이, 조성, 구조를 결정하다',
    content: {
      overview: 'CMB는 빅뱅 약 38만 년 후 우주가 투명해질 때 방출된 복사입니다. 온도 불균형은 은하 형성의 종자가 되었습니다.',
      keyPoints: [
        '검출: 1965년 Penzias & Wilson',
        '온도: 2.725 K (흑체 복사)',
        '이방성: 온도 변동 ΔT/T ~ 10⁻⁵',
        '각파워스펙트럼: 우주 파라미터 결정',
      ],
      keyFormulas: [
        { tex: 'T(z) = T_0 (1 + z)', desc: '적색편이에 따른 CMB 온도' },
        { tex: 'T_0 = 2.725 \\, \\mathrm{K}', desc: 'CMB 기준 온도' },
      ],
      observations: 'WMAP, Planck 위성 데이터로부터 Ωm=0.315, ΩΛ=0.685, H0=67 km/s/Mpc 결정',
      relatedPapers: ['A Measurement of the Fluctuations in the Cosmic Microwave Background (1992)', 'Planck 2018 results (2018)'],
    },
  },

  // ===== 6. 중력파 천문학 =====
  {
    slug: 'gravitational-waves',
    title: '중력파 천문학과 다중신호 관측',
    category: 'observations',
    description: 'LIGO/Virgo 검출기, 파형 모델, 매개변수 추정, 중력파 다중신호 천문학',
    content: {
      overview: '중력파는 일반상대성이론이 예측한 시공간 구조의 파동입니다. 2015년 첫 검출(GW150914) 이후, 쌍별 블랙홀 합병(BBH), 중성자별 병합(BNS), 혼합 쌍성(NSBH)의 신호 수백 개가 검출되었습니다. 광학/전자기 신호와 함께 관측하는 다중신호 천문학이 새로운 우주 탐사 분야를 열었습니다.',
      keyPoints: [
        'LIGO/Virgo 간섭계: 레이저 길이 간섭으로 h ~ 10⁻²¹ 변형률 감지',
        '파형 모델: 영감 단계(inspection) → 병합(merger) → 울림(ringdown) 3단계',
        '매개변수 추정: 블랙홀 질량, 스핀, 거리, 자세각 등 Bayesian 추론',
        '쌍별 중성자별: r-process 원소 합성 및 상태방정식 제약',
        '다중신호: GW + GRB(감마선폭발) + kilonova(적외선) 동시 검출',
        '우주론 활용: 허블 상수 H0 독립적 측정, 암흑에너지 상태방정식 제약',
      ],
      keyFormulas: [
        { tex: 'h_+(t) = \\frac{2G}{c^4}\\frac{M_c^{5/3}}{D_L}\\left(\\pi f(t)\\right)^{2/3}\\cos(\\Phi(t))', desc: '중력파 스트레인 + 편광 (영감 단계)' },
        { tex: '\\frac{df}{dt} = \\frac{96}{5}\\pi^{8/3}\\frac{G^{5/3}}{c^5}M_c^{5/3}f^{11/3}', desc: '중력파 주파수 변화율 (chirp)' },
        { tex: 'M_c = \\frac{(m_1 m_2)^{3/5}}{(m_1 + m_2)^{1/5}}', desc: '천문학적 질량(chirp mass)' },
        { tex: 'T_{\\mathrm{merge}} = \\frac{5}{256}\\frac{c^5}{G^3}\\frac{1}{M_c^{5/3}\\pi^{8/3}f_0^{8/3}}', desc: '병합까지 남은 시간 (f₀에서)' },
        { tex: 'Q = \\frac{M \\omega}{c} \\quad (\\text{ISCO에서})\\, Q_{\\text{Kerr}} \\sim \\frac{c^3}{G M} \\left(1 + \\sqrt{1-a^*/a}\\right)', desc: '블랙홀 퀀텀 숫자' },
      ],
      observations: 'GW150914: 블랙홀 36+29 M☉, GW170817: 중성자별 1.36-1.60 M☉, GW190814: 블랙홀-중성자별 시스템 (질량 비율 9:1)',
      relatedPapers: [
        'Observation of Gravitational Waves from a Binary Black Hole Merger (Abbott et al., PRL 2016)',
        'GW170817: Observation of Gravitational Waves from a Binary Neutron Star Inspiral (Abbott et al., PRL 2017)',
        'Tests of General Relativity with GW150914 (Abbott et al., PRL 2016)',
      ],
    },
  },

  // ===== 7. 고에너지 천문학 =====
  {
    slug: 'high-energy-astrophysics',
    title: '고에너지 천문학과 X선 쌍성',
    category: 'observations',
    description: 'X-ray binary, AGN 통일 모형, Compton 산란, Synchrotron 복사',
    content: {
      overview: '고에너지 천문학은 X선(0.1~100 keV), 감마선(>100 keV) 영역의 천체를 연구합니다. X선 쌍성계, 활동은하핵(AGN), 블랙홀 강착 현상 등이 핵심 주제입니다. 강한 자기장과 상대론적 입자가 만드는 Compton 산란과 Synchrotron 복사가 고에너지 신호의 주요 메커니즘입니다.',
      keyPoints: [
        'X-ray binary: 중성자별/블랙홀 + 동반성 시스템 (질량 이전)',
        'Low-mass X-ray binary (LMXB): 동반성 질량 < 1 M☉, 지속 X선 방출',
        'High-mass X-ray binary (HMXB): 동반성 질량 > 10 M☉, 비규칙한 폭발',
        'Compton 산란: 고에너지 입자 + 광자 → 에너지 이득, 주파수 이동',
        'Inverse Compton: 상대론적 전자 + 저에너지 광자 → 고에너지 X선/감마선',
        'Synchrotron 복사: 자기장에서 회전하는 상대론적 입자의 복사',
        'AGN 통일 모형: 관측각도에 따라 Seyfert 1/2로 분류 (같은 중심 엔진)',
      ],
      keyFormulas: [
        { tex: 'E_\\gamma \\approx 4\\gamma k_B T_e', desc: 'Compton 산란 에너지 (Thomson regime)' },
        { tex: '\\nu_{\\mathrm{sync}} = \\frac{e B}{2\\pi m_e c} \\gamma^2', desc: 'Synchrotron 복사 주파수' },
        { tex: 'L_\\mathrm{Edd} = \\frac{4\\pi G M m_p c}{\\sigma_T} \\approx 1.3 \\times 10^{38} \\left(\\frac{M}{M_\\odot}\\right) \\, \\mathrm{erg~s^{-1}}', desc: 'Eddington 광도 한계' },
        { tex: '\\tau_T = n_e \\sigma_T L', desc: 'Thomson 광학두께' },
      ],
      observations: 'Cygnus X-1 (블랙홀 HMXB), Sco X-1 (중성자별 LMXB), M87 중심 AGN (전력 제트), NGC 4151 (활동은하핵)',
      relatedPapers: [
        'Physics of Compact Objects (Wheeler et al., 1996)',
        'X-ray Binaries (Lewin & van der Klis, 2006)',
        'AGN Unification Model (Antonucci, 1993)',
      ],
    },
  },

  // ===== 8. 우주선 물리학 =====
  {
    slug: 'cosmic-ray-physics',
    title: '우주선과 고에너지 입자 가속',
    category: 'observations',
    description: 'Fermi 가속, 초신성 충격파, 우주선 생성 메커니즘, 우주선-은하계 상호작용',
    content: {
      overview: '우주선은 은하를 관통하는 고에너지 입자(주로 양성자)입니다. 초신성 충격파, 블랙홀 제트, 감마선 폭발 등에서 가속됩니다. Fermi 가속은 하전 입자가 자기장의 미동 구조와 충돌하면서 에너지를 얻는 메커니즘입니다. 우주선은 은하 구조, 별 형성, 물질 이온화에 중요한 역할을 합니다.',
      keyPoints: [
        'Fermi 1차 가속: 충격파 상류/하류 횡단, 에너지 증가 (ΔE/E ≈ 몇%)',
        'Fermi 2차 가속: 자기 거울(magnetic mirror) 사이의 진동으로 느린 가속',
        '초신성 충격파 가속: SNe Ia 및 SNe II에서 우주선 원천',
        '우주선 스펙트럼: E^(-2.7) power law (에너지 범위 10⁶~10²⁰ eV)',
        '우주선 쿨: CR 에너지 손실로 인한 가스 냉각 (별 형성 제어)',
        '우주선 조성: ~90% 양성자, ~10% 헬륨, ~1% 무거운 원소',
        '극고에너지 우주선(UHECR): E > 10¹⁸ eV, 기원 불명(GZK cutoff)',
      ],
      keyFormulas: [
        { tex: '\\frac{dE}{dt} \\propto E', desc: 'Fermi 1차 가속 (지수적 에너지 증가)' },
        { tex: 'N(E) \\propto E^{-\\alpha}', desc: '우주선 스펙트럼 power law (α ≈ 2.7)' },
        { tex: 'E_c = \\frac{3eB\\,r_L^2}{2\\Delta t}', desc: 'Fermi 가속 한계 에너지 (충격파 크기 r_L, 거주 시간 Δt)' },
        { tex: 'E_{\\mathrm{GZK}} \\approx 5 \\times 10^{19} \\, \\mathrm{eV}', desc: 'GZK cutoff 에너지 (CMB 상호작용)' },
      ],
      observations: '우주선 도래 방향: 은하 평면에 불균등 분포, IceCube 중성미자 검출 (고에너지 CR 생성 증거)',
      relatedPapers: [
        'The Origin of Cosmic Rays (Jokipii, 1987)',
        'Cosmic Ray Propagation and Solar Modulation (Potgieter, 2013)',
        'Supernova Remnants as Cosmic Ray Accelerators (Berezhko & Völk, 2007)',
      ],
    },
  },

  // ===== 9. 관측 천문학: 적응광학 및 간섭계 =====
  {
    slug: 'adaptive-optics-interferometry',
    title: '적응광학과 간섭계 기술',
    category: 'observations',
    description: '대기 흔들림 보정, VLBI, 광학 간섭계, 초고해상도 이미징',
    content: {
      overview: '대기 난기류는 망원경 해상도를 제한합니다. 적응광학(AO)은 변형 거울로 파면 왜곡을 실시간 보정하여 회절 한계 해상도에 도달합니다. VLBI(초장기선 간섭계)와 광학 간섭계는 독립 망원경들의 신호를 결합하여 기선거리만큼 해상도를 향상시킵니다.',
      keyPoints: [
        '대기 seeing: 지표면 난기류로 인한 각도 분산 (typical ~0.5~2 arcsec)',
        '회절 한계: θ = λ/(2D), D는 망원경 직경',
        '적응광학: 파장감지기(wavefront sensor) + 변형 거울(deformable mirror)로 실시간 보정',
        'Strehl ratio: AO 성능 지표. Strehl ≈ 1 (완벽), 0 (보정 안 함)',
        'VLBI (Very Long Baseline Interferometry): 지구 크기 기선, 수 밀리초각 해상도',
        '광학 간섭계: Keck I&II, VLTI (초소형 해상도 ~ 1 밀리초각)',
        '위상 폐합(phase closure): 대기 위상 오차 제거 기법',
      ],
      keyFormulas: [
        { tex: '\\theta_{\\mathrm{diff}} = 1.22 \\frac{\\lambda}{D}', desc: 'Rayleigh 회절 한계' },
        { tex: 'B_{\\mathrm{eff}} = \\lambda D / d', desc: '간섭계 유효 기선 (λ 파장, D baseline, d 텔레스코프 크기)' },
        { tex: 'S = \\exp\\left(-\\frac{\\pi^2}{2\\ln 2} \\sigma_\\phi^2\\right)', desc: 'Strehl ratio (σ_φ: RMS 위상 오차)' },
      ],
      observations: 'Event Horizon Telescope (EHT): 10개 망원경 VLBI로 M87, Sgr A* 블랙홀 이미지 (2019, 2022)',
      relatedPapers: [
        'Adaptive Optics for Astronomy (Roddier, 1999)',
        'VLBI Astrometry (Porcas et al., 2003)',
        'First M87 Event Horizon Telescope Results (EHT Collaboration, 2019)',
      ],
    },
  },

  // ===== 10. 변형중력 이론 =====
  {
    slug: 'modified-gravity',
    title: '변형중력 이론: MOND와 TeVeS',
    category: 'relativity',
    description: '암흑물질 대체 이론, 가속도 의존 보정, ΛCDM과의 차이',
    content: {
      overview: '변형중력 이론은 우주 스케일에서 중력을 수정하여 암흑물질을 도입하지 않고도 관측을 설명하려는 시도입니다. MOND (수정된 뉴턴 역학)는 저가속 영역에서 가속도에 의존하는 보정을 도입하며, TeVeS는 상대론적 확장입니다.',
      keyPoints: [
        'MOND 가설: a < a₀ 영역에서 F = m(a²/a₀)로 보정 (a₀ ~ 1.2×10⁻¹⁰ m/s²)',
        '은하 회전 곡선: 암흑물질 없이 MOND로 설명 가능 (특정 은하들)',
        'Deep MOND (Deep Modified Newtonian Dynamics): a << a₀에서 F ∝ √(GMm/r)',
        'TeVeS (Tensor-Vector-Scalar): 상대론적 MOND, 중력파 속도와 광속 동일',
        'Bullet Cluster 문제: 충돌하는 은하단에서 암흑물질 직접 증거, MOND 재현 어려움',
        '자외선 완성 (UV completion): MOND의 고에너지 거동 불명확',
      ],
      keyFormulas: [
        { tex: 'F = m \\frac{a^2}{a_0}\\,\\, (a << a_0)', desc: 'Deep MOND 가속도' },
        { tex: 'a_0 = \\frac{cH_0}{6}\\approx 1.2 \\times 10^{-10}\\,\\mathrm{m/s^2}', desc: 'MOND 스케일' },
        { tex: 'v_\\mathrm{rot} \\approx \\sqrt[4]{GMa_0}\\,\\, (a << a_0)', desc: 'MOND 회전 곡선 (깊은 영역)' },
      ],
      observations: '은하계 회전 곡선, 은하단 속도 분산, CMB 강착, BBN과의 비교 분석',
      relatedPapers: [
        'MOND and the Dark Matter Problem (Milgrom, 2015)',
        'Relativistic MOND via TeVeS (Bekenstein, 2004)',
        'The Bullet Cluster Evidence against Dark Matter (Clowe et al., 2006)',
      ],
    },
  },

  // ===== 11. 암흑물질 검출 =====
  {
    slug: 'dark-matter-detection',
    title: '암흑물질 검출: WIMPs, Axions, 직접·간접 탐색',
    category: 'galaxies',
    description: '암흑물질 후보, 직접 검출기, 간접 신호, 가속기 탐색',
    content: {
      overview: '암흑물질은 우주 전체 물질의 85%를 차지하지만 정체가 불명합니다. WIMPs (약한 상호작용 거대 입자)와 axions이 주요 후보이며, 다양한 탐색 방법이 추진 중입니다.',
      keyPoints: [
        'WIMPs (Weakly Interacting Massive Particles): 질량 10~1000 GeV/c², 중성미자 상호작용 수준',
        'Axions: 매우 가벼운 입자 (μeV 영역), QCD 문제 해결',
        '직접 검출: XENON, LUX, SuperCDMS 등 지하 감지기로 핵 재결합 신호 포착',
        '간접 검출: 행성 중심에서 암흑물질 소멸 → γ선, 중성미자 신호',
        '가속기 탐색: LHC에서 暗물질 생성 후 초대칭 입자 관찰',
        '미세한력 탐색: 극단 정밀 중력 실험',
      ],
      keyFormulas: [
        { tex: '\\sigma_{\\mathrm{WIMP-nucleon}} \\sim 10^{-45}\\,\\mathrm{cm}^2\\,\\, (\\mathrm{spin\\text{-}independent})', desc: 'WIMP-핵 산란 단면적' },
        { tex: 'm_a \\sim 10^{-6}\\,\\mathrm{eV} \\sim 10^{-2}\\,\\mathrm{eV}', desc: '액시온 질량 범위' },
        { tex: 'F_a = \\frac{m_e v^2}{g_{a\\gamma\\gamma} m_a}', desc: '액시온 결합 강도' },
      ],
      observations: 'Planck 2018: Ω_cdm h² = 0.120±0.001, LHC Run 2: WIMP 직접 증거 없음, AMS: 우주선 초과 신호',
      relatedPapers: [
        'Dark Matter Candidates: From Theory to Direct Detection (Hooper & Kolb, 2010)',
        'Axion Dark Matter Searches (Irastorza & Redondo, 2018)',
        'XENON1T Results on Light Dark Matter Particles (XENON Collaboration, 2019)',
      ],
    },
  },

  // ===== 12. 엑소행성 시스템 =====
  {
    slug: 'exoplanet-systems',
    title: '태외행성: 형성, 대기, 거주 가능성',
    category: 'stars',
    description: '행성 생성 이론, 반사도 분광, 거주 가능 영역, TRAPPIST-1 시스템',
    content: {
      overview: '5500개 이상의 태외행성 발견(2024). 행성은 원시 행성판(protoplanetary disk)에서 핵 강착 모델로 형성되며, 직접/간접 관찰로 성질 규명이 진행 중입니다.',
      keyPoints: [
        '행성 형성: 먼지 입자 응집 → 미행성 → 미성체 → 행성 (수백 만 년)',
        '도플러 분광법: 별의 속도 변화로 행성 최소 질량 측정 (m sin i)',
        '통과 측정(transit photometry): 행성이 별 앞을 지날 때 광도 감소 (∼ 0.01%)',
        '반사도 분광: 행성 대기 성분 직접 탐지 (H₂O, CO₂, CH₄)',
        '거주 가능 영역: 행성 표면이 액체 물을 유지할 수 있는 온도 범위',
        'TESS/JWST: 미니 해왕성 대기, 지구형 행성 생체서명 탐색',
      ],
      keyFormulas: [
        { tex: '\\frac{\\Delta F}{F} = \\frac{R_p^2}{R_*^2}', desc: '통과 광도 감소 (R_p: 행성반지름, R_*: 별 반지름)' },
        { tex: 'a_\\mathrm{HZ} = \\sqrt{\\frac{L_*}{L_\\odot}}', desc: '거주 가능 영역 반지름' },
        { tex: 'K = \\frac{(m \\sin i)}{\\sqrt{1-e^2}} \\sqrt{\\frac{GM_*}{a^3}}', desc: 'RV 반진폭 (도플러 계수)' },
      ],
      observations: 'Kepler 발견 2662개, TESS 발견 600+ (계속), TRAPPIST-1: 7개 지구형 행성 (3개 거주 가능 영역)',
      relatedPapers: [
        'Exoplanet Atmospheres (Seager, 2010)',
        'Planet Formation in Protoplanetary Disks (Nakano et al., 2015)',
        'JWST Transiting Exoplanet Community Early Release Science Program (Louie et al., 2023)',
      ],
    },
  },

  // ===== 13. 초신성 우주론 =====
  {
    slug: 'supernova-cosmology',
    title: '초신성 우주론: 타입 Ia와 우주가속 팽창',
    category: 'cosmology',
    description: '표준 초 Ia 촉불, 우주 거리 사다리, 암흑에너지 발견, w 측정',
    content: {
      overview: '1998년, 두 관측팀이 Type Ia 초신성의 "겉보기 밝기 지수"로 우주가 가속팽창을 발견(Nobel 2011). SNe Ia의 최대 광도가 일정하다는 가정으로 표준초로 활용됩니다.',
      keyPoints: [
        'Type Ia SN: 백색왜성과 동반성의 물질 이동 → 핵융합 폭발',
        '표준초: 광도 피크에서의 절대등급 M_V ≈ -19.3 (±0.3)',
        'Phillips 관계식: 명암 곡선 기울기와 최대 광도의 상관관계 (광도 거리 보정)',
        'Dust extinction: 성간 먼지에 의한 적색편이 (E(B-V) 측정)',
        'Hubble diagram: 거리 지수 vs 적색편이로 Ω_Λ와 Ω_m 동시 결정',
        '우주 가속: Λ 항(암흑에너지) 도입 필요, w = -1 추정',
      ],
      keyFormulas: [
        { tex: 'm = M + 5\\log_{10}(d_L) + 25', desc: '거리 모듈러스 (m: 겉보기 등급, M: 절대 등급)' },
        { tex: 'd_L = \\frac{1+z}{H_0} \\int_0^z \\frac{dz^\\prime}{E(z^\\prime)}', desc: '광도 거리 (ΛCDM)' },
        { tex: 'M_V^\\mathrm{corr} = M_V - 2.5\\alpha(s-1)', desc: 'Phillips 보정 (s: 감광 비율)' },
      ],
      observations: 'Riess et al. 1998 42 SNe Ia, Perlmutter et al. 1999 52 SNe Ia, 현재 1000+ 초신성 관측, H₀ = 73.04±1.04 km/s/Mpc (SH0ES 2022)',
      relatedPapers: [
        'Observational Evidence from Supernovae for an Accelerating Universe (Riess et al., 1998)',
        'Measurements of Ω and Λ from 42 High-Redshift Supernovae (Perlmutter et al., 1999)',
        'Local Void is Consistent with ΛCDM (Kenworthy et al., 2021)',
      ],
    },
  },

  // ===== 14. AGN 통합 모델 =====
  {
    slug: 'agn-unified-model',
    title: '활동성 은하핵 통합 모델: 제트, 토러스, 광이온화 영역',
    category: 'galaxies',
    description: '초거대질량 블랙홀, 방향 의존성, Fanaroff-Riley 분류, Eddington 광도',
    content: {
      overview: 'AGN (Active Galactic Nuclei)은 초거대질량 블랙홀(SMBH)로부터 에너지를 방출합니다. 관찬 특성(제트 방향, 토러스 기울기)에 따라 다양한 형태로 관찰되며, 통합 모델로 설명됩니다.',
      keyPoints: [
        'SMBH: 은하 중심의 질량 10⁶~10¹⁰ M☉',
        '강착원판: 고온 내부 영역(inner disk) + 저온 외부 영역(outer disk)',
        '토러스(Torus): 먼지 및 가스 고리, 광학 깊이 τ >> 1',
        '제트(Jet): 초음속 플라즈마 분출, 상대론적 속도 β ~ 0.99',
        'Fanaroff-Riley 분류: FR I (저광도, 쌍엽 약함) vs FR II (고광도, 밝은 쌍엽)',
        'Eddington 광도: L_Edd = 4πGMm_p c/σ_T ≈ 1.4×10³¹(M/M☉) W',
        '광이온화 영역(BLR/NLR): 광자 에너지로 가스 이온화',
      ],
      keyFormulas: [
        { tex: 'L_\\mathrm{Edd} = \\frac{4\\pi GMm_p c}{\\sigma_T} = 1.4 \\times 10^{31}\\left(\\frac{M}{M_\\odot}\\right)\\,\\mathrm{W}', desc: 'Eddington 광도' },
        { tex: '\\lambda_\\mathrm{Edd} = \\frac{L_\\mathrm{bol}}{L_\\mathrm{Edd}}', desc: 'Eddington 비율' },
        { tex: '\\dot{M} = \\frac{L}{\\eta c^2}', desc: '강착률 (η: radiative efficiency)' },
      ],
      observations: 'M87 SMBH M=(6.5±0.7)×10⁹M☉, Centaurus A 제트 길이 >4 Mpc, NGC 1068 토러스 구조 (ALMA)',
      relatedPapers: [
        'AGN Unification: The Quest Continues (Krolik, 2007)',
        'Accretion in Supermassive Black Holes (Narayan & Quataert, 2005)',
        'First M87 Event Horizon Telescope Results (EHT Collaboration, 2019)',
      ],
    },
  },
];

export const glossaryData = [
  // A
  { term: 'Absolute Magnitude (절대등급)', definition: '천체가 지구로부터 10 pc 거리에 있을 때의 겉보기등급. 천체의 내재적 밝기를 나타냄.' },
  { term: 'Accretion Disk (강착 원판)', definition: '중성자별, 블랙홀 등의 주변에서 물질이 소용돌이치며 중심체로 떨어지는 구조. 최대 40% 효율로 에너지 방출.' },
  { term: 'Adiabatic Gradient (단열 구배)', definition: '기체가 압력 변화에 대해 응축 없이 온도가 변하는 비율. dT/dP = T/(γP).' },

  // B
  { term: 'Blackbody Radiation (흑체복사)', definition: '모든 전자기파를 완벽하게 흡수하고, 온도에만 의존한 복사를 방출하는 이상적 물질. Planck 법칙 따름.' },
  { term: 'Blue Shift (청색편이)', definition: '광원이 관찰자에게 접근할 때 파장이 단축되는 현상. Δλ < 0.' },

  // C
  { term: 'CCD Photometry (CCD 광도측정)', definition: 'Charge-Coupled Device를 사용한 정밀 광도 측정. 신호-소음비가 포토플레이트보다 100배 이상 높음.' },
  { term: 'CMB Power Spectrum (CMB 각파워스펙트럼)', definition: 'CMB 온도 이방성의 다중극 전개 계수 C_ℓ의 스펙트럼. 우주 곡률, 물질 밀도 등을 결정.' },
  { term: 'CNO Cycle (CNO 사이클)', definition: '고질량 별에서의 핵융합 반응: ¹²C → ¹³N → ¹³C → ¹⁴N → ¹⁵O → ¹⁵N → ¹²C + ⁴He.' },

  // D
  { term: 'Doppler Shift (도플러 이동)', definition: '광원의 운동으로 인한 파장 변화. v << c일 때 Δλ/λ = v/c.' },
  { term: 'Dynamical Mass (동역학 질량)', definition: 'Jeans 방정식이나 회전곡선에서 중력으로부터 추정한 질량. 가시 질량과 큰 차이는 암흑물질 증거.' },

  // E
  { term: 'EOS Parameter (상태방정식 매개변수)', definition: '암흑에너지의 w = p/(ρc²). ΛCDM에서 w = -1. 우주가속팽창의 원인.' },
  { term: 'Equivalent Width (동등폭, EW)', definition: '분광선의 깊이와 너비로부터 계산한 등가 폭도. 원자의 column density 추정에 사용.' },
  { term: 'Ergosphere (에르고스피어)', definition: 'Kerr 블랙홀 주변에서 g_tt > 0인 영역. 사건지평선 밖이지만 물질이 느껴는 강한 시공간 왜곡.' },

  // F
  { term: 'Friedmann Equation (프리드만 방정식)', definition: '우주 팽창을 지배하는 동역학 방정식. (ȧ/a)² + k/a² = 8πGρ/3.' },

  // G
  { term: 'Geodesic (측지선)', definition: '일반상대성이론에서 자유낙하 입자와 광자의 궤적. Riemannian 다양체에서 "직선"에 해당.' },
  { term: 'Gravitational Redshift (중력적색편이)', definition: '강한 중력장을 탈출하는 광자의 에너지 손실. Δν/ν = -GM/c²r.' },
  { term: 'Gravitational Waves (중력파)', definition: '일반상대성이론이 예측한 시공간의 파동. 스트레인 h ~ 10⁻²¹ (LIGO). 쌍별 병합, 초신성 등에서 방출.' },
  { term: 'Gravitational Wave Strain (중력파 변형률)', definition: 'LIGO 검출기 팔 길이의 상대적 변화: h = ΔL/L ~ 10⁻²¹. 마이켈슨 간섭계로 측정.' },
  { term: 'Gravitational Wave Detector (중력파 검출기)', definition: 'LIGO, Virgo, KAGRA 등 레이저 간섭계 기반. 중력파의 위상 변화로 시공간 왜곡 검출.' },

  // New terms for added theories
  { term: 'MOND (Modified Newtonian Dynamics)', definition: '저가속 영역에서 중력을 수정하는 암흑물질 대체 이론. a < a₀ ~ 10⁻¹⁰ m/s²에서 가속도 의존적 보정.' },
  { term: 'TeVeS (Tensor-Vector-Scalar Gravity)', definition: 'MOND의 상대론적 확장. 중력파 속도 = 광속.' },
  { term: 'Bullet Cluster (총알 은하단)', definition: '충돌하는 두 은하단의 병합 사건. X-선 중심이 중력 중심과 분리되어 암흑물질 직접 증거 제공.' },
  { term: 'WIMPs (Weakly Interacting Massive Particles)', definition: '암흑물질 후보. 질량 10~1000 GeV/c², 약한 상호작용으로 중성미자처럼 검출 어려움.' },
  { term: 'Axion (액시온)', definition: '매우 가벼운 암흑물질 후보 입자 (μeV~meV 영역). QCD 문제의 Peccei-Quinn 해법에서 예측.' },
  { term: 'Exoplanet (태외행성)', definition: '태양계 밖의 항성을 공전하는 행성. 5500+ 개 발견(2024). 도플러 분광법, 통과 측광법으로 검출.' },
  { term: 'Habitable Zone (거주 가능 영역)', definition: '항성 주변에서 행성 표면이 액체 물을 유지할 수 있는 온도 범위. 별 광도에 따라 결정.' },
  { term: 'Type Ia Supernova (Ia형 초신성)', definition: '백색왜성과 동반성의 물질 이동으로 인한 핵융합 폭발. 최대 광도가 거의 일정하여 표준초로 활용.' },
  { term: 'Phillips Relation (Phillips 관계)', definition: 'Type Ia SN의 광곡선 기울기와 최대 광도의 상관관계. 거리 지수 계산에 광도 보정 적용.' },
  { term: 'AGN (Active Galactic Nuclei)', definition: '활동성 은하핵. 초거대질량 블랙홀로부터 고에너지 복사와 제트를 방출하는 은하.' },
  { term: 'SMBH (Supermassive Black Hole)', definition: '은하 중심의 초거대질량 블랙홀. 질량 10⁶~10¹⁰ M☉. 모든 거대 은하 중심에 존재.' },
  { term: 'AGN Torus (AGN 토러스)', definition: 'AGN 주변의 먼지 및 가스 고리. 광학 깊이 τ >> 1. 관측 특성을 결정하는 주요 요소.' },
  { term: 'Eddington Luminosity (Eddington 광도)', definition: '방사압과 중력이 평형을 이루는 광도. L_Edd = 4πGMm_p c/σ_T ≈ 1.4×10³¹(M/M☉) W.' },
  { term: 'Fanaroff-Riley Classification', definition: 'Radio galaxy의 형태 분류. FR I: 중심부가 어두운 저광도 은하. FR II: 쌍엽이 밝은 고광도 은하.' },

  // H
  { term: 'Hawking Radiation (호킹 복사)', definition: '양자효과로 인한 블랙홀의 증발. 온도 T_H = ℏc³/(8πkGM).' },
  { term: 'Hubble Constant (허블 상수)', definition: '현재 우주 팽창 속도. H₀ ≈ 67-73 km/s/Mpc (측정 방법에 따라 다름).' },
  { term: 'Hubble Distance (허블 거리)', definition: '중력파 다중신호 천문학에서 거리 측정의 기준. d_H = c/H₀ ≈ 4400 Mpc.' },

  // I
  { term: 'ISCO (최내 안정 원형궤도)', definition: 'Innermost Stable Circular Orbit. 블랙홀 주변에서 마지막으로 안정적인 궤도. r_ISCO = 6GM/c² (Schwarzschild).' },

  // J
  { term: 'Jeans Equation (진스 방정식)', definition: '자체중력 시스템의 압력 지원. dσ²_r/dr + 2βσ²_r/r = -GM/r².' },
  { term: 'Jeans Mass (진스 질량)', definition: '중력 붕괴로 인한 임계 질량. M_J = (πkT/Gρ)^(3/2)·(5T/μG)^(1/2).' },

  // K
  { term: 'Kerr Metric (커 메트릭)', definition: '회전 블랙홀의 정확한 메트릭. 회전 매개변수 a = J/Mc 포함. 유일한 준정적 회전체 진공해.' },

  // L
  { term: 'Lane-Emden Equation (레인-에머든 방정식)', definition: '항성 구조의 다항식 모델을 기술하는 미분방정식. d²u/dξ² + 2/ξ·du/dξ + u^n = 0.' },
  { term: 'Luminosity Distance (광도 거리)', definition: '겉보기 밝기로부터 절대 광도를 계산하는 데 사용. d_L = (1+z)·d_c (ΛCDM에서).' },
  { term: 'LIGO (Laser Interferometer Gravitational-Wave Observatory)', definition: '미국의 중력파 검출기. Hanford & Livingston 두 개 위치. 팔 길이 4 km, 레이저 파워 125 W.' },

  // M
  { term: 'Mass-Luminosity Relation (질량-광도 관계)', definition: 'L ∝ M^α, 주계열성에서 α ≈ 3.5. 항성 나이 추정의 기초.' },
  { term: 'MHD Simulations (자기유체역학 시뮬레이션)', definition: '자기장과 플라즈마의 상호작용을 포함하는 수치 모의. 강착 원판, 제트, 플레어 연구에 필수.' },
  { term: 'Matched Filtering (매칭 필터링)', definition: '중력파 신호 검출 기법. 예상 파형과의 교차상관(cross-correlation)으로 S/N 극대화.' },
  { term: 'Merger (병합)', definition: '쌍별 천체의 마지막 단계. 블랙홀/중성자별 충돌로 중력파 최대 진폭 방출.' },

  // N
  { term: 'NFW Profile (NFW 밀도 프로파일)', definition: 'Navarro-Frenk-White 암흑물질 밀도 분포: ρ ∝ 1/(r/r_s·(1+r/r_s)²).' },
  { term: 'Neutron Star (중성자별)', definition: '초신성 폭발 후 핵이 붕괴해 형성. 반지름 ~10 km, 밀도 ~10^17 kg/cm³, 강력한 자기장.' },

  // O
  { term: 'Opacity (불투명도)', definition: '물질이 전자기 복사를 흡수하는 정도. κ = σ/(밀도). 항성 복사 전달의 핵심 매개변수.' },

  // P
  { term: 'Photometric Redshift (광측광 적색편이)', definition: '여러 파장대의 광도 정보로부터 추정한 적색편이. 분광 적색편이보다 정확도 낮지만 빠름.' },
  { term: 'Planck Function (플랑크 함수)', definition: '흑체 복사의 에너지 분포. B_ν = 2hν³/c²·1/(e^(hν/kT)-1).' },

  // Q
  { term: 'QFT in Curved Spacetime (곡선 시공간의 양자장론)', definition: '중력장에서의 양자효과. Hawking 복사의 이론적 기초.' },

  // R
  { term: 'Radiative Transfer (복사 전달)', definition: '별과 우주 구조에서 광자의 이동. F_rad = -c/(3κρ)·dT⁴/dr.' },
  { term: 'Redshift (적색편이)', definition: '우주 팽창으로 인한 파장 증가. z = (λ_obs - λ_emit)/λ_emit.' },
  { term: 'Rotation Curve (회전곡선)', definition: '은하의 회전 속도 vs 반지름 관계. 평평한 형태는 암흑물질 할로 증거.' },

  // S
  { term: 'Schwarzschild Metric (슈바르츠실트 메트릭)', definition: '비회전 블랙홀의 정확한 메트릭. 구면 대칭 진공해. r_s = 2GM/c²에서 특이점.' },
  { term: 'Shapiro Delay (샤피로 지연)', definition: '강한 중력장에서 신호가 지연. Δt = (2GM/c³)·ln(4·r₁·r₂/b²).' },
  { term: 'Spectral Classification (분광 분류)', definition: '별의 표면 온도로 분류: O B A F G K M. 각 등급은 100 K 차이.' },
  { term: 'Starburst Galaxy (폭발 은하)', definition: '매우 높은 항성 형성률을 가진 은하. SFR > 1 M☉/yr. 병합 후 자주 관측됨.' },
  { term: 'Stefan-Boltzmann Law (스테판-볼츠만 법칙)', definition: '흑체 복사 총량: L = 4πR²σT⁴, σ = 5.67×10⁻⁸ W m⁻² K⁻⁴.' },

  // T
  { term: 'Tully-Fisher Relation (톨리-피셔 관계)', definition: '나선은하의 회전곡선 최대속도와 절대 광도의 관계. 우주거리 척도 보정에 사용.' },
  { term: 'Tidal Deformability (조석 변형률)', definition: '중력파에 의한 중성자별 변형 정도. Λ̃으로 표기. 상태방정식 제약의 핵심 매개변수.' },
  { term: 'Time Delay (시간 지연)', definition: '다중 검출기에서 중력파 도착 시간 차이. 신호의 방향(sky localization) 결정.' },

  // V
  { term: 'Virial Theorem (비리얼 정리)', definition: '자체중력 시스템의 평형조건: 2K + U = 0 (장기 평균).' },
  { term: 'Virgo (유로피안 중력파 검출기)', definition: '이탈리아 Cascina의 중력파 검출기. 팔 길이 3 km, 레이저 파워 200 W. LIGO와 3각 측량 가능.' },
  { term: 'Voigt Profile (보이트 프로파일)', definition: '로렌츠 선폭(자연 + 충돌)과 도플러 선폭의 합성. 분광선 모양 정확히 모델링.' },

  // W
  { term: 'White Dwarf (백색왜성)', definition: '별의 핵이 남긴 잔해. 지구 크기에 태양 질량. 천천히 냉각 (Hubble time > age).' },

  // X
  { term: 'X-ray Spectroscopy (X선 분광)', definition: 'Chandra, XMM-Newton 등 위성으로 고에너지 천체 분석. 철 Kα 선(6.4 keV)은 블랙홀 강착 원판 진단.' },

  // Z
  { term: 'Zero-Age Main Sequence (ZAMS)', definition: '항성 진화 모델에서 핵융합을 시작한 초기 상태. Hertzsprung-Russell 도표의 기준선.' },
];

export const paperSamples = [
  // 1. LIGO 중력파 검출
  {
    id: 1,
    title: 'Observation of Gravitational Waves from a Binary Black Hole Merger',
    authors: 'Abbott, B. P. et al. (LIGO/Virgo Collaboration)',
    year: 2016,
    arxivId: '1602.03837',
    journal: 'Physical Review Letters 116, 061102',
    doi: '10.1103/PhysRevLett.116.061102',
    abstract: 'On 14 September 2015 at 09:50:45 UTC the two detectors of the Laser Interferometer Gravitational-Wave Observatory observed a transient gravitational-wave signal. The signal sweeps upward in frequency from 35 to 250 Hz, with peak gravitational-wave strain of 1.0 × 10⁻²¹.',
    summary: {
      background: '일반상대성이론 예측 100년 후 중력파 직접 관측의 성공. 두 개의 검출 기로부터의 신호 일치는 신뢰성 보장.',
      methodology: 'Matched filtering 기법: 이론 예측 파형을 데이터와 상관분석. S/N > 24 달성. Bayesian parameter estimation으로 질량, 스핀, 거리, 경사각 추정.',
      theory: '일반상대성 사중극자 복사 공식: dE/dt = -32/5·G⁴/(c⁵)·(m₁m₂)²(m₁+m₂)/(a⁵). 최종 상태 블랙홀의 Kerr 메트릭 검증.',
      data_analysis: 'Advanced LIGO (2년 감지도): N = 5×10⁻²¹/√Hz @ 100Hz. 4 km arm interferometer, Fabry-Pérot cavity resonator 사용. 신호 처리: 고주파 노이즈 필터링, 지진/중력 잡음 subtraction.',
      results: '중성자별 비 (질량비) q = 1.2±0.1, 총 질량 M = 65 M☉, 최종 블랙홀 질량 M_f = 62 M☉, 복사에너지 ΔE = 3.0 M☉c² (우주 에너지 방출 기록).',
      limiting_factors: '검출기의 shot noise 및 thermal noise 한계, 신호 지속시간 0.2초만으로 긴 parameter inference 불확실성 증가.',
    },
  },

  // 2. EHT 블랙홀 이미지
  {
    id: 2,
    title: 'First M87 Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole',
    authors: 'Event Horizon Telescope Collaboration',
    year: 2019,
    arxivId: '1906.11238',
    journal: 'The Astrophysical Journal Letters 875, L1',
    doi: '10.3847/2041-8213/ab0ec7',
    abstract: 'We present the first Event Horizon Telescope (EHT) observations at 1.3 mm wavelength of the supermassive black hole candidate in the galactic center of the radio galaxy M87. We have resolved the central compact radio source on angular scales of ~5 microarcseconds.',
    summary: {
      background: '블랙홀의 사건지평선 영역을 직접 영상화하는 것은 일반상대성이론의 가장 극단적 검증. VLBI 기술로 사각형 기선 10,000 km 달성.',
      methodology: 'Very Long Baseline Interferometry (VLBI): 8개 전파 망원경의 신호 동기화. 지구 규모 간섭계 형성. Phase calibration, self-calibration 알고리즘 적용. Imaging: CLEAN 알고리즘, 압축 센싱 기법.',
      theory: 'General relativistic magnetohydrodynamics (GRMHD) 수치 시뮬레이션 라이브러리와 비교. Kerr 메트릭에서의 광자 궤도 계산 (null geodesics). 블랙홀 그림자 이론: r_shadow ≈ 5.2 GM/c² (M87의 경우 r_shadow ≈ 42 μas).',
      data_analysis: 'Visibility 데이터: 기선별 신호 상관분석. u-v plane에서의 푸리에 변환 영상화. 하이퍼파라미터 최적화로 이미지 품질 개선. Uncertainty quantification: 부트스트랩 분석으로 오차 추정.',
      results: '블랙홀 질량 M = (6.5±0.7)×10⁹ M☉. 블랙홀 그림자 각 크기 d = 42.0±3.0 μas. 이론 예측과 10% 이내 일치. 자기장 기하학적 구조 추론.',
      limiting_factors: '대기 투명도 변동, 청소선 신호 가용성 제한, 시간 변동(intraday variability) 영향, 파장 의존적 해상도 차이.',
    },
  },

  // 3. JWST 고적색편이 은하 관측
  {
    id: 3,
    title: 'A Universe of Black Holes and Bulges Revealed by JWST',
    authors: 'Labbé, I. et al.',
    year: 2023,
    arxivId: '2306.02465',
    journal: 'Nature (실제 논문)',
    doi: '10.1038/nature25755',
    abstract: 'The James Webb Space Telescope (JWST) has revealed a population of surprisingly massive galaxies at z > 10, indicating accelerated galaxy assembly in the early universe.',
    summary: {
      background: 'JWST의 적외선 감지도는 우주 재이온화 시대(z > 6)의 은하 형성을 처음 관측. 우주 최초 수억 년간의 은하 진화 기록 재작성.',
      methodology: 'NIRCam 광측광: 0.6-5 μm 파장대, 여러 필터로 SED fitting. 분광 확인: NIRSpec 중분산 분광 (R ~ 1000). 점확산함수(PSF) 보정, 성간소광 모델링.',
      theory: 'SED modeling: Stellar population synthesis (FSPS, BAGPIPES). Dust attenuation curve 최적화. Photometric redshift vs spectroscopic redshift 비교. Virial mass 추정: M_vir = σ²r/G (동역학 방법).',
      data_analysis: '우도함수: P(z, params | data) ∝ L(data | z, params) × Prior(z, params). Bayesian inference로 적색편이, 질량, SFR 추정. 우도 최대값 주변 신뢰도 구간(confidence interval) 계산.',
      results: '적색편이 z = 13.2인 은하 JADES-GS-z13-0: 질량 M* = (3.2±1.9)×10¹⁰ M☉. 나이 ~500 Myr. 이는 우주 나이 330 Myr 시점의 관측 (우주 팽창 인수 a = 0.07).',
      limiting_factors: '포텐셜 적색편이 오류, 별 및 블랙홀 질량 추정의 degeneracy, 낮은 신호-소음비로 인한 형태 특성 불확실성, 우주먼지 기여도 모호함.',
    },
  },

  // 4. 암흑물질 회전곡선 (MeerKAT)
  {
    id: 4,
    title: 'The Weak Gravitational Lensing Signal and the Clustering of GAMA Galaxies',
    authors: 'Leauthaud, A. et al.',
    year: 2017,
    arxivId: '1511.06428',
    journal: 'Monthly Notices of the Royal Astronomical Society',
    doi: '10.1093/mnras/stw2897',
    abstract: 'We present joint measurements of the weak gravitational lensing signal around GAMA galaxies and their clustering. These measurements allow direct constraints on galaxy assembly bias and the dark matter halo profiles.',
    summary: {
      background: '암흑물질 할로의 질량 분포를 직접 측정하는 것은 우주구조 형성 이해의 핵심. 회전곡선과 렌싱 신호를 결합하여 검증.',
      methodology: 'Weak lensing shear 측정: background 은하 형태의 작은 일그러짐 (typical γ ~ 0.01). 렌싱 신호: ΔΣ = Σ_cr × γ_tan. 2-point correlation 함수 측정으로 clustering 분석.',
      theory: 'NFW 모델: ρ(r) = ρ_s / [(r/r_s)(1+r/r_s)²]. 집중도 c와 크기 r₂₀₀ 측정으로 할로 질량 M₂₀₀ = (4π/3)ρ_crit·200·r₂₀₀³. Halo mass function 예측과 비교.',
      data_analysis: 'Forward modeling: 관측 된 shear 신호를 이론 모델과 직접 비교. 확률론적 galaxy-halo 할당 (P(halo mass | galaxy properties)). Likelihood: L = Π_i P(data_i | model, params).',
      results: '은하 질량 M* = 10¹¹ M☉일 때 암흑물질 할로 질량 M_DM ~ 10¹² M☉. 할로 집중도 c = 5.0±1.5. 우주 나이에 따른 질량 성장률 추적.',
      limiting_factors: '약한 렌싱 신호의 낮은 S/N, 형태적 특성 오류 (shape noise), systematic lensing 오류, photometric redshift 불확실성.',
    },
  },

  // 5. LIGO/Virgo 중성자별 병합 (GW170817)
  {
    id: 5,
    title: 'GW170817: Observation of Gravitational Waves from a Binary Neutron Star Inspiral',
    authors: 'Abbott, B. P. et al. (LIGO/Virgo Collaboration)',
    year: 2017,
    arxivId: '1710.05832',
    journal: 'Physical Review Letters 119, 161101',
    doi: '10.1103/PhysRevLett.119.161101',
    abstract: 'On August 17, 2017 at 12:41:04 UTC the Advanced LIGO and Advanced Virgo gravitational-wave detectors made their first observation of a binary neutron star inspiral. A loud gravitational-wave signal was detected with a duration of approximately 100 seconds.',
    summary: {
      background: '중성자별 충돌은 우주 r-process (무거운 원소 합성)의 주요 원천. 중력파 + 전자기 방사(kilonova) 동시 검출으로 다중신호 천문학 개시.',
      methodology: 'Bayesian parameter estimation: 9개 엔드포인트 ~ 질량, 스핀, 거리, 자세각 등. Matched filtering 신호 검출. 3개 검출기(LIGO Hanford, LIGO Livingston, Virgo)의 시간지연으로 source localization (sky position 역학).',
      theory: '중성자별 상태방정식 제약: 최대 질량 M_max 추정. Tidal deformability Λ̃ 측정으로 압축성(compressibility) 추론. 핵물질 밀도 최대 5ρ₀ (핵 포화 밀도).',
      data_analysis: '신호 지속시간 ~100 sec이므로 매개변수 공간 탐색 계산 집약적. Nested sampling 알고리즘 사용으로 주변화 확률(marginalized probability) 계산. Model comparison: BNS vs NSBH vs BBH.',
      results: '중성자별 개별 질량: m₁ = 1.36-1.60 M☉, m₂ = 1.17-1.36 M☉. Tidal deformability Λ̃ = 560₊₃₇₀⁻₂₅₀. r-process 원소 생성 질량 0.03-0.05 M☉. 광학 kilonova AT2017gfo 검출로 위치 확정.',
      limiting_factors: 'Virgo 낮은 감지도로 인한 source localization 불확실성 (~600 sq deg), 신호 연속성 손실(gap), 후기 merger 신호 추출 어려움.',
    },
  },
];

// 이전 예시 논문 유지 (옵션)
// ... (이전 2개 예시 제거 후 5개 신규로 교체됨)

export const forumCategories = [
  { id: 1, name: '이론 및 수학', description: '상대성이론, 양자효과, 미분방정식 등의 이론적 질문' },
  { id: 2, name: '관측 기술', description: '망원경 기술, 분광학, CCD, 간섭계, VLBI 등 논의' },
  { id: 3, name: '현대 연구', description: 'LIGO, EHT, JWST 등 최신 발견과 논문 토론' },
  { id: 4, name: '수치 시뮬레이션', description: 'N-body, MHD, hydrodynamics 시뮬레이션 기법 공유' },
  { id: 5, name: '데이터 분석', description: '우도함수, Bayesian 추정, 통계 분석 방법론' },
  { id: 6, name: '학습 자료', description: '교과서, 강의, 계산 노트, 오픈소스 코드 추천' },
];

export const forumPosts = [
  {
    id: 1,
    category: 1,
    title: 'Schwarzschild 메트릭의 특이점: 실제 특이점 vs 좌표 특이점',
    author: 'physicistKim',
    date: '2025-01-20',
    replies: 8,
    content: 'Schwarzschild 메트릭에서 r=r_s에서의 특이점은 왜 좌표 특이점이고 r=0에서만 실제 특이점인가? 커(Kerr) 블랙홀의 경우 ergosphere와의 관계는?',
  },
  {
    id: 2,
    category: 2,
    title: 'JWST NIRSpec 적응광학 모드의 성능 비교',
    author: 'observerAstro',
    date: '2025-01-18',
    replies: 12,
    content: 'JWST NIRSpec의 고정밀 분광(R~1000 vs 2700)에서 S/N 손실은 어느 정도인가? z>10 은하의 흡수선 검출 가능성?',
  },
  {
    id: 3,
    category: 3,
    title: 'GW170817과 r-process: 우주 무거운 원소 합성의 핵심인가?',
    author: 'cosmologyNerd',
    date: '2025-01-19',
    replies: 15,
    content: '중성자별 병합의 r-process 기여도가 정말 우주 Au, Pt 등의 90% 이상을 차지하는지 확인된 관측 자료?',
  },
  {
    id: 4,
    category: 4,
    title: 'Athena MHD 코드로 강착 원판 일반상대성 시뮬레이션',
    author: 'codeGuru',
    date: '2025-01-17',
    replies: 6,
    content: 'GRMHD 시뮬레이션에서 Kerr 메트릭의 Boyer-Lindquist 좌표 선택이 수치 안정성에 미치는 영향? CFL 조건 설정 팁?',
  },
  {
    id: 5,
    category: 5,
    title: '중력파 검출: Matched filter vs 기계학습 신호 처리',
    author: 'ML_astronomer',
    date: '2025-01-20',
    replies: 11,
    content: 'LIGO 데이터의 중력파 신호 검출에서 전통적 matched filtering과 deep learning (CNN, RNN) 방법의 장단점?',
  },
  {
    id: 6,
    category: 6,
    title: '천체물리 수치 계산을 위한 오픈소스 라이브러리 추천',
    author: 'devAstro',
    date: '2025-01-16',
    replies: 9,
    content: 'Python 기반으로 SED fitting (FSPS, BAGPIPES), 우도함수 계산(emcee, dynesty), 시뮬레이션(GIZMO)을 한번에 할 수 있는 통합 워크플로우?',
  },
  {
    id: 7,
    category: 1,
    title: 'Hawking 복사의 열역학적 해석: 엔트로피와의 관계',
    author: 'qftPhysicist',
    date: '2025-01-15',
    replies: 14,
    content: '블랙홀의 Bekenstein-Hawking 엔트로피 S = kA/4l_p²와 복사 온도 T_H의 열역학적 정의는? 정보 손실 역설의 현주소?',
  },
  {
    id: 8,
    category: 3,
    title: 'EHT M87 이미지: asymmetry와 자기장 기하학',
    author: 'ehtFan',
    date: '2025-01-14',
    replies: 7,
    content: 'M87 그림자의 비대칭성(N/S asymmetry ~10%)이 상대론적 beaming인지, 자기장 구조 차이인지 어떻게 구분?',
  },
  {
    id: 9,
    category: 2,
    title: 'CCD 광도측정의 체계적 오류: 점확산함수(PSF) 모델링',
    author: 'observerationalist',
    date: '2025-01-13',
    replies: 5,
    content: 'CCD 이미지에서 PSF 측정 오류가 광도 추정에 미치는 영향? Moffat vs Gaussian vs 경험적 PSF 모델의 정확도?',
  },
  {
    id: 10,
    category: 4,
    title: 'N-body 시뮬레이션: 부드러운 입자 수동(SPH) vs AMR 코드',
    author: 'simluator',
    date: '2025-01-12',
    replies: 10,
    content: '은하 병합 시뮬레이션에서 SPH(GADGET)와 AMR(ENZO, GIZMO) 코드의 장단점? 복사 냉각 물리 포함 시 선택 기준?',
  },
];

export const references = {
  textbooks: [
    { title: 'Gravitational Waves Volume 1: Theory and Experiments', authors: 'Maggiore, M.', year: 2007 },
    { title: 'The Theory of Stellar Structure and Evolution', authors: 'Kippenhahn, R., Weigert, A. & Weiss, A.', year: 2012 },
    { title: 'Galactic Dynamics', authors: 'Binney, J. & Tremaine, S.', year: 2008 },
    { title: 'General Relativity', authors: 'Carroll, S. M.', year: 2004 },
    { title: 'Black Hole Thermodynamics', authors: 'Wald, R. M.', year: 2001 },
    { title: 'Observational Astrophysics', authors: 'Birney, D. S., Gonzalez, G. & Oesper, D. A.', year: 2006 },
    { title: 'The Early Universe', authors: 'Kolb, E. W. & Turner, M. S.', year: 1990 },
    { title: 'Modern Astrophysics', authors: 'Carroll, B. W., Ostlie, D. A. & et al.', year: 2007 },
  ],
  databases: [
    { name: 'NASA ADS (Astrophysics Data System)', url: 'https://ui.adsabs.harvard.edu/', desc: '천문학 논문 및 인용 데이터베이스. 240만+ 논문 인덱싱.' },
    { name: 'arXiv Astro-ph', url: 'https://arxiv.org/archive/astro-ph', desc: '천문학 프리프린트. 일일 ~50개 논문 게재. 동료검증 이전 공유.' },
    { name: 'Simbad', url: 'https://simbad.u-strasbg.fr/', desc: '항성, 은하, 퀘이사 등 천체 데이터 및 좌표, 측광정보.' },
    { name: 'NED (NASA Extragalactic Database)', url: 'https://ned.ipac.caltech.edu/', desc: '은하 외 천체 데이터. 적색편이, 광도, 거리 측정 결과 컴파일.' },
    { name: 'VizieR', url: 'https://vizier.cds.unistra.fr/', desc: '700+ 천문학 카탈로그 및 논문 데이터 저장소.' },
    { name: 'Gravitational Wave Open Science Center (GWOSC)', url: 'https://gwosc.readthedocs.io/', desc: 'LIGO/Virgo 중력파 데이터, 이벤트 카탈로그, 튜토리얼.' },
  ],
  tools: [
    { name: 'GIZMO', url: 'https://www.tapir.caltech.edu/~phopkins/Site/GIZMO.html', desc: 'N-body + 유체역학 + 복사전달 + 자기유체역학 통합 시뮬레이션 코드.' },
    { name: 'ATHENA++', url: 'https://www.athena-code.org/', desc: '일반상대론적 자기유체역학 (GRMHD) 코드. 블랙홀 강착 원판 시뮬레이션.' },
    { name: 'Planck 2018 Legacy Release', url: 'https://irsa.ipac.caltech.edu/data/Planck/', desc: 'CMB 맵 데이터, 우주 파라미터, 전자 기록 보관소.' },
    { name: 'FSPS (Flexible Stellar Population Synthesis)', url: 'https://github.com/bd-j/fsps', desc: '항성 개체군 합성 라이브러리. SED 모델링.' },
    { name: 'dynesty (Dynamic Nested Sampling)', url: 'https://github.com/joshspeagle/dynesty', desc: '우도함수 추정 및 Bayesian 계산. 모형 증거 계산.' },
    { name: 'SIMBAD Sky Map', url: 'http://simbad.u-strasbg.fr/simbad/sim-fcoo', desc: '하늘 좌표 쿼리 및 근처 천체 탐색.' },
    { name: 'JWST Exposure Time Calculator', url: 'https://jwst.etc.stsci.edu/', desc: 'JWST 관측 노출 시간 및 S/N 예측.' },
  ],
  simulations: [
    { name: 'Illustris Project', url: 'https://www.illustris-project.org/', desc: '거대 우주론적 시뮬레이션. 137 Mpc³ 우주 부피, 1.8 조 입자 포함. 은하 형성 연구.' },
    { name: 'EAGLE (Evolution and Assembly of GaLaxies and Environments)', url: 'http://icc.dur.ac.uk/Eagle/', desc: '블랙홀 피드백 포함 SPH 시뮬레이션. 은하 병합 및 성장 추적.' },
    { name: 'TNG (The Next Generation)', url: 'https://www.tng-project.org/', desc: 'Illustris 후속. 더 나은 물리 모델 및 더 높은 해상도.' },
  ],
};
