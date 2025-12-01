/**
 * 프레젠테이션 애니메이션 유틸리티
 * 발표 보여주기 식의 다양한 모션 효과
 */

// Framer Motion 애니메이션 프리셋
export const animationPresets = {
  // 페이드인
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },

  // 위에서 아래로 페이드인
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // 아래에서 위로 페이드인
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // 왼쪽에서 오른쪽으로
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // 오른쪽에서 왼쪽으로
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // 스케일 업
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },

  // 회전하면서 페이드인
  rotateIn: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.6 },
  },

  // 탄성 애니메이션
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      type: 'spring',
      damping: 13,
      stiffness: 99,
      restDelta: 0.001,
    },
  },

  // 히어로 텍스트
  heroText: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  },

  // 카드 호버
  cardHover: {
    whileHover: { scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    whileTap: { scale: 0.95 },
  },

  // 버튼 호버
  buttonHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
};

// 컨테이너 애니메이션 (자식 요소들의 순차 애니메이션)
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// 자식 요소 애니메이션
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// 숫자 증가 애니메이션 (카운터)
export const CountUpAnimation = ({ from = 0, to = 100, duration = 2 }) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
      opacity: 1,
      transition: {
        duration: duration,
      },
    }),
  };

  return variants;
};

// 텍스트 타이핑 애니메이션
export const typingAnimation = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// 배경 변경 애니메이션
export const backgroundShift = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 8,
      repeat: Infinity,
    },
  },
};

// 페이지 전환 애니메이션
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.4 },
};

// 모달 애니메이션
export const modalVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 },
};

// 드래그 가능한 요소
export const draggableVariants = {
  whileDrag: { scale: 1.1, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' },
};

// 무한 반복 애니메이션 (로딩)
export const pulseAnimation = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// 상단으로 스크롤할 때 아이콘 애니메이션
export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// 그래프 애니메이션 (막대 증가)
export const barChartAnimation = (index) => ({
  initial: { scaleY: 0, opacity: 0 },
  animate: { scaleY: 1, opacity: 1 },
  transition: {
    duration: 0.5,
    delay: index * 0.1,
  },
});

// 원형 진행률 애니메이션
export const circleProgressAnimation = (percentage) => ({
  initial: { strokeDashoffset: 283 },
  animate: { strokeDashoffset: 283 - (283 * percentage) / 100 },
  transition: { duration: 1.5, ease: 'easeInOut' },
});

// 글자 색상 변경 애니메이션
export const colorShift = (colors = ['#3b82f6', '#8b5cf6', '#ec4899']) => ({
  animate: {
    color: colors,
    transition: {
      duration: 4,
      repeat: Infinity,
    },
  },
});

// SVG 경로 그리기 애니메이션
export const pathDrawAnimation = (length) => ({
  initial: {
    strokeDasharray: length,
    strokeDashoffset: length,
  },
  animate: {
    strokeDashoffset: 0,
  },
  transition: {
    duration: 2,
    ease: 'easeInOut',
  },
});
