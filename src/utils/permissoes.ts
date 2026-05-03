import { User, UserRole } from '../../types';

export const canDeleteUser = (currentUser: User): boolean => {
  return currentUser.role === UserRole.ADMIN;
};

export const canEditPlanOrRole = (currentUser: User): boolean => {
  return currentUser.role === UserRole.ADMIN;
};

export const canManageStaff = (currentUser: User): boolean => {
  return currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.CHEFE;
};

export const canEditProtocols = (currentUser: User): boolean => {
  return currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.CHEFE;
};

export const canPerformAssessments = (currentUser: User): boolean => {
  return currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.CHEFE;
};

// CHEFE specific: can see students but not edit their profile (except for tech things like assessments)
export const canEditStudentProfile = (currentUser: User): boolean => {
  return currentUser.role === UserRole.ADMIN;
};
