# Prompts de Atualização — PersonalGroup Experience
**Projeto:** PersonalGroup Experience App  
**Studio:** Antigravity  
**Stack:** React + TypeScript + Vite + Firebase + Tailwind CSS  
**Repositório:** `PersonalGroup-experience/`

---

## Como usar este documento

Cada prompt é **independente e sequencial**. Execute um por vez, aguarde a conclusão e validação antes de avançar. A ordem importa — cada prompt assume que o anterior foi aplicado com sucesso.

**Convenções de linguagem adotadas no app:**
| Termo em inglês (evitar) | Termo em português (usar) |
|---|---|
| streak | sequência de treinos / dias seguidos |
| check-in | registrar chegada / marcar presença / entrada |
| coach mode | modo de acompanhamento |
| dashboard | painel / visão geral |
| badge | conquista / medalha |
| feed | mural / novidades / espaço da turma |
| push notification | aviso / lembrete no celular |
| sync | sincronizar / atualizar |
| offline | sem conexão |
| benchmark | comparativo |
| score | desempenho / pontuação |
| level / rank | nível / categoria |
| onboarding | boas-vindas / primeiro acesso |
| wellness | bem-estar |
| hub | espaço / central |
| club | turma / grupo |

---

## PROMPT 01 — Fundação de Tipos (types.ts)

```
Contexto: App React + TypeScript para academia PersonalGroup (São Luís, MA).
Stack: React, TypeScript, Vite, Firebase Firestore, Tailwind CSS.
Arquivo principal de tipos: `types.ts` (raiz do projeto).

TAREFA: Expandir os tipos do app sem remover ou renomear nenhum tipo existente.

Abrir `types.ts` e adicionar/expandir as seguintes interfaces ao final do arquivo
(após os tipos já existentes):

---

### 1. Permissões granulares para Coordenador Flex

O enum `UserRole` já existe com: ALUNO, PERSONAL, CHEFE, ADMIN.
O papel CHEFE representa o Coordenador Flex. Adicionar junto aos tipos existentes:

```typescript
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
```

### 2. Anotações e recados do aluno

```typescript
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
```

### 3. Comunidade / Mural da turma

```typescript
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
  conteudo: string;
  criadoEm: Date;
}
```

### 4. Gamificação brasileira (sem anglicismos)

Substituir ou complementar a estrutura existente de gamification no User. 
Não remover campos existentes, apenas adicionar os novos ao lado:

```typescript
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
```

### 5. Importação de alunos via planilha

```typescript
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
  erros: { linha: number; motivo: string }[];
  realizadoEm: Date;
  realizadoPor: string; // userId do admin
}
```

### 6. Expandir a interface User existente

Localizar a interface `User` em `types.ts` e adicionar os campos que ainda não existem:

```typescript
// Adicionar dentro da interface User (se ainda não existirem):
anotacoes?: AnotacaoAluno[];
recadosNaoLidos?: number;     // contador para badge de notificação
progresso?: Progresso;        // novo sistema de gamificação
importacaoId?: string;        // se veio de planilha, referência ao registro
```

---

REGRAS:
- NÃO remover nenhum tipo, interface ou enum existente.
- NÃO renomear campos existentes.
- Apenas adicionar ao final do arquivo ou expandir interfaces existentes com campos opcionais (?).
- Verificar que o arquivo compila sem erros: `npx tsc --noEmit`.
```

---

## PROMPT 02 — Sistema de Design: Cores e Tipografia

```
Contexto: App React + TypeScript, PersonalGroup Experience.
Arquivos a editar: `tailwind.config.js`, `src/index.css` (ou `index.css` na raiz).
Arquivos de referência (somente leitura): `COLOR_SYSTEM.md`, `UI_UX_AUDIT.md`.

TAREFA: Consolidar e completar o sistema de design sem alterar classes CSS já usadas.

---

### 1. tailwind.config.js

Abrir `tailwind.config.js`. As cores atuais usam prefixo sem "pg-" (ex: `cobalt`, `midnight`).
O CSS usa variáveis com prefixo `pg-` (ex: `--pg-cobalt`). Manter compatibilidade.

Adicionar as seguintes cores à seção `theme.extend.colors` (sem remover as existentes):

```javascript
// Adicionar dentro de theme.extend.colors:
'pg-cobalt':    '#00b6fd',   // alias com prefixo pg- para CSS vars
'pg-deep':      '#021141',
'pg-navy':      '#021141',
'pg-sky':       '#3363a2',
'pg-midnight':  '#01081f',
'pg-success':   '#10B981',
'pg-warning':   '#F59E0B',
'pg-ice':       '#F8FAFC',

