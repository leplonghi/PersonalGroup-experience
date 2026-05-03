
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
export type TimelineEntryType = 'SESSION_COMPLETE' | 'ASSESSMENT_COMPLETE' | 'WELLNESS_BOOKED' | 'WELLNESS_CANCELLED' | 'CYCLE_START' | 'HEALTH_ALERT' | 'VERSION_UPDATE' | 'CHECKIN' | 'ADMIN_ACTION';

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
  type: 'WELLNESS' | 'CLASS';
  capacity?: number;
  instructor?: string;
}

export interface WellnessBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'CONFIRMADO' | 'CANCELADO' | 'PENDENTE';
}

export type TypedAgendaItem = 'WELLNESS' | 'CLASS' | 'PERSONAL';

export interface UnifiedAgendaItem {
  id: string;
  type: TypedAgendaItem;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  status: 'CONFIRMADO' | 'CANCELADO' | 'PENDENTE';
  instructor?: string;
  location?: string;
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

  // Extended Profile — Aluno
  sex?: 'M' | 'F' | 'NB';
  age?: number;
  whatsapp?: string;
  trainingPreferences?: string[];   // ['musculação', 'funcional', 'cardio']
  painLimitations?: string;         // texto livre
  objectives?: string[];            // ['hipertrofia', 'emagrecimento', 'saúde']
  injuryHistory?: string;           // texto livre
  photoUrl?: string;                // Firebase Storage URL

  // Extended Profile — Personal
  specialty?: string[];
  availableHours?: string[];        // ['07:00-09:00', '17:00-20:00']
  bio?: string;
  certificates?: string[];

  // Plano e Frequência
  planStart?: string;               // ISO date string
  planEnd?: string;                 // ISO date string
  weeklyFrequency?: number;         // 3-7 treinos por semana
  missedThisWeek?: number;
  noShowCount?: number;

  // Other existing fields
  guestPassesAvailable?: number;
  guestPassesUsed?: string[];

  plan?: {
    type: 'GOLD' | 'PLATINUM' | 'BLACK';
    name: string;
    renewalDate: string;
    status: 'ACTIVE' | 'PENDING' | 'OVERDUE';
    price: string;
  };

  gamification?: {
    level: number;
    points: number;
    badges: string[];
    club?: 'IRON' | 'ELITE' | 'LEGEND';
  };

  healthException?: {
    type: 'STRESS' | 'SLEEP' | 'HEART_RATE' | 'BP';
    message: string;
    impact: string;
    isBlocking: boolean;
  } | null;

  // Security & Integration
  biometricEnabled?: boolean;
  biometricCredentialId?: string;
  connectedDevices?: string[]; // ['APPLE_WATCH', 'MI_BAND', 'GARMIN']
  onboardingStepsCompleted?: string[];

  // Flex System (for Personal/Staff)
  personalFlexStatus?: 'ACTIVE' | 'INACTIVE';
  flexCapabilities?: FlexCapability[];

  // Gym Presence
  status?: 'ACTIVE_IN_GYM' | 'OFFLINE' | 'SYNC_PENDING';

  // Aggregated Stats
  stats?: {
    totalSessions: number;
    totalCheckins: number;
  };

  // Novos campos (Expansão)
  anotacoes?: AnotacaoAluno[];
  recadosNaoLidos?: number;     // contador para badge de notificação
  progresso?: Progresso;        // novo sistema de gamificação
  showInRanking?: boolean;      // controle de privacidade para o Mural da Constância
  importacaoId?: string;        // se veio de planilha, referência ao registro
  onboardingCompleto?: boolean; // controle de primeiro acesso
}

// --- New Interfaces (Etapas 2-5) ---

export interface GymHours {
  open: string;   // 'HH:MM'
  close: string;  // 'HH:MM'
}

export interface GymConfig {
  hours: {
    weekdays: GymHours;   // Mon-Fri
    saturday: GymHours;
    sunday: GymHours;
    holidays: GymHours;
  };
  maxWellnessPerMonth: number;
  timezone: string;       // 'America/Sao_Paulo'
  gymName: string;
  gymUnit: string;
}

export type AdminRequestType = 'MUDANCA_TREINO' | 'TRANCAMENTO' | 'ATESTADO' | 'REPOSICAO' | 'OUTRO' | 'PAGAMENTO' | 'EQUIPAMENTO';
export type AdminRequestStatus = 'pending' | 'approved' | 'rejected';

