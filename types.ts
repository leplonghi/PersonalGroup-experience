
export enum UserRole {
  ALUNO = 'ALUNO',
  PERSONAL = 'PERSONAL',
  CHEFE = 'CHEFE',
  ADMIN = 'ADMIN'
}

export type HealthStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type AssessmentType = 'INICIAL' | 'PERIODICA' | 'EXTRAORDINARIA';
export type CyclePhase = 'ADAPTACAO' | 'CARGA' | 'PICO' | 'RECOVERY';
export type MessageType = 'INSTITUTIONAL' | 'SEGMENTED' | 'MOTIVATIONAL';
export type TimelineEntryType = 'SESSION_COMPLETE' | 'ASSESSMENT_COMPLETE' | 'WELLNESS_BOOKED' | 'WELLNESS_CANCELLED' | 'CYCLE_START' | 'HEALTH_ALERT' | 'VERSION_UPDATE' | 'CHECKIN';

export interface TrainingCycle {
  id: string;
  protocolId: string;
  name: string;
  totalSessions: number;
  currentSession: number;
  startDate: string;
  executionScore: number;
  progressionRate: number;
  presenceRate: number;
  goal: string;
  suggestedLoadIncrement?: number;
}

export interface WellnessService {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
}

export interface WellnessBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'CONFIRMADO' | 'CANCELADO' | 'PENDENTE';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  unit?: string;
  needsAssessment?: boolean;
  lastAssessmentDate?: string;
  wellnessSessionsUsed?: number;
  lastWellnessResetMonth?: number;
  currentCycle?: TrainingCycle;
  healthStatus: HealthStatus;
  isCheckedIn?: boolean;
  checkInTime?: string;
  activeWellnessBookings?: WellnessBooking[];
  healthException?: {
    type: 'STRESS' | 'SLEEP' | 'HEART_RATE' | 'BP';
    message: string;
    impact: string;
    isBlocking: boolean;
  } | null;
}

export type View = 'HOME' | 'AGENDA' | 'PROFILE' | 'MANAGEMENT' | 'SESSION' | 'WELLNESS' | 'PROTOCOL_EDIT' | 'ASSESSMENT' | 'CYCLE_BUILDER' | 'MESSAGES' | 'TIMELINE' | 'CHECKIN';

export interface TimelineEntry {
  id: string;
  userId: string;
  type: TimelineEntryType;
  referenceId: string;
  date: string;
  message: string;
  details?: string;
}

export interface AppMessage {
  id: string;
  userId: string;
  type: MessageType;
  title: string;
  content: string;
  date: string;
  read: boolean;
  author?: string;
}

export interface AssessmentData {
  weight: number;
  fatPercentage: number;
  leanMass: number;
  vo2Max?: number;
  bloodPressure?: string;
  observations: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  chefeId: string;
  date: string;
  type: AssessmentType;
  data: AssessmentData;
  validated: boolean;
}

export interface ProtocolExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  progressionRule: string;
  variations: string;
}

export interface Protocol {
  id: string;
  name: string;
  goal: string;
  version: string;
  lastUpdated: string;
  exercises: ProtocolExercise[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export type RPEValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: number;
  image: string;
  observations?: string;
  variations?: string;
  lastPerformance?: {
    weight: number;
    rpe: number;
    date: string;
  };
}

export interface SessionLog {
  exerciseId: string;
  weight: number;
  value: number; // Renamed from reps to value to support time/reps
  mode: 'REPS' | 'TIME';
  rpe: number;
}