// Superfícies semânticas para uso nos componentes:
'pg-surface-dark':  '#0b1f4a',   // cards em dark mode
'pg-surface-light': '#ffffff',   // cards em light mode
'pg-border-main':   'rgba(255,255,255,0.08)',
'pg-text-main':     '#F8FAFC',   // texto principal dark mode
'pg-text-muted':    'rgba(248,250,252,0.50)',
```

Adicionar à seção `theme.extend.animation`:
```javascript
animation: {
  'pulso-suave': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'entrada-baixo': 'slideUp 0.4s ease-out',
  'entrada-cima': 'slideDown 0.3s ease-out',
  'aparecer': 'fadeIn 0.35s ease-out',
},
keyframes: {
  slideUp: {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    '0%': { transform: 'translateY(-10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
},
```

---

### 2. index.css (variáveis CSS globais)

Localizar o bloco `:root` e adicionar as variáveis que ainda não existirem:

```css
:root {
  /* Raios de borda */
  --pg-radius-pill:    9999px;
  --pg-radius-card:    16px;
  --pg-radius-input:   12px;
  --pg-radius-chip:    8px;

  /* Espaçamentos internos de tela */
  --pg-screen-padding: 1rem;      /* 16px — padding lateral padrão */
  --pg-safe-bottom:    5rem;      /* 80px — altura da nav inferior */

  /* Velocidades de transição */
  --pg-transition-fast:   150ms ease;
  --pg-transition-normal: 250ms ease;
  --pg-transition-slow:   400ms ease;
}
```

Adicionar as classes utilitárias globais:

```css
/* Superfície glass — usada em cards e nav */
.glass-surface {
  background: rgba(1, 8, 31, 0.80);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.glass-surface-light {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Tela segura — padding-bottom para dispositivos com home indicator */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0.5rem);
}

/* Container principal do app */
.pg-screen {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  padding-bottom: var(--pg-safe-bottom);
}
```

---

### 3. Verificação final

Após editar, executar:
```bash
npm run build
```
Se houver erros de classe CSS não reconhecida, verificar se o nome da classe está em `tailwind.config.js`.

NÃO remover nenhuma classe existente. Apenas adicionar.
```

---

## PROMPT 03 — Navegação Inferior (Navigation.tsx)

```
Contexto: App PersonalGroup Experience.
Arquivo a editar: `components/Navigation.tsx`.
Arquivo de referência: `App.tsx` (rotas existentes), `constants.ts` (ícones).

TAREFA: Melhorar a navegação inferior com labels descritivos, acessibilidade e
animação de entrada. NÃO mudar as rotas nem a lógica de papéis existente.

---

### 1. Labels de navegação — Aluno

Localizar o bloco `else` (role === ALUNO) com os NavItems.
Atualizar os labels para comunicação mais humana e brasileira:

- `/home` → label: "Início" ✓ (já correto)
- `/messages` → label: "Recados" (era "Mensagens" — mais brasileiro)
- `/evolution` → label: "Saúde" ✓ (já correto)  
- `/student-hub` → label: "Meu Espaço" (era "Hub" — mais acolhedor)

Botão central (já vai para `/session`) — adicionar `aria-label`:
```tsx
aria-label="Iniciar treino"
```

### 2. Labels de navegação — Equipe (Personal / CHEFE / ADMIN)

Localizar o bloco `isManagementRole`:
- `/management` → label: "Painel" ✓ (já correto)
- `/messages` → label: "Equipe" ✓ (já correto)
- `/timeline` → label: "Dados" ✓ (já correto)
- `/admin` → label: "Gestão" ✓ (já correto)

Botão central vai para `/protocol-edit` — adicionar `aria-label`:
```tsx
aria-label="Editar protocolo"
```

### 3. Animação de entrada da nav

Envolver o componente `Navigation` com uma animação suave na montagem.
Adicionar ao elemento raiz `<div>`:
```tsx
className="... animate-entrada-baixo"
```
(A classe `animate-entrada-baixo` foi definida no Prompt 02.)

### 4. Indicador de recados não lidos

Adicionar prop `recadosNaoLidos?: number` ao `NavigationProps`.
Exibir um ponto indicador no ícone de "Recados" (rota `/messages`) quando > 0:

```tsx
// Dentro de NavItem para /messages:
{recadosNaoLidos && recadosNaoLidos > 0 && (
  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-pg-cobalt animate-pulso-suave" />
)}
```

Atualizar a chamada de `<Navigation>` em `App.tsx` para passar a prop quando disponível.

---

REGRAS:
- NÃO mudar nenhuma rota.
- NÃO remover o botão central flutuante com a logo.
- NÃO alterar a lógica de `isManagementRole`.
- Verificar que o TypeScript compila sem erros.
```

---

## PROMPT 04 — Tela Inicial do Aluno (Home / StudentHome)

```
Contexto: App PersonalGroup Experience.
Arquivos a editar: `views/Home.tsx`, `components/home/StudentHome.tsx`.
Arquivos de referência: `types.ts`, `components/home/PersonalHome.tsx`.

TAREFA: Enriquecer a tela inicial do aluno com boas-vindas personalizada,
painel de desempenho do mês e acesso rápido aos próximos passos.
Preservar toda a estrutura e componentes já existentes — apenas adicionar seções.

---

### 1. Saudação personalizada por horário

Em `components/home/StudentHome.tsx`, localizar onde o nome do aluno é exibido.
Substituir a saudação genérica por uma função dinâmica:

```typescript
function saudacaoDoHorario(nome: string): string {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return `Bom dia, ${nome}!`;
  if (hora >= 12 && hora < 18) return `Boa tarde, ${nome}!`;
  return `Boa noite, ${nome}!`;
}
```

### 2. Cartão de sequência de treinos (sem usar a palavra "streak")

Adicionar um componente `CartaoSequencia` ao StudentHome.
Usar os dados `user.progresso?.diasSeguidos` e `user.progresso?.maiorSequencia`.

```tsx
// CartaoSequencia — exibir somente se diasSeguidos > 0
const CartaoSequencia: React.FC<{ progresso?: Progresso }> = ({ progresso }) => {
  if (!progresso || progresso.diasSeguidos === 0) return null;
  return (
    <div className="rounded-pg-premium bg-pg-surface-dark border border-pg-cobalt/20 p-4 mb-3">
      <p className="text-pg-text-muted text-caption uppercase tracking-wider mb-1">
        Você está em sequência
      </p>
      <p className="text-3xl font-black text-pg-cobalt">
        {progresso.diasSeguidos} {progresso.diasSeguidos === 1 ? 'dia' : 'dias'} seguidos
      </p>
      {progresso.maiorSequencia > progresso.diasSeguidos && (
        <p className="text-pg-text-muted text-caption mt-1">
          Seu recorde: {progresso.maiorSequencia} dias
        </p>
      )}
    </div>
  );
};
```

### 3. Resumo do mês (sem "dashboard")

Adicionar um bloco visual discreto com 3 números do mês:
- Treinos realizados (`progresso?.treinosNoMes`)
- Categoria atual (`progresso?.categoria` — ex: "Dedicado")
- Próximo bem-estar disponível (se `wellnessSessionsUsed < 2`)

Usar o layout de 3 colunas com `grid grid-cols-3 gap-3`.

### 4. Atalho para registrar chegada

Se `!user.isCheckedIn`, exibir um card de ação no topo:
```tsx
<button
  onClick={() => navigate('/checkin')}
  className="w-full py-3 rounded-pg-pill bg-pg-cobalt text-midnight font-bold text-sm mb-4 shadow-cobalt"
>
  Registrar chegada na academia
</button>
```
Se `user.isCheckedIn`, substituir por um chip verde: "✓ Você está na academia".

### 5. Recados não lidos

Adicionar abaixo do header um banner discreto (se houver recados não lidos):
```tsx
{recadosNaoLidos > 0 && (
  <button
    onClick={() => navigate('/messages')}
    className="w-full text-left px-4 py-2.5 rounded-pg-card bg-pg-cobalt/10 border border-pg-cobalt/30 text-sm text-pg-cobalt mb-3"
  >
    📬 Você tem {recadosNaoLidos} {recadosNaoLidos === 1 ? 'recado novo' : 'recados novos'}
  </button>
)}
```

---

REGRAS:
- Manter todos os componentes existentes (PlanStatusBanner, AssessmentReminder, etc.).
- Não alterar o layout do PersonalHome.
- Testar em modo claro e escuro.
```

---

## PROMPT 05 — Sessão de Treino (ActiveSession + LiveSession)

```
Contexto: App PersonalGroup Experience.
Arquivos a editar: `views/ActiveSession.tsx`, `views/LiveSessionStudent.tsx`, `views/LiveSessionTrainer.tsx`.
Arquivos de referência: `types.ts`, `services/sessionService.ts`, `data/exercises.ts`.

TAREFA: Adicionar biblioteca de vídeos de execução e melhorar o fluxo de treino
ativo. Não alterar a lógica de cronômetro, séries ou sincronização existente.

---

### 1. Botão de vídeo de execução

Em `views/ActiveSession.tsx`, localizar onde cada exercício é exibido.
Adicionar um botão "Ver execução" que abre um modal quando `exercise.videoUrl` existe:

```tsx
{exercise.videoUrl && (
  <button
    onClick={() => setVideoAberto(exercise.videoUrl!)}
    className="flex items-center gap-1.5 text-pg-cobalt text-sm font-medium mt-2"
  >
    <PlayCircle className="w-4 h-4" />
    Ver execução correta
  </button>
)}
```

### 2. Modal de vídeo

Criar componente `ModalVideo` inline no arquivo:

```tsx
const ModalVideo: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => (
  <div
    className="fixed inset-0 z-modal bg-black/80 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="w-full max-w-sm rounded-pg-premium overflow-hidden bg-midnight" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <span className="text-white font-semibold text-sm">Execução do exercício</span>
        <button onClick={onClose} className="text-pg-text-muted hover:text-white">✕</button>
      </div>
      <div className="aspect-video">
        <iframe
          src={url}
          className="w-full h-full"
          allowFullScreen
          title="Vídeo de execução"
        />
      </div>
    </div>
  </div>
);
```

Adicionar estado: `const [videoAberto, setVideoAberto] = useState<string | null>(null);`
Renderizar `<ModalVideo>` quando `videoAberto !== null`.

### 3. Indicador de séries concluídas mais legível

Localizar onde as séries são exibidas (ex: "2/4 séries").
Substituir por texto mais natural:

```tsx
// Em vez de: "2/4"
// Usar:
<span className="text-pg-text-muted text-sm">
  {seriesFeitas} de {seriesTotais} {seriesTotais === 1 ? 'série' : 'séries'} concluídas
</span>
```

### 4. Feedback ao concluir treino

Ao finalizar a sessão (botão de encerrar), exibir uma tela de parabéns antes de navegar:

```tsx
// Estado: const [treinoConcluido, setTreinoConcluido] = useState(false);
// Ao concluir, setar treinoConcluido = true e mostrar:

{treinoConcluido && (
  <div className="fixed inset-0 z-modal flex flex-col items-center justify-center bg-midnight p-8 text-center animate-aparecer">
    <div className="text-6xl mb-4">💪</div>
    <h2 className="text-2xl font-black text-white mb-2">Treino concluído!</h2>
    <p className="text-pg-text-muted mb-6">
      Mais um dia de cuidado com você mesmo. Isso faz toda a diferença.
    </p>
    <button
      onClick={() => navigate('/home')}
      className="px-8 py-3 rounded-pg-pill bg-pg-cobalt text-midnight font-bold"
    >
      Voltar ao início
    </button>
  </div>
)}
```

---

REGRAS:
- Não alterar a lógica de WebSocket/sincronização em tempo real.
- Não mudar o sistema de séries/repetições/peso já existente.
- O botão de vídeo só aparece se `exercise.videoUrl` estiver preenchido.
```

---

## PROMPT 06 — Registrar Chegada / Check-in (CheckIn.tsx + checkInService.ts)

```
Contexto: App PersonalGroup Experience.
Arquivos a editar: `views/CheckIn.tsx`, `src/services/checkInService.ts` (ou `services/checkInService.ts`).
Arquivos de referência: `types.ts` (campo `isCheckedIn`, `checkInTime` no User).

TAREFA: Melhorar UX do check-in com mensagens humanizadas e tratamento claro
de erros de localização. Não alterar a lógica de GPS/geofencing/QR existente.

---

### 1. Linguagem da tela de check-in

Substituir todos os textos técnicos por linguagem acolhedora:

```tsx
// Título da tela:
"Registrar chegada"  // (não "Check-in" nem "QR Code")

// Instrução abaixo do título:
"Aproxime-se da entrada da academia e toque no botão abaixo para confirmar sua presença."

// Botão principal:
"Estou na academia"  // (não "Fazer check-in" nem "Confirmar GPS")

// Sucesso:
"Boa aula! Sua chegada foi registrada às {hora}."

// Erro de localização — muito longe:
"Parece que você não está na academia ainda. Certifique-se de estar no local e tente novamente."

// Erro de localização — permissão negada:
"Para registrar sua chegada, precisamos saber que você está aqui. Permita o acesso à localização nas configurações do seu celular."

// Erro genérico:
"Não conseguimos registrar sua chegada agora. Tente novamente ou avise na recepção."

// Já registrado:
"Você já está registrado hoje! Bom treino, {nome}."
```

### 2. Feedback visual aprimorado

Substituir spinners genéricos por um indicador contextual:

```tsx
// Durante verificação de localização:
<div className="flex flex-col items-center gap-3">
  <div className="w-16 h-16 rounded-full border-4 border-pg-cobalt/30 border-t-pg-cobalt animate-spin" />
  <p className="text-pg-text-muted text-sm">Verificando sua localização...</p>
</div>
```

### 3. Estado "já na academia"

Quando `user.isCheckedIn === true`, mostrar tela alternativa em vez do botão:

```tsx
<div className="flex flex-col items-center text-center gap-4 py-8">
  <div className="w-20 h-20 rounded-full bg-pg-success/20 flex items-center justify-center">
    <CheckCircle className="w-10 h-10 text-pg-success" />
  </div>
  <div>
    <p className="text-xl font-bold text-white">Você está aqui!</p>
    <p className="text-pg-text-muted text-sm mt-1">
      Chegada registrada às {formatarHora(user.checkInTime)}
    </p>
  </div>
  <button
    onClick={() => navigate('/session')}
    className="mt-2 px-8 py-3 rounded-pg-pill bg-pg-cobalt text-midnight font-bold"
  >
    Iniciar treino
  </button>
</div>
```

---

REGRAS:
- Não alterar coordenadas do geofencing, raio de 5m, lógica QR Code.
- Não alterar `checkInService.ts` exceto se os textos de erro vierem de lá — nesse caso, atualizar apenas as strings de mensagem.
- Verificar que o fluxo continua funcionando com GPS desativado.
```

---

## PROMPT 07 — Agenda e Bem-Estar (Wellness.tsx / Agenda.tsx)

```
Contexto: App PersonalGroup Experience.
Arquivo a editar: `views/Wellness.tsx` (ou `views/Agenda.tsx` — verificar qual existe).
Arquivos de referência: `types.ts` (WellnessService, WellnessBooking), `data/scheduleData.ts`.

TAREFA: Unificar o agendamento de serviços de bem-estar e aulas em grupo numa
tela única com abas. Manter toda a lógica de reserva existente.

---

### 1. Estrutura de abas

Adicionar abas no topo da tela (se ainda não existirem):

```tsx
type AbaAgenda = 'bem-estar' | 'aulas';
const [abaAtiva, setAbaAtiva] = useState<AbaAgenda>('bem-estar');

// Renderizar:
<div className="flex gap-1 bg-pg-surface-dark rounded-pg-pill p-1 mb-4">
  <button
    onClick={() => setAbaAtiva('bem-estar')}
    className={`flex-1 py-2 rounded-pg-pill text-sm font-semibold transition-all ${
      abaAtiva === 'bem-estar'
        ? 'bg-pg-cobalt text-midnight'
        : 'text-pg-text-muted'
    }`}
  >
    Bem-estar
  </button>
  <button
    onClick={() => setAbaAtiva('aulas')}
    className={`flex-1 py-2 rounded-pg-pill text-sm font-semibold transition-all ${
      abaAtiva === 'aulas'
        ? 'bg-pg-cobalt text-midnight'
        : 'text-pg-text-muted'
    }`}
  >
    Aulas em grupo
  </button>
</div>
```

### 2. Contador de sessões de bem-estar

A regra de negócio já existe em `types.ts`: `wellnessSessionsUsed` e `lastWellnessResetMonth`.
Exibir o contador de forma encorajadora (não punitiva):

```tsx
const sessoeRestantes = 2 - (user.wellnessSessionsUsed ?? 0);

// Exibir no topo da aba "bem-estar":
<div className="px-4 py-3 rounded-pg-card bg-pg-surface-dark border border-white/5 mb-4">
  {sessoesRestantes > 0 ? (
    <p className="text-sm text-pg-text-main">
      Você ainda tem{' '}
      <span className="font-bold text-pg-cobalt">
        {sessoesRestantes} {sessoesRestantes === 1 ? 'sessão' : 'sessões'}
      </span>{' '}
      de bem-estar disponíveis este mês.
    </p>
  ) : (
    <p className="text-sm text-pg-text-muted">
      Suas sessões de bem-estar deste mês foram utilizadas. Aproveite as aulas em grupo!
    </p>
  )}
</div>
```

### 3. Linguagem dos cartões de serviço

Para cada serviço exibido, substituir textos técnicos:
- "Disponível" → "Disponível para agendamento"  
- "Reservar" → "Agendar"  
- "Cancelar" → "Cancelar agendamento"  
- "Lotado" → "Vagas esgotadas"  
- "Confirmado" → "Agendado ✓"  
- "Duração: X min" → "Duração: X minutos"

---

REGRAS:
- Não alterar a lógica de reserva, cancelamento e limite mensal já existente.
- Se a view usa `WellnessService.type` para filtrar, manter esse campo.
- Testar os dois fluxos (aluno com sessões disponíveis e sem).
```

---

## PROMPT 08 — Recados e Mensagens (Messages.tsx + SupportChat.tsx)

```
Contexto: App PersonalGroup Experience.
Arquivos a editar: `views/Messages.tsx`, `views/SupportChat.tsx`.
Arquivo a criar (se não existir): `components/RecadosAluno.tsx`.
Arquivos de referência: `types.ts` (novo tipo Recado adicionado no Prompt 01).

TAREFA: Expandir a tela de mensagens para suportar recados bidirecionais
(academia/personal ↔ aluno) e anotações pessoais do aluno.

---

### 1. Abas da tela de Mensagens (para alunos)

Quando `role === UserRole.ALUNO`, mostrar três abas:

```tsx
type AbaMensagens = 'recados' | 'conversa' | 'anotacoes';
```

- **Recados:** mensagens recebidas da academia ou personal (tipo `Recado[]`)
- **Conversa:** chat direto com o personal (funcionalidade existente)
- **Anotações:** área privada de anotações do aluno (tipo `AnotacaoAluno[]`)

### 2. Componente de Recados

Criar `components/RecadosAluno.tsx`:

```tsx
interface RecadosAlunoProps {
  recados: Recado[];
  onMarcarLido: (id: string) => void;
}

const RecadosAluno: React.FC<RecadosAlunoProps> = ({ recados, onMarcarLido }) => {
  const naoLidos = recados.filter(r => !r.lido);
  const lidos = recados.filter(r => r.lido);

  return (
    <div className="space-y-3">
      {naoLidos.length === 0 && lidos.length === 0 && (
        <p className="text-center text-pg-text-muted py-12 text-sm">
          Nenhum recado por enquanto.
        </p>
      )}
      
      {/* Recados fixados */}
      {recados.filter(r => r.fixado).map(recado => (
        <RecadoCard key={recado.id} recado={recado} onMarcarLido={onMarcarLido} destaque />
      ))}

      {/* Não lidos */}
      {naoLidos.filter(r => !r.fixado).map(recado => (
        <RecadoCard key={recado.id} recado={recado} onMarcarLido={onMarcarLido} />
      ))}

      {/* Lidos */}
      {lidos.filter(r => !r.fixado).length > 0 && (
        <details className="mt-4">
          <summary className="text-pg-text-muted text-xs uppercase tracking-wider cursor-pointer mb-2">
            Recados anteriores ({lidos.filter(r => !r.fixado).length})
          </summary>
          {lidos.filter(r => !r.fixado).map(recado => (
            <RecadoCard key={recado.id} recado={recado} onMarcarLido={onMarcarLido} />
          ))}
        </details>
      )}
    </div>
  );
};
```

### 3. Área de anotações pessoais

Criar uma área simples de notas dentro da aba "Anotações":

```tsx
// Estado local (Firestore para persistência)
const [anotacaoAtual, setAnotacaoAtual] = useState('');
const [salvando, setSalvando] = useState(false);

<div className="space-y-3">
  <p className="text-pg-text-muted text-xs">
    Suas anotações são privadas — só você pode ver.
  </p>
  <textarea
    value={anotacaoAtual}
    onChange={e => setAnotacaoAtual(e.target.value)}
    placeholder="Escreva aqui: metas, observações do treino, como você está se sentindo..."
    className="w-full h-36 rounded-pg-card bg-pg-surface-dark border border-white/10 
               text-white text-sm p-3 resize-none focus:outline-none focus:border-pg-cobalt/50 
               placeholder:text-pg-text-muted"
    maxLength={500}
  />
  <div className="flex justify-between items-center">
    <span className="text-pg-text-muted text-xs">{anotacaoAtual.length}/500</span>
    <button
      onClick={salvarAnotacao}
      disabled={salvando || !anotacaoAtual.trim()}
      className="px-5 py-2 rounded-pg-pill bg-pg-cobalt text-midnight text-sm font-bold disabled:opacity-40"
    >
      {salvando ? 'Salvando...' : 'Salvar anotação'}
    </button>
  </div>
</div>
```

---

REGRAS:
- Manter o chat existente (SupportChat) funcionando.
- Para PERSONAL/CHEFE/ADMIN, manter o layout de mensagens atual.
- As anotações são salvas no Firestore sob `users/{userId}/anotacoes`.
```

---

## PROMPT 09 — Mural da Turma / Comunidade

```
Contexto: App PersonalGroup Experience.
Arquivo a criar: `views/Comunidade.tsx`.
Arquivos a editar: `App.tsx` (adicionar rota `/comunidade`), `components/Navigation.tsx` (opcional).
Arquivos de referência: `types.ts` (PostMural, ComentarioPost adicionados no Prompt 01).

TAREFA: Criar a view de Mural da Turma — espaço de convívio digital entre
alunos, personais e academia. Sem algoritmos ocultos, conteúdo cronológico.

---

### 1. Registrar a rota em App.tsx

Adicionar a importação lazy e a rota (sem remover nenhuma rota existente):

```tsx
// No bloco de lazy imports:
const Comunidade = lazy(() => import('./views/Comunidade'));

// No bloco de <Routes>:
<Route path="/comunidade" element={<Comunidade />} />
```

### 2. Estrutura da view Comunidade.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import type { PostMural } from '../types';

// A view recebe `user` como prop (padrão do app)
const Comunidade: React.FC<{ user: User; isDarkMode: boolean }> = ({ user, isDarkMode }) => {
  const [posts, setPosts] = useState<PostMural[]>([]);   // carregar do Firestore
  const [novoPost, setNovoPost] = useState('');
  const [enviando, setEnviando] = useState(false);

  return (
    <div className="pg-screen px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-black text-white">Mural da turma</h1>
        <p className="text-pg-text-muted text-sm">
          Compartilhe, comemore e interaja com a galera da PersonalGroup.
        </p>
      </div>

      {/* Campo de novo post */}
      <div className="rounded-pg-card bg-pg-surface-dark border border-white/5 p-3 mb-4">
        <textarea
          value={novoPost}
          onChange={e => setNovoPost(e.target.value)}
          placeholder="Compartilhe algo com a turma..."
          className="w-full h-20 bg-transparent text-white text-sm resize-none 
                     focus:outline-none placeholder:text-pg-text-muted"
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
          <span className="text-pg-text-muted text-xs">{novoPost.length}/280</span>
          <button
            onClick={publicarPost}
            disabled={enviando || !novoPost.trim()}
            className="px-5 py-2 rounded-pg-pill bg-pg-cobalt text-midnight text-sm font-bold disabled:opacity-40"
          >
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      {/* Lista de posts */}
      <div className="space-y-3 pb-24">
        {posts.length === 0 && (
          <p className="text-center text-pg-text-muted py-12 text-sm">
            Seja o primeiro a compartilhar algo com a turma!
          </p>
        )}
        {posts.map(post => (
          <CartaoPost key={post.id} post={post} usuarioAtual={user} />
        ))}
      </div>
    </div>
  );
};
```

### 3. Componente CartaoPost

Criar inline no mesmo arquivo:

```tsx
const CartaoPost: React.FC<{ post: PostMural; usuarioAtual: User }> = ({ post, usuarioAtual }) => {
  const jaCurtiu = post.curtidas.includes(usuarioAtual.id);

  return (
    <div className="rounded-pg-card bg-pg-surface-dark border border-white/5 p-4">
      {/* Autor */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-pg-cobalt/20 flex items-center justify-center text-pg-cobalt font-bold text-sm">
          {post.autorNome.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{post.autorNome}</p>
          <p className="text-pg-text-muted text-xs">
            {formatarDataRelativa(post.criadoEm)}
          </p>
        </div>
        {post.tipo === 'AVISO_ACADEMIA' && (
          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-pg-cobalt/20 text-pg-cobalt font-medium">
            Aviso
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <p className="text-white text-sm leading-relaxed mb-3">{post.conteudo}</p>

      {/* Ações */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
        <button
          className={`flex items-center gap-1.5 text-sm ${jaCurtiu ? 'text-pg-cobalt' : 'text-pg-text-muted'}`}
        >
          <Heart className={`w-4 h-4 ${jaCurtiu ? 'fill-pg-cobalt' : ''}`} />
          {post.curtidas.length > 0 && <span>{post.curtidas.length}</span>}
        </button>
        <button className="flex items-center gap-1.5 text-pg-text-muted text-sm">
          <MessageCircle className="w-4 h-4" />
          {post.comentarios.length > 0 && <span>{post.comentarios.length}</span>}
        </button>
      </div>
    </div>
  );
};
```

### 4. Acessar pelo navigation (opcional)

Em `components/Navigation.tsx`, substituir a rota `/student-hub` por `/comunidade`
na aba "Meu Espaço" OU adicionar entrada no StudentHub que leva ao mural.
(Decidir com base no que o StudentHub já oferece — não duplicar.)

---

REGRAS:
- Conteúdo sempre cronológico (mais recente primeiro) — sem algoritmo de relevância.
- ADMIN e CHEFE podem marcar posts como invisíveis (`visivel: false`) e fixá-los.
- ALUNO pode postar, curtir e comentar. Não pode excluir posts de outros.
- Integrar com Firestore: coleção `mural`, documentos indexados por `criadoEm` desc.
```

---

## PROMPT 10 — Gamificação Brasileira (Profile + Ranking)

```
Contexto: App PersonalGroup Experience.
Arquivos a editar: `views/Profile.tsx`, `views/Ranking.tsx`.
Arquivos de referência: `types.ts` (Progresso, Conquista, CategoriaAluno adicionados no Prompt 01).

TAREFA: Implementar o sistema de categorias e conquistas de forma encorajadora,
voltado para adultos e idosos. Sem punição por ausência. Sem comparação forçada.

---

### 1. Princípios da gamificação PersonalGroup

Incorporar no código os seguintes princípios:
- **Somente comparação consigo mesmo** — progresso pessoal, nunca exposição pública forçada.
- **Reconhecimento por consistência**, não por performance ou velocidade.
- **Conquistas são comemoradas**, nunca tiradas.
- **Ausências não reduzem pontos** — apenas pausam a sequência de dias seguidos.
- **Categorias** evoluem com tempo e constância, não com corridas.

### 2. Cartão de categoria em Profile.tsx

Localizar a seção de perfil e adicionar (se não existir) o cartão de categoria:

```tsx
const descricaoCategoria: Record<CategoriaAluno, string> = {
  INICIANTE:  'Você está dando os primeiros passos. Cada treino conta!',
  DEDICADO:   'Você já tem uma rotina sólida. Continue assim!',
  CONSTANTE:  'Sua constância é inspiradora. Você é um exemplo.',
  DESTAQUE:   'Você faz parte do seleto grupo de alunos mais frequentes.',
  REFERENCIA: 'Você é referência na PersonalGroup. A academia tem orgulho de você.',
};

const corCategoria: Record<CategoriaAluno, string> = {
  INICIANTE:  '#6B7280',
  DEDICADO:   '#3363a2',
  CONSTANTE:  '#00b6fd',
  DESTAQUE:   '#10B981',
  REFERENCIA: '#F59E0B',
};

// Renderizar:
{user.progresso && (
  <div
    className="rounded-pg-premium p-4 mb-4 border"
    style={{ borderColor: corCategoria[user.progresso.categoria] + '40' }}
  >
    <div className="flex items-center justify-between mb-2">
      <span
        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{
          backgroundColor: corCategoria[user.progresso.categoria] + '20',
          color: corCategoria[user.progresso.categoria],
        }}
      >
        {user.progresso.categoria.charAt(0) + user.progresso.categoria.slice(1).toLowerCase()}
      </span>
      <span className="text-pg-text-muted text-xs">
        {user.progresso.treinosTotais} treinos no total
      </span>
    </div>
    <p className="text-pg-text-muted text-sm">
      {descricaoCategoria[user.progresso.categoria]}
    </p>
  </div>
)}
```

### 3. Seção de conquistas

Adicionar após o cartão de categoria:

```tsx
{conquistasDoAluno.length > 0 && (
  <div className="mb-4">
    <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">
      Conquistas desbloqueadas
    </h3>
    <div className="grid grid-cols-3 gap-3">
      {conquistasDoAluno.map(conquista => (
        <div
          key={conquista.id}
          className="flex flex-col items-center gap-1 p-3 rounded-pg-card bg-pg-surface-dark border border-white/5 text-center"
        >
          <div className="text-2xl">{conquista.icone}</div>
          <p className="text-white text-xs font-semibold leading-tight">{conquista.titulo}</p>
          <p className="text-pg-text-muted text-[10px] leading-tight">{conquista.descricao}</p>
        </div>
      ))}
    </div>
  </div>
)}
```

### 4. Ranking.tsx — Quadro de destaque

Em `views/Ranking.tsx`, substituir qualquer linguagem competitiva agressiva por
linguagem de celebração coletiva:

```tsx
// Título da tela:
"Quadro de destaque do mês"

// Subtítulo:
"Alunos que mais treinaram em {mes}. Parabéns a todos!"

// Em vez de "1º lugar", usar:
"Mais dedicado do mês"

// Em vez de "Ranking geral":
"Turma do mês"

// Adicionar disclaimer discreto ao pé:
<p className="text-pg-text-muted text-xs text-center mt-6">
  O destaque celebra constância, não competição. Todo treino é uma vitória.
</p>
```

---

REGRAS:
- Nunca exibir comparação direta entre alunos sem consentimento.
- O quadro de destaque é opt-in: aluno pode escolher não aparecer (`perfil.apareceNoRanking: boolean`).
- Não alterar a estrutura de dados de gamificação existente — apenas complementar.
```

---

## PROMPT 11 — Personal Flex: Acompanhamento e Protocolo

```
Contexto: App PersonalGroup Experience.
Arquivos a editar: `views/Management.tsx`, `views/ProtocolEditor.tsx`, 
  `components/management/StudentDetailView.tsx`.
Arquivos de referência: `types.ts`, `services/sessionService.ts`, `services/protocolService.ts`.

TAREFA: Aprimorar o fluxo de acompanhamento do personal com visão consolidada
de alunos, acesso rápido ao protocolo e registro de observações pós-treino.

---

### 1. Observações do personal sobre o treino

Em `components/management/StudentDetailView.tsx` (ou equivalente), adicionar campo
de observação pós-treino que o personal pode preencher ao finalizar sessão:

```tsx
// Estado:
const [observacao, setObservacao] = useState('');

// Renderizar (somente para PERSONAL/CHEFE/ADMIN):
<div className="mt-4 p-3 rounded-pg-card bg-pg-surface-dark border border-white/5">
  <p className="text-pg-text-muted text-xs uppercase tracking-wider mb-2">
    Observação do treino de hoje
  </p>
  <textarea
    value={observacao}
    onChange={e => setObservacao(e.target.value)}
    placeholder="Ex: aluno relatou dor no joelho esquerdo. Adaptamos o agachamento..."
    className="w-full h-24 bg-transparent text-white text-sm resize-none 
               focus:outline-none placeholder:text-pg-text-muted"
    maxLength={400}
  />
  <button
    onClick={salvarObservacao}
    disabled={!observacao.trim()}
    className="mt-2 px-4 py-1.5 rounded-pg-pill bg-pg-cobalt/20 text-pg-cobalt 
               text-xs font-bold disabled:opacity-40"
  >
    Salvar observação
  </button>
</div>
```

### 2. Visão rápida do protocolo ativo na Management

Em `views/Management.tsx`, na listagem de alunos, adicionar sob o nome do aluno
um chip discreto com o protocolo ativo:

```tsx
{aluno.currentCycle && (
  <span className="text-pg-text-muted text-xs">
    {aluno.currentCycle.name} — sessão {aluno.currentCycle.currentSession}/{aluno.currentCycle.totalSessions}
  </span>
)}
```

### 3. Linguagem da tela de Management

Revisar textos visíveis ao personal/coordenador:
- "Students" → "Alunos"
- "Add Student" → "Cadastrar aluno"
- "Active Protocol" → "Protocolo em andamento"
- "Last Session" → "Último treino"
- "No protocol assigned" → "Sem protocolo definido"
- "View Details" → "Ver detalhes"

### 4. Atalho para iniciar sessão com aluno

Em `StudentDetailView`, garantir que o botão para iniciar sessão existe e usa texto correto:

```tsx
<button
  onClick={() => navigate(`/session/${aluno.id}`)}
  className="w-full py-3 rounded-pg-pill bg-pg-cobalt text-midnight font-bold mt-4"
>
  Iniciar treino com {aluno.nome}
</button>
```

---

REGRAS:
- Manter o fluxo `SessionRoute` existente em `App.tsx`.
- Não alterar a lógica de sincronização em tempo real (WebSocket/Firebase listeners).
- Observações são salvas em Firestore: `sessions/{sessionId}/observacoes`.
```

---

## PROMPT 12 — Perfis e Permissões (Coordenador Flex + Admin)

```
Contexto: App PersonalGroup Experience.
Arquivos a editar: `views/Management.tsx` (seção de admin), `App.tsx` (lógica de rotas protegidas).
Arquivos de referência: `types.ts` (ChefePermissions adicionado no Prompt 01), 
  `services/adminService.ts`, `firestore.rules`.

TAREFA: Implementar restrições de tela para o papel CHEFE (Coordenador Flex)
e garantir que ADMIN tem acesso irrestrito.

---

### 1. Utilitário de verificação de permissões

Criar `utils/permissoes.ts`:

```typescript
import { UserRole } from '../types';

export function podeAcessar(
  role: UserRole,
  recurso: 'financeiro' | 'editar-aluno' | 'excluir-cadastro' | 'alterar-plano' | 'gerenciar-personals' | 'relatorios' | 'moderacao-mural'
): boolean {
  if (role === UserRole.ADMIN) return true; // ADMIN sempre pode tudo

  const permissoesCHEFE: Record<string, boolean> = {
    'financeiro':           true,   // somente leitura
    'editar-aluno':         false,  // não pode
    'excluir-cadastro':     false,  // não pode
    'alterar-plano':        false,  // não pode (direcionar para ADMIN)
    'gerenciar-personals':  true,   // pode
    'relatorios':           true,   // pode
    'moderacao-mural':      true,   // pode
  };

  if (role === UserRole.CHEFE) {
    return permissoesCHEFE[recurso] ?? false;
  }

  return false;
}

export function mensagemSemPermissao(recurso: string): string {
  return `Esta ação requer acesso de administrador. Solicite ao responsável pela academia.`;
}
```

### 2. Aplicar restrições na Management.tsx

Localizar ações sensíveis e envolver com verificação:

```tsx
import { podeAcessar, mensagemSemPermissao } from '../utils/permissoes';

// Exemplo — botão de editar cadastro:
<button
  onClick={() => {
    if (!podeAcessar(user.role, 'editar-aluno')) {
      alert(mensagemSemPermissao('editar-aluno'));
      return;
    }
    navigate(`/admin/aluno/${aluno.id}/editar`);
  }}
  className={`... ${!podeAcessar(user.role, 'editar-aluno') ? 'opacity-40' : ''}`}
>
  Editar cadastro
</button>
```

### 3. Ocultar abas inacessíveis

Em vez de mostrar botões desabilitados, ocultar seções que CHEFE não acessa:

```tsx
{podeAcessar(user.role, 'alterar-plano') && (
  <SecaoAlterarPlano aluno={aluno} />
)}

{podeAcessar(user.role, 'excluir-cadastro') && (
  <BotaoExcluirCadastro alunoId={aluno.id} />
)}
```

### 4. Firestore Rules (firestore.rules)

Adicionar regra de segurança para o papel CHEFE:

```
// Em firestore.rules, adicionar dentro das regras existentes:
// Coordenadores Flex (CHEFE) não podem deletar usuários nem alterar planos
match /users/{userId} {
  allow delete: if request.auth.token.role == 'ADMIN';
  allow update: if request.auth.token.role == 'ADMIN'
                || (request.auth.token.role == 'CHEFE' 
                    && !request.resource.data.diff(resource.data).affectedKeys()
                       .hasAny(['plan', 'role']));
}
```

---

REGRAS:
- PERSONAL não tem acesso a nenhuma função administrativa (já tratado no App.tsx).
- Nunca remover verificações de autenticação existentes.
- Testar com um usuário CHEFE: garantir que os botões restritos estão ocultos ou desabilitados.
```

---

## PROMPT 13 — Importação de Alunos (Admin)

```
Contexto: App PersonalGroup Experience.
Arquivo a criar: `views/ImportacaoAlunos.tsx`.
Arquivos a editar: `App.tsx` (adicionar rota `/admin/importar`), `services/adminService.ts`.
Arquivos de referência: `types.ts` (ImportacaoAluno, LogImportacao adicionados no Prompt 01).

TAREFA: Criar tela de importação de alunos via CSV/XLSX proveniente do
software atual da academia. Acesso restrito a ADMIN.

---

### 1. Rota protegida em App.tsx

```tsx
// Lazy import:
const ImportacaoAlunos = lazy(() => import('./views/ImportacaoAlunos'));

// Rota (somente ADMIN):
<Route
  path="/admin/importar"
  element={user?.role === UserRole.ADMIN ? <ImportacaoAlunos /> : <Navigate to="/home" />}
/>
```

### 2. Estrutura da view ImportacaoAlunos.tsx

```tsx
const ImportacaoAlunos: React.FC = () => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportacaoAluno[]>([]);
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState<LogImportacao | null>(null);

  return (
    <div className="pg-screen px-4 pt-4">
      <h1 className="text-xl font-black text-white mb-1">Importar alunos</h1>
      <p className="text-pg-text-muted text-sm mb-6">
        Importe a planilha exportada do seu software atual. 
        Os cadastros existentes serão mantidos — apenas novos alunos serão adicionados.
      </p>

      {/* Upload de arquivo */}
      <div
        className="border-2 border-dashed border-white/10 rounded-pg-premium p-8 text-center mb-4 
                   hover:border-pg-cobalt/40 transition-colors cursor-pointer"
        onClick={() => document.getElementById('input-arquivo')?.click()}
      >
        <Upload className="w-8 h-8 text-pg-text-muted mx-auto mb-2" />
        <p className="text-white text-sm font-semibold">
          {arquivo ? arquivo.name : 'Toque para selecionar o arquivo'}
        </p>
        <p className="text-pg-text-muted text-xs mt-1">CSV ou XLSX — máximo 5MB</p>
        <input
          id="input-arquivo"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={e => setArquivo(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* Mapeamento de colunas (step 2) */}
      {arquivo && !resultado && (
        <MapeamentoColunas arquivo={arquivo} onConfirmar={iniciarImportacao} />
      )}

      {/* Resultado */}
      {resultado && (
        <ResultadoImportacao log={resultado} onNova={() => { setArquivo(null); setResultado(null); }} />
      )}
    </div>
  );
};
```

### 3. Componente MapeamentoColunas

Criar inline — permite que o admin mapeie colunas da planilha para os campos do app:

```tsx
// Exibe um dropdown para cada campo obrigatório:
// "Qual coluna da planilha corresponde ao Nome Completo?"
// "Qual coluna corresponde ao Telefone?"
// "Qual coluna corresponde ao Plano?"
// etc.
```

### 4. Componente ResultadoImportacao

```tsx
const ResultadoImportacao: React.FC<{ log: LogImportacao; onNova: () => void }> = ({ log, onNova }) => (
  <div className="rounded-pg-card bg-pg-surface-dark border border-white/5 p-4">
    <div className="flex items-center gap-2 mb-3">
      <CheckCircle className="w-5 h-5 text-pg-success" />
      <p className="text-white font-bold">Importação concluída</p>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Stat label="Total na planilha" valor={log.totalLinhas} />
      <Stat label="Importados" valor={log.importadosComSucesso} cor="pg-success" />
      {log.erros.length > 0 && (
        <Stat label="Com problema" valor={log.erros.length} cor="pg-warning" />
      )}
    </div>
    {log.erros.length > 0 && (
      <details className="mt-3">
        <summary className="text-pg-warning text-xs cursor-pointer">
          Ver linhas com problema ({log.erros.length})
        </summary>
        <div className="mt-2 space-y-1">
          {log.erros.map((e, i) => (
            <p key={i} className="text-pg-text-muted text-xs">
              Linha {e.linha}: {e.motivo}
            </p>
          ))}
        </div>
      </details>
    )}
    <button onClick={onNova} className="w-full mt-4 py-2.5 rounded-pg-pill bg-pg-cobalt text-midnight font-bold text-sm">
      Nova importação
    </button>
  </div>
);
```

---

REGRAS:
- Acesso exclusivo para ADMIN — verificar role antes de renderizar.
- Nunca sobrescrever dados de alunos já cadastrados no Firebase.
- Salvar o log de cada importação em Firestore: `importacoes/{logId}`.
- Suportar CSV com delimitador `;` (padrão de planilhas brasileiras) e `,`.
```

---

## PROMPT 14 — Plano e Status de Assinatura (Profile.tsx)

```
Contexto: App PersonalGroup Experience.
Arquivo a editar: `views/Profile.tsx`.
Arquivos de referência: `types.ts` (campo `plan` no User — já existente).

TAREFA: Exibir de forma clara e humana o status do plano do aluno.
Somente leitura — nenhuma ação financeira no app.

---

### 1. Cartão "Meu plano"

Em `views/Profile.tsx`, localizar onde as informações do plano são exibidas
(ou adicionar após a seção de informações pessoais):

```tsx
{user.plan && (
  <div className="rounded-pg-premium bg-pg-surface-dark border border-white/5 p-4 mb-4">
    {/* Cabeçalho */}
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white font-bold text-sm">Meu plano</h3>
      <span
        className={`text-xs px-2 py-1 rounded-full font-semibold ${
          user.plan.status === 'ACTIVE'
            ? 'bg-pg-success/20 text-pg-success'
            : user.plan.status === 'PENDING'
            ? 'bg-pg-warning/20 text-pg-warning'
            : 'bg-red-500/20 text-red-400'
        }`}
      >
        {user.plan.status === 'ACTIVE' ? 'Em dia' : user.plan.status === 'PENDING' ? 'Pendente' : 'Vencido'}
      </span>
    </div>

    {/* Nome do plano */}
    <p className="text-xl font-black text-white mb-1">{user.plan.name}</p>
    
    {/* Vencimento */}
    <p className="text-pg-text-muted text-sm">
      {user.plan.status === 'ACTIVE'
        ? `Renovação em ${formatarData(user.plan.renewalDate)}`
        : `Venceu em ${formatarData(user.plan.renewalDate)}`}
    </p>

    {/* CTA — somente contato, sem ação financeira no app */}
    <a
      href="https://wa.me/5598XXXXXXXX?text=Olá! Gostaria de falar sobre meu plano."
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 
                 rounded-pg-pill border border-pg-cobalt/40 text-pg-cobalt text-sm font-semibold"
    >
      <MessageCircle className="w-4 h-4" />
      Falar com a recepção sobre meu plano
    </a>
  </div>
)}
```

### 2. Convite para amigos (Guest Pass)

Adicionar cartão de convite abaixo do plano:

```tsx
{user.guestPassesAvailable > 0 && (
  <div className="rounded-pg-premium bg-pg-cobalt/10 border border-pg-cobalt/20 p-4 mb-4">
    <h3 className="text-white font-bold text-sm mb-1">Convide um amigo</h3>
    <p className="text-pg-text-muted text-sm mb-3">
      Você tem {user.guestPassesAvailable} {user.guestPassesAvailable === 1 ? 'convite disponível' : 'convites disponíveis'} 
      este mês. Seu amigo poderá treinar um dia com você!
    </p>
    <button
      onClick={gerarConvite}
      className="w-full py-2.5 rounded-pg-pill bg-pg-cobalt text-midnight font-bold text-sm"
    >
      Gerar QR Code de convite
    </button>
    <p className="text-pg-text-muted text-xs mt-2 text-center">
      Necessário validação na recepção no dia da visita.
    </p>
  </div>
)}
```

---

REGRAS:
- Nenhuma ação de pagamento, cobrança ou alteração de plano pode ser feita no app.
- O link do WhatsApp deve usar o número real da academia (substituir XXXXXXXX).
- Se `user.plan` não existir, não renderizar o cartão.
- Preservar todas as outras seções de Profile.tsx existentes.
```

---

## PROMPT 15 — Tela de Boas-Vindas / Primeiro Acesso (Onboarding)

```
Contexto: App PersonalGroup Experience.
Arquivo a editar: `views/Onboarding.tsx` (ou equivalente).
Arquivos de referência: `App.tsx` (rota `/onboarding`), `types.ts`.

TAREFA: Humanizar e simplificar o fluxo de primeiro acesso para refletir
o acolhimento da PersonalGroup — academia de bairro premium, não app de academia genérica.

---

### 1. Tela de boas-vindas

Substituir textos genéricos pela voz da PersonalGroup:

```tsx
// Passo 1 — Boas-vindas:
titulo: "Bem-vindo à PersonalGroup"
subtitulo: "Sua jornada de cuidado com você mesmo começa agora. Vamos conhecer você melhor."

// Passo 2 — Objetivo:
titulo: "O que te trouxe até aqui?"
opcoes: [
  { id: 'saude', label: 'Cuidar da saúde', icone: '❤️' },
  { id: 'condicionamento', label: 'Melhorar o condicionamento', icone: '🏃' },
  { id: 'emagrecimento', label: 'Emagrecer com saúde', icone: '⚖️' },
  { id: 'reabilitacao', label: 'Reabilitação e movimento', icone: '🌿' },
  { id: 'habito', label: 'Criar um hábito saudável', icone: '🗓️' },
]

// Passo 3 — Disponibilidade:
titulo: "Quantos dias por semana você pretende treinar?"
subtitulo: "Sem pressão — qualquer frequência já faz diferença."
opcoes: ['2 dias', '3 dias', '4 ou mais dias', 'Ainda não sei']

// Passo 4 — Confirmação:
titulo: "Tudo pronto, {nome}!"
mensagem: "Seu personal já sabe que você chegou. Explore o app com calma — estamos aqui para te apoiar."
botao: "Começar"
```

### 2. Barra de progresso humanizada

Substituir "Passo X de Y" por palavras:
- Passo 1: "Boas-vindas"
- Passo 2: "Seu objetivo"
- Passo 3: "Sua rotina"
- Passo 4: "Pronto!"

### 3. Botão de pular

Garantir que existe opção de pular o onboarding para alunos que já conhecem o app:

```tsx
<button
  onClick={() => navigate('/home')}
  className="text-pg-text-muted text-xs underline mt-4"
>
  Pular por agora
</button>
```

---

REGRAS:
- Salvar as respostas do onboarding em `users/{userId}` no Firestore.
- Não repetir o onboarding se o usuário já passou por ele (`user.onboardingCompleto: boolean`).
- Manter o fluxo de navegação existente — onboarding redireciona para `/home` ao final.
```

---

## PROMPT 16 — Revisão Final e Verificação de Integridade

```
Contexto: App PersonalGroup Experience — todos os prompts anteriores já aplicados.
Arquivos a verificar: todos os arquivos editados nos Prompts 01–15.

TAREFA: Verificação final de integridade, consistência e compilação.

---

### 1. Verificação de TypeScript

```bash
npx tsc --noEmit
```

Corrigir todos os erros de tipo antes de prosseguir.

### 2. Verificação de build

```bash
npm run build
```

Garantir que o build termina sem erros. Avisos são aceitáveis, mas não erros.

### 3. Revisão de strings visíveis ao usuário

Fazer uma busca global no projeto pelas seguintes palavras e substituir onde necessário:
- "streak" → "dias seguidos"
- "check-in" → "registrar chegada" (quando visível ao usuário)
- "badge" → "conquista"
- "dashboard" → "painel" (quando visível ao usuário)
- "hub" → "espaço" (quando visível ao usuário — labels, títulos, botões)
- "score" → "pontuação" ou "desempenho"
- "push" → substituir em notificações visíveis

```bash
# Busca (executar no terminal do projeto):
grep -rn --include="*.tsx" --include="*.ts" \
  -e '"streak"' -e '"check-in"' -e '"badge"' -e '"dashboard"' \
  -e '"hub"' -e '"score"' \
  src/ views/ components/
```

Atenção: substituir APENAS em strings visíveis ao usuário (JSX, textos de interface).
NÃO substituir em: nomes de variáveis internas, keys do Firestore, tipos TypeScript,
nomes de rotas, nomes de funções.

### 4. Checklist de UX

Para cada tela principal, verificar:
- [ ] Textos de estado vazio ("Nenhum resultado", "Sem dados") estão em português e acolhedores.
- [ ] Mensagens de erro são claras e orientam o usuário.
- [ ] Botões de ação principal usam `rounded-pg-pill bg-pg-cobalt`.
- [ ] Cards usam `rounded-pg-premium` ou `rounded-pg-card`.
- [ ] Padding-bottom suficiente para não esconder conteúdo atrás da nav (usar `pb-safe` ou `pb-24`).
- [ ] Dark mode e light mode funcionam sem texto ilegível.

### 5. Verificação de rotas

Em `App.tsx`, confirmar que todas as novas rotas adicionadas nos prompts anteriores estão presentes:
- `/comunidade` (Prompt 09)
- `/admin/importar` (Prompt 13)

Confirmar que as rotas existentes não foram removidas ou renomeadas.

### 6. Teste em dispositivo móvel (ou DevTools mobile)

Abrir o app em modo mobile (320px–430px de largura) e verificar:
- Nav inferior não sobrepõe conteúdo.
- Formulários com textarea são utilizáveis com teclado virtual.
- Imagens não transbordam o container.
- Botões têm altura mínima de 44px (acessibilidade por toque).

---

RESULTADO ESPERADO:
App compilando sem erros, com toda a linguagem voltada para o usuário revisada
para português brasileiro humano e acolhedor, e todas as novas funcionalidades
integradas ao fluxo existente sem quebrar o que já funcionava.
```

---

## PROMPT 17 — Redesign Completo da Experiência de Treino (PRIORIDADE ALTA)

> **Referência visual:** abrir `treino-redesign-prototype.html` no navegador antes de iniciar.
> Este prompt redesenha a experiência mais usada do app — o coração do produto.

```
Contexto: App PersonalGroup Experience — React + TypeScript + Vite + Tailwind CSS.
Arquivos principais a redesenhar:
  - views/ActiveSession.tsx          (sessão de treino ativa)
  - components/home/StudentHome.tsx  (tela de seleção de treino)
  - services/sessionService.ts       (lógica de sessão)
  - types.ts                         (adicionar campos de IA)

Protótipo de referência: treino-redesign-prototype.html (abrir para ver o design alvo)

PROBLEMA ATUAL (identificado nas capturas de tela):
- Fundo branco estático sem hierarquia visual
- Lista de exercícios sem distinção de estado (feito/pendente)
- "Média: 0kg" exibido sem contexto
- Escala de esforço com emojis desconectados do design
- Sem sugestão de carga baseada em histórico
- Sem indicador de progresso da sessão
- Sem dicas de execução
- Feedback pós-treino inexistente

═══════════════════════════════════════════════════════
PARTE 1 — TELA DE SELEÇÃO DE TREINO (StudentHome / Home)
═══════════════════════════════════════════════════════

Em components/home/StudentHome.tsx, substituir a listagem "1A, 2A, 3A" em texto plano
por cards ricos com as seguintes informações:

### Componente WorkoutCard

```tsx
interface WorkoutCardProps {
  letra: string;           // "1A", "2A", "3A"
  nome: string;            // "Costas e Bíceps"
  exercicios: number;      // quantidade
  duracaoMin: number;      // estimativa em minutos
  grupos: string[];        // músculos trabalhados
  ultimaVez?: Date;        // data da última execução
  progresso: number;       // 0–100 (% do ciclo concluída)
  cor: string;             // cor hex para o ícone de letra
  onIniciar: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = (props) => {
  const diasAtras = props.ultimaVez
    ? Math.floor((Date.now() - props.ultimaVez.getTime()) / 86400000)
    : null;

  return (
    <div
      onClick={props.onIniciar}
      className="mx-4 mb-3 p-4 bg-white/5 border border-white/8 rounded-2xl
                 cursor-pointer transition-all hover:bg-white/9 hover:border-cobalt/20
                 active:scale-95"
    >
      <div className="flex items-center gap-3.5">
        {/* Letra com cor */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center
                     text-lg font-black text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${props.cor}, ${props.cor}88)` }}
        >
          {props.letra}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-white truncate">{props.nome}</div>
          <div className="text-xs text-pg-text-muted mt-0.5">
            {diasAtras !== null ? `Último: há ${diasAtras} dias` : 'Ainda não realizado'} ·{' '}
            {props.exercicios} exercícios · ~{props.duracaoMin} min
          </div>
          {/* Músculos */}
          <div className="flex gap-1.5 flex-wrap mt-2">
            {props.grupos.map(g => (
              <span key={g} className="px-2 py-0.5 rounded-full bg-sky/25 border border-sky/35
                                        text-[10px] font-bold text-blue-300">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Anel de progresso do ciclo */}
        <div className="relative w-11 h-11 flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke="#00b6fd" strokeWidth="3.5"
              strokeDasharray="113"
              strokeDashoffset={113 - (113 * props.progresso / 100)}
              strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center
                          text-[10px] font-black text-cobalt">
            {props.progresso}%
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Card de destaque "Treino de hoje" (acima dos cards)

Se houver um treino recomendado para hoje (baseado em sequência de dias ou protocolo),
exibir um card destacado com fundo gradient antes da lista:

```tsx
<div className="mx-4 mb-5 p-4 rounded-2xl border border-cobalt/20 relative overflow-hidden"
     style={{ background: 'linear-gradient(135deg, #0c2a70, #051c55)' }}>
  {/* Bola decorativa */}
  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cobalt/6 pointer-events-none"/>

  <div className="flex items-center gap-2 mb-2.5">
    <span className="px-2.5 py-1 rounded-full bg-cobalt/15 border border-cobalt/28
                     text-[10px] font-black text-cobalt uppercase tracking-wider">
      ⚡ Treino de hoje
    </span>
  </div>

  <div className="text-xl font-black text-white mb-1">{treinoHoje.nome}</div>
  <div className="text-xs text-pg-text-muted mb-3">
    Ciclo {cicloAtual} de {cicloTotal} · {treinoHoje.exercicios} exercícios
  </div>

  {/* Chip de IA — exibir somente se houver histórico */}
  {sugestaoIA && (
    <div className="flex gap-2.5 p-3 rounded-xl bg-amber-500/7 border border-amber-500/18 mb-3">
      <span className="text-lg flex-shrink-0">🤖</span>
      <p className="text-[12px] text-amber-300/90 leading-relaxed font-medium">
        <strong className="font-black block mb-0.5">Sugestão da IA</strong>
        {sugestaoIA}
      </p>
    </div>
  )}

  <button
    onClick={() => navigate(`/session/${treinoHoje.id}`)}
    className="w-full py-3.5 rounded-full bg-cobalt text-midnight font-black text-sm
               transition-all hover:scale-[1.02] hover:shadow-cobalt active:scale-[0.97]"
  >
    ▶ Iniciar treino agora
  </button>
</div>
```

═══════════════════════════════════════════════════════
PARTE 2 — SESSÃO ATIVA (ActiveSession.tsx)
═══════════════════════════════════════════════════════

### 2.1 Barra de progresso no topo

Logo abaixo do header de cada exercício, adicionar:

```tsx
{/* Progresso da sessão */}
<div className="px-5 pb-3 flex-shrink-0">
  <div className="flex justify-between items-center text-xs text-pg-text-muted font-semibold mb-1.5">
    <span>Exercício {indexAtual + 1} de {totalExercicios}</span>
    <span className="text-cobalt font-bold">
      {Math.round(((indexAtual) / totalExercicios) * 100)}% concluído
    </span>
  </div>
  <div className="h-1 bg-white/7 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-sky to-cobalt rounded-full transition-all duration-500"
      style={{ width: `${(indexAtual / totalExercicios) * 100}%` }}
    />
  </div>
</div>
```

### 2.2 Área do exercício com badge de categoria e série

```tsx
{/* Imagem do exercício */}
<div className="mx-5 mb-3.5 relative rounded-2xl overflow-hidden border border-cobalt/10"
     style={{ aspectRatio: '16/9' }}>
  {exercise.imageUrl ? (
    <img src={exercise.imageUrl} alt={exercise.name}
         className="w-full h-full object-cover"/>
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-[#0b246e] to-[#0d3082]
                    flex items-center justify-center">
      <span className="text-6xl opacity-20">🏋️</span>
    </div>
  )}

  {/* Badge de série (canto superior direito) */}
  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full
                  bg-black/55 backdrop-blur-sm text-xs font-black text-white">
    Série {serieAtual} de {seriesTotais}
  </div>

  {/* Badge de grupo muscular (canto inferior esquerdo) */}
  {exercise.muscleGroup && (
    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1
                    rounded-full bg-sky/50 backdrop-blur-sm border border-sky/50
                    text-[11px] font-bold text-blue-200">
      💪 {exercise.muscleGroup}
    </div>
  )}
</div>
```

### 2.3 Seletor de carga com sugestão de IA

```tsx
{/* Chip de sugestão de IA — exibir somente se houver histórico */}
{sugestaoIA && (
  <div className="mx-5 mb-3 flex gap-2.5 p-3 rounded-2xl
                  bg-amber-500/7 border border-amber-500/2">
    <span className="text-lg flex-shrink-0 mt-0.5">🤖</span>
    <div className="text-[12px] text-amber-300/90 leading-relaxed">
      <strong className="font-black block mb-0.5 text-[12.5px]">Sugestão de carga</strong>
      {sugestaoIA}   {/* Ex: "Na última sessão você usou 10kg com esforço leve. Que tal 12kg hoje?" */}
    </div>
  </div>
)}

{/* Seletor de carga */}
<div className="mx-5 mb-3 flex items-center gap-3.5 p-4 rounded-2xl
                bg-white/5 border border-white/8">
  <button
    onClick={() => ajustarCarga(-pesoIncremento)}
    className="w-11 h-11 rounded-xl bg-cobalt/10 border border-cobalt/2 text-cobalt
               text-2xl font-bold flex items-center justify-center
               transition-all hover:bg-cobalt/20 active:scale-90"
  >−</button>

  <div className="flex-1">
    <div className="text-[10px] font-bold text-pg-text-muted uppercase tracking-wider mb-0.5">
      Carga selecionada
    </div>
    <div className="text-3xl font-black text-white leading-none">
      {cargaAtual} <span className="text-sm text-pg-text-muted font-semibold">kg</span>
    </div>
    {ultimaCarga > 0 && (
      <div className="text-[11px] text-pg-text-muted mt-1">
        Última vez: {ultimaCarga}kg · {ultimasReps} reps ✓
      </div>
    )}
  </div>

  <button
    onClick={() => ajustarCarga(+pesoIncremento)}
    className="w-11 h-11 rounded-xl bg-cobalt/10 border border-cobalt/2 text-cobalt
               text-2xl font-bold flex items-center justify-center
               transition-all hover:bg-cobalt/20 active:scale-90"
  >+</button>
</div>
```

### 2.4 Tela de descanso entre séries

Ao concluir uma série (não a última do exercício), mostrar um overlay de descanso:

```tsx
{mostrandoDescanso && (
  <div className="fixed inset-0 z-modal bg-midnight flex flex-col
                  items-center justify-center p-6 gap-6 animate-aparecer">
    {/* Timer circular */}
    <div className="text-center">
      <p className="text-xl font-black text-white mb-1">⏸ Descansando</p>
      <p className="text-sm text-pg-text-muted">Respire fundo. Você está indo bem!</p>
    </div>

    <div className="relative w-52 h-52">
      <svg width="208" height="208" viewBox="0 0 208 208" className="-rotate-90"
           style={{ filter: 'drop-shadow(0 0 20px rgba(0,182,253,0.25))' }}>
        <circle cx="104" cy="104" r="92" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
        <circle cx="104" cy="104" r="92" fill="none"
          stroke="url(#dg)" strokeWidth="7"
          strokeDasharray="578"
          strokeDashoffset={578 * (1 - timerProgress)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <defs>
          <linearGradient id="dg">
            <stop offset="0%" stopColor="#3363a2"/>
            <stop offset="100%" stopColor="#00b6fd"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-black text-white">{timerRestante}</div>
        <div className="text-xs text-pg-text-muted font-semibold mt-1">segundos</div>
      </div>
    </div>

    {/* Próxima série ou exercício */}
    <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/8">
      <span className="text-[10px] font-black text-cobalt uppercase tracking-wider block mb-1">
        {isUltimaSerie ? 'Próximo exercício' : 'Próxima série'}
      </span>
      <div className="text-base font-bold text-white">
        {isUltimaSerie ? proximoExercicio?.name : `Série ${serieAtual + 1} de ${seriesTotais}`}
      </div>
      {isUltimaSerie && proximoExercicio && (
        <div className="text-xs text-pg-text-muted mt-1">
          {proximoExercicio.sets} × {proximoExercicio.reps}
        </div>
      )}
    </div>

    {/* Dica de execução */}
    {dicaExecucao && (
      <div className="w-full flex gap-2.5 p-3.5 rounded-2xl
                      bg-emerald-500/7 border border-emerald-500/15">
        <span className="text-lg flex-shrink-0">💡</span>
        <div className="text-[12px] text-emerald-300/88 leading-relaxed">
          <strong className="font-black block mb-0.5">Dica de execução</strong>
          {dicaExecucao}
        </div>
      </div>
    )}

    <button
      onClick={pularDescanso}
      className="text-pg-text-muted text-sm font-semibold underline underline-offset-2"
    >
      Pular descanso →
    </button>
  </div>
)}
```

### 2.5 Tela "Finalizar treino" redesenhada

```tsx
{finalizando && (
  <div className="fixed inset-0 z-modal bg-midnight overflow-y-auto">
    <div className="px-5 pt-5 pb-8">
      {/* Header */}
      <button onClick={() => setFinalizando(false)} className="text-pg-text-muted text-lg mb-3">←</button>
      <h2 className="text-2xl font-black text-white">Como foi o treino?</h2>
      <p className="text-sm text-pg-text-muted mt-1 mb-5">
        {nomeProtocolo} · {totalExercicios} de {totalExercicios} exercícios ✓
      </p>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { v: formatarDuracao(duracao), u: 'duração' },
          { v: totalSeries, u: 'séries' },
          { v: formatarVolume(volumeTotal), u: 'volume' },
        ].map(s => (
          <div key={s.u} className="p-3 rounded-2xl bg-white/5 border border-white/8 text-center">
            <div className="text-xl font-black text-white">{s.v}</div>
            <div className="text-[10px] text-pg-text-muted font-semibold mt-1">{s.u}</div>
          </div>
        ))}
      </div>

      {/* Escala de esforço */}
      <p className="text-sm font-bold text-white mb-1.5">Qual foi o esforço?</p>
      <p className="text-xs text-pg-text-muted mb-4 leading-relaxed">
        Sua avaliação ajuda a IA a calibrar cargas e descanso nas próximas sessões.
      </p>
      <div className="flex gap-2 justify-between mb-2">
        {ESCALA_ESFORCO.map(e => (
          <button
            key={e.id}
            onClick={() => setEsforco(e.id)}
            className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5
                        border-2 transition-all ${
                          esforco === e.id
                            ? 'border-cobalt bg-cobalt/10 scale-105'
                            : 'border-transparent bg-white/5'
                        }`}
          >
            <span className="text-2xl leading-none">{e.emoji}</span>
            <span className={`text-[8px] font-bold text-center leading-tight ${
              esforco === e.id ? 'text-cobalt' : 'text-pg-text-muted'
            }`}>
              {e.label}
            </span>
          </button>
        ))}
      </div>
      {esforco && (
        <p className="text-center text-xs text-pg-text-muted mb-5 transition-all">
          {ESCALA_ESFORCO.find(e => e.id === esforco)?.descricao}
        </p>
      )}

      {/* Observações */}
      <p className="text-sm font-bold text-white mb-2">Observações (opcional)</p>
      <textarea
        value={observacoes}
        onChange={e => setObservacoes(e.target.value)}
        placeholder="Ex: joelho esquerdo sensível, adaptei o agachamento..."
        className="w-full h-24 rounded-2xl bg-white/5 border border-white/8 p-3.5
                   text-white text-sm resize-none outline-none placeholder:text-pg-text-muted
                   focus:border-cobalt/30 mb-5 transition-colors"
        maxLength={400}
      />

      {/* Ações */}
      <button
        onClick={registrarTreino}
        disabled={salvando}
        className="w-full py-4 rounded-full bg-cobalt text-midnight font-black text-base mb-3
                   transition-all hover:scale-[1.02] hover:shadow-cobalt
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {salvando ? 'Salvando...' : '✓ Registrar treino'}
      </button>
      <button
        onClick={() => setFinalizando(false)}
        className="w-full py-3.5 rounded-full border border-white/8 text-pg-text-muted
                   text-sm font-semibold transition-all hover:border-white/18 hover:text-white"
      >
        Voltar ao treino
      </button>
    </div>
  </div>
)}
```

### 2.6 Tela de conclusão (pós-registro)

```tsx
{treinoConcluido && (
  <div className="fixed inset-0 z-modal flex flex-col items-center justify-center
                  p-6 gap-5 animate-aparecer"
       style={{ background: 'linear-gradient(160deg, #010e35, #021141, #010922)' }}>
    <span className="text-7xl animate-bounce-once">💪</span>
    <div className="text-center">
      <h2 className="text-3xl font-black text-white mb-2">Treino concluído!</h2>
      <p className="text-sm text-pg-text-muted leading-relaxed">
        Mais um dia de cuidado com você mesmo.<br/>Isso faz toda a diferença.
      </p>
    </div>

    {/* Sequência de dias */}
    {user.progresso?.diasSeguidos > 0 && (
      <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full
                      bg-cobalt/10 border border-cobalt/2">
        <span className="text-xl">🔥</span>
        <span className="text-sm font-bold text-cobalt">
          {user.progresso.diasSeguidos} dias seguidos de treino
          {user.progresso.diasSeguidos === user.progresso.maiorSequencia ? ' — seu recorde!' : ''}
        </span>
      </div>
    )}

    {/* Stats em grid */}
    <div className="grid grid-cols-2 gap-2.5 w-full">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/8 text-center">
        <div className="text-2xl font-black text-cobalt">{formatarDuracao(duracao)}</div>
        <div className="text-xs text-pg-text-muted mt-1">Duração</div>
      </div>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/8 text-center">
        <div className="text-2xl font-black text-cobalt">{totalExercicios}</div>
        <div className="text-xs text-pg-text-muted mt-1">Exercícios</div>
      </div>
    </div>

    {/* Feedback da IA */}
    {feedbackIA && (
      <div className="w-full p-4 rounded-2xl bg-emerald-500/6 border border-emerald-500/15">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤖</span>
          <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-wider">
            Análise do seu treino
          </span>
        </div>
        <p className="text-[12.5px] text-emerald-300/72 leading-relaxed">{feedbackIA}</p>
      </div>
    )}

    {/* Conquista desbloqueada */}
    {conquistaDesbloqueada && (
      <div className="w-full flex items-center gap-3.5 p-4 rounded-2xl
                      bg-amber-500/7 border border-amber-500/2
                      animate-slideUp">
        <span className="text-4xl">{conquistaDesbloqueada.icone}</span>
        <div>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block mb-0.5">
            Nova conquista
          </span>
          <div className="text-base font-black text-white">{conquistaDesbloqueada.titulo}</div>
          <div className="text-xs text-pg-text-muted mt-0.5">{conquistaDesbloqueada.descricao}</div>
        </div>
      </div>
    )}

    {/* Ações */}
    <div className="w-full flex flex-col gap-2.5">
      <button
        onClick={() => navigate('/home')}
        className="w-full py-4 rounded-full bg-cobalt text-midnight font-black text-base
                   hover:scale-[1.02] hover:shadow-cobalt transition-all"
      >
        Voltar ao início
      </button>
      <button
        onClick={() => navigate('/evolution')}
        className="w-full py-3.5 rounded-full border border-cobalt/2 text-cobalt
                   text-sm font-semibold hover:bg-cobalt/8 transition-all"
      >
        Ver minha evolução →
      </button>
    </div>
  </div>
)}
```

═══════════════════════════════════════════════════════
PARTE 3 — LÓGICA DE IA (sessionService.ts + types.ts)
═══════════════════════════════════════════════════════

### 3.1 Adicionar em types.ts (se ainda não existirem):

```typescript
export interface SugestaoIA {
  cargaSugerida: number;         // em kg
  razao: string;                 // explicação em linguagem natural
  ultimaCarga: number;
  ultimasReps: number;
  confianca: 'ALTA' | 'MEDIA' | 'BAIXA';  // quantas sessões de histórico
}