export interface AdminRequest {
  id: string;
  userId: string;
  userName: string;
  type: AdminRequestType;
  status: AdminRequestStatus;
  reason: string;
  documentUrl?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

export interface EvolutionEntry {
  id: string;
  userId: string;
  date: string;
  photoUrl?: string;
  weight?: number;
  fatPercentage?: number;
  leanMass?: number;
  measures?: Record<string, number>; // { cintura: 80, braco: 35 }
  notes?: string;
}

export interface FrequencyReport {
  userId: string;
  period: 'week' | 'month' | 'year';
  totalSessions: number;
  plannedSessions: number;
  attendanceRate: number;    // 0-100
  noShows: number;
  checkIns: CheckInRecord[];
}

export interface CheckInRecord {
  id: string;
  userId: string;
  timestamp: string;
  method: 'QR' | 'MANUAL' | 'AUTO';
  gymId: string;
}

export interface WellnessSlot {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  available: boolean;
  bookedBy?: string;
  capacity: number;
  enrolled: number;
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
  isAdminOnly?: boolean;
  timestamp?: any;
}

export interface ActionQueueItem {
  id: string;
  userId: string;
  action: string;
  payload: any;
  retryCount: number;
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
  videoUrl?: string; // YouTube ID or Full URL
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

export interface Amenity {
  id: string;
  icon: string;
  title: string;
  description: string;
  isAvailable: boolean;
}

export interface FlexCapability {
  id: string;
  name: string;
  level: number; // 1-5
  lastAssessment: string;
  history: { date: string; level: number }[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface LiveSession {
  studentId: string;
  personalId: string;
  personalName?: string;
  protocolId: string;
  currentExerciseIdx: number;
  currentSet: number;
  isResting: boolean;
  restTimeRemaining: number;
  status: 'ACTIVE' | 'FINISHED';
  lastUpdate: any; // serverTimestamp
  logs: SessionLog[];
}

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface CheckInData {
  id: string;
  uid: string;
  data: string;
  energiaLevel: EnergyLevel;
  limitacao: string | null;
  presente: boolean;
  timestamp: any;
}

export type SessionStatus = 'ACTIVE' | 'DONE';

export interface ExerciseSetLog {
  carga: number;
  timestamp: any;
}

export interface ExerciseLog {
  id: string;
  name: string;
  sets?: ExerciseSetLog[];
}

export interface TrainerLedSession {
  id: string;
  alunoUid: string;
  personalFlexId: string;
  personalNome: string;
  exercicios: ExerciseLog[];
  status: SessionStatus;
  startTime: any;
  endTime?: any;
  rpeGeral?: number;
  notaTrainer?: string;
}

export interface TeamNote {
  id: string;
  alunoUid: string;
  trainerNome: string;
  texto: string;
  timestamp: any;
}

export interface FloorStudent {
  id: string;
  uid: string;
  userName?: string;
  energiaLevel?: EnergyLevel;
  limitacao?: string;
  emSessao?: boolean;
  trainerNome?: string;
}

export interface AcademiaConfig {
  lat: number;
  lng: number;
  raio: number;
  nome: string;
}

export interface HealthInsight {
  type: string;
  message: string;
  timestamp: any;
}

// --- Expansão de Tipos (Coordenador Flex, Gamificação, Mural, Importação) ---

// Permissões do Coordenador Flex (CHEFE) — mais limitado que ADMIN
export interface ChefePermissions {
  podeVerAlunos: boolean;           // ver lista de alunos: sim
  podeEditarAlunos: boolean;        // editar cadastro de alunos: não (somente ADMIN)
  podeVerFinanceiro: boolean;       // ver status de planos: sim (somente leitura)
  podeGerarRelatorios: boolean;     // gerar relatórios de frequência: sim
  podeGerenciarPersonals: boolean;  // gerenciar equipe de personais: sim
  podeVerComunidade: boolean;       // moderar mural da turma: sim
  podeAlterarPlanos: boolean;       // alterar planos de alunos: não (somente ADMIN)
  podeExcluirCadastros: boolean;    // excluir cadastros: não (somente ADMIN)
}

// Anotação pessoal do aluno (privada, somente ele lê)
export interface AnotacaoAluno {
  id: string;
  alunoId: string;
  conteudo: string;
  criadaEm: Date;
  atualizadaEm: Date;
}

// Recado bidirecional: academia → aluno ou aluno → academia/personal
export type RemetenteTipo = 'ACADEMIA' | 'PERSONAL' | 'ALUNO';
export interface Recado {
  id: string;
  paraId: string;         // ID do destinatário
  deId: string;           // ID do remetente
  remetenteRole: RemetenteTipo;
  titulo: string;
  mensagem: string;
  lido: boolean;
  lidoEm?: Date;
  criadoEm: Date;
  fixado: boolean;        // recados importantes ficam fixados no topo
}

export type PostTipo = 'CONQUISTA' | 'PROGRESSO' | 'AVISO_ACADEMIA' | 'MOTIVACAO' | 'GERAL';

export interface PostMural {
  id: string;
  autorId: string;
  autorNome: string;
  autorFoto?: string;
  autorRole: UserRole;
  tipo: PostTipo;
  conteudo: string;
  imagemUrl?: string;
  curtidas: string[];     // array de userIds
  comentarios: ComentarioPost[];
  criadoEm: Date;
  fixado: boolean;        // somente ADMIN/CHEFE podem fixar
  visivel: boolean;       // moderação
}

export interface ComentarioPost {
  id: string;
  autorId: string;
  autorNome: string;
  autorFoto?: string;
  conteudo: string;
  curtidas: string[];     // array de userIds
  criadoEm: Date;
}

export type CategoriaAluno = 'INICIANTE' | 'DEDICADO' | 'CONSTANTE' | 'DESTAQUE' | 'REFERENCIA';
// Nota: "REFERENCIA" equivale ao nível mais alto — o aluno vira referência para a turma

export interface Progresso {
  categoria: CategoriaAluno;
  pontos: number;
  pontosTotalMes: number;
  diasSeguidos: number;           // em vez de "streak"
  maiorSequencia: number;         // recorde pessoal de dias seguidos
  treinosNoMes: number;
  treinosTotais: number;
  conquistasDesbloqueadas: string[];  // IDs das conquistas (em vez de "badges")
  ultimaAtividade: Date;
}

export interface Conquista {
  id: string;
  titulo: string;                 // Ex: "Primeiro treino do mês"
  descricao: string;              // Ex: "Você completou seu primeiro treino em março"
  icone: string;                  // nome do ícone Lucide
  cor: string;                    // cor hex
  pontosRecompensa: number;
  condicao: string;               // descrição da condição para desbloquear
  desbloqueadaEm?: Date;
}

export interface ImportacaoAluno {
  id: string;
  nomeCompleto: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  plano: string;
  dataInicio?: string;
  dataVencimento?: string;
  personalResponsavel?: string;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  origem: 'IMPORTACAO_PLANILHA' | 'CADASTRO_APP' | 'MANUAL';
  importadoEm: Date;
}

export interface LogImportacao {
  id: string;
  arquivo: string;
  totalLinhas: number;
  importadosComSucesso: number;
  mesclados?: number;
  erros: { linha: number; motivo: string }[];
  realizadoEm: Date | any;
  realizadoPor: string;
}

export interface ImportConflict {
  index: number;
  existingUser: User;
  newUserData: Partial<User>;
  differences: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface SugestaoIA {
  cargaSugerida: number;
  razao: string;
  ultimaCarga: number;
  ultimasReps: number;
  confianca: 'ALTA' | 'MEDIA' | 'BAIXA';
}

export interface DicaExecucao {
  exercicioId: string;
  texto: string;
  fonte: 'IA' | 'PERSONAL' | 'SISTEMA';
}

export const ESCALA_ESFORCO = [
  { id: 1, emoji: '😄', label: 'Muito\nleve', descricao: 'Treino leve, quase sem esforço.' },
  { id: 2, emoji: '🙂', label: 'Leve', descricao: 'Tranquilo e controlado — ótimo ritmo.' },
  { id: 3, emoji: '😊', label: 'Ideal', descricao: 'Equilíbrio perfeito de esforço e controle.' },
  { id: 4, emoji: '😅', label: 'Pesado', descricao: 'Treino intenso — deu bastante trabalho!' },
  { id: 5, emoji: '🔥', label: 'Máximo', descricao: 'No limite! Amanhã vai sentir.' },
] as const;
