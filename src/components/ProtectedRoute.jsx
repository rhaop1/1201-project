import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

/**
 * 인증된 사용자만 접근 가능한 라우트
 */
export const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * 특정 역할을 가진 사용자만 접근 가능한 라우트
 */
export const RoleBasedRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * 관리자 전용 라우트
 */
export const AdminRoute = ({ children }) => {
  return <RoleBasedRoute requiredRole="admin">{children}</RoleBasedRoute>;
};

/**
 * 중재자 이상 권한이 필요한 라우트
 */
export const ModeratorRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(['admin', 'moderator'])) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