export interface DicaExecucao {
  exercicioId: string;
  texto: string;                 // dica em português
  fonte: 'IA' | 'PERSONAL' | 'SISTEMA';
}

export const ESCALA_ESFORCO = [
  { id: 1, emoji: '😄', label: 'Muito\nleve', descricao: 'Treino leve, quase sem esforço.' },
  { id: 2, emoji: '🙂', label: 'Leve', descricao: 'Tranquilo e controlado — ótimo ritmo.' },
  { id: 3, emoji: '😊', label: 'Ideal', descricao: 'Equilíbrio perfeito de esforço e controle.' },
  { id: 4, emoji: '😅', label: 'Pesado', descricao: 'Treino intenso — deu bastante trabalho!' },
  { id: 5, emoji: '🔥', label: 'Máximo', descricao: 'No limite! Amanhã vai sentir.' },
] as const;
```

### 3.2 Adicionar em sessionService.ts:

```typescript
// Gerar sugestão de carga baseada no histórico do exercício
export async function gerarSugestaoIA(
  exercicioId: string,
  userId: string
): Promise<SugestaoIA | null> {
  try {
    // Buscar as últimas 3 sessões que usaram este exercício
    const historico = await buscarHistoricoExercicio(exercicioId, userId, 3);
    if (historico.length === 0) return null;

    const ultima = historico[0];
    const penultima = historico[1];

    // Regra simples de progressão:
    // - Se esforço foi "Muito leve" (1-2): sugerir +10% de carga
    // - Se esforço foi "Ideal" (3): manter carga
    // - Se esforço foi "Pesado/Máximo" (4-5): manter ou reduzir carga
    let cargaSugerida = ultima.carga;
    let razao = '';

    if (ultima.esforco <= 2) {
      cargaSugerida = Math.ceil(ultima.carga * 1.1 / 2) * 2; // arredonda para par
      razao = `Na última sessão você usou ${ultima.carga}kg com esforço leve. Que tal tentar ${cargaSugerida}kg hoje?`;
    } else if (ultima.esforco === 3) {
      razao = `Na última sessão você usou ${ultima.carga}kg com esforço ideal — mantenha!`;
    } else {
      cargaSugerida = ultima.carga;
      razao = `Na última sessão você usou ${ultima.carga}kg no limite. Consolide antes de aumentar.`;
    }

    return {
      cargaSugerida,
      razao,
      ultimaCarga: ultima.carga,
      ultimasReps: ultima.reps,
      confianca: historico.length >= 3 ? 'ALTA' : historico.length >= 2 ? 'MEDIA' : 'BAIXA',
    };
  } catch {
    return null;
  }
}

// Gerar feedback da IA pós-treino
export function gerarFeedbackPosTreino(params: {
  volumeAtual: number;
  volumeAnterior: number;
  totalExercicios: number;
  diasSeguidos: number;
}): string {
  const diff = params.volumeAtual - params.volumeAnterior;
  const pct = params.volumeAnterior > 0
    ? Math.round((diff / params.volumeAnterior) * 100)
    : 0;

  if (pct > 0) {
    return `Você aumentou seu volume total em ${pct}% em relação à última sessão. Continue nesse ritmo e em breve você avança de nível!`;
  } else if (pct === 0) {
    return `Volume igual à última sessão — consistência é a chave! Seu personal vai adorar ver essa regularidade.`;
  } else {
    return `Treino mais leve hoje, e tudo bem! Ouvir o corpo é parte do progresso. Amanhã você retoma com ainda mais energia.`;
  }
}
```

═══════════════════════════════════════════════════════
REGRAS GERAIS DESTE PROMPT
═══════════════════════════════════════════════════════

1. Manter toda a lógica de cronômetro, séries e sincronização existente.
2. Os componentes novos são ADICIONADOS ao layout existente, não substituem.
3. O seletor de carga NÃO é obrigatório — exercícios sem carga (prancha, abdominal) não exibem.
4. Verificar TypeScript sem erros: `npx tsc --noEmit`.
5. Testar dark mode e light mode — o novo design usa classes do design system (cobalt, sky, etc.).
6. Verificar que o build funciona: `npm run build`.

RESULTADO ESPERADO:
- Tela de treino com identidade visual PG (fundo escuro, cyan, cards com profundidade)
- Sugestão de carga da IA visível e contextual
- Progresso da sessão sempre visível (barra + contagem)
- Descanso com timer animado e dica de execução
- Finalização com escala de esforço redesenhada e feedback da IA
- Tela de parabéns acolhedora com conquista desbloqueada
```

---

## Ordem de execução recomendada

| # | Prompt | Risco | Tempo estimado |
|---|--------|-------|----------------|
| 01 | Fundação de Tipos | Muito baixo | 20 min |
| 02 | Sistema de Design | Baixo | 30 min |
| 03 | Navegação | Baixo | 20 min |
| 04 | Tela Inicial do Aluno | Baixo | 40 min |
| 05 | Sessão de Treino | Médio | 45 min |
| 06 | Registrar Chegada | Baixo | 25 min |
| 07 | Agenda e Bem-Estar | Baixo | 30 min |
| 08 | Recados e Mensagens | Médio | 50 min |
| 09 | Mural da Turma | Médio | 60 min |
| 10 | Gamificação Brasileira | Baixo | 40 min |
| 11 | Personal Flex | Médio | 45 min |
| 12 | Perfis e Permissões | Alto | 60 min |
| 13 | Importação de Alunos | Alto | 90 min |
| 14 | Plano e Assinatura | Muito baixo | 20 min |
| 15 | Boas-Vindas | Baixo | 30 min |
| 16 | Revisão Final | — | 30 min |

**Total estimado:** ~9–10 horas de desenvolvimento

---

*Gerado por Antigravity Studio — 2026*  
*Stack: React 18 + TypeScript + Vite + Firebase + Tailwind CSS*
