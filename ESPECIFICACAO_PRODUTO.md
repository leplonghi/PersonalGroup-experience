# PersonalGroup Experience — Especificacao Completa do Produto

> Versao: 1.0 | Data: 2026-03-04 | Status: Proposta

---

## SUMARIO

1. [Mapa de Telas (Wireframes Conceituais)](#1-mapa-de-telas)
2. [Modelo de Banco de Dados](#2-modelo-de-banco-de-dados)
3. [Descricao dos Fluxos](#3-descricao-dos-fluxos)

---

## 1. MAPA DE TELAS

### Convencoes

```
[BTN]  = Botao de acao
[INP]  = Campo de entrada
[TAB]  = Aba de navegacao
[IMG]  = Imagem ou avatar
[CARD] = Cartao de informacao
[NOTIF]= Badge de notificacao
```

---

### 1.1 ONBOARDING / AUTENTICACAO

#### Tela 01 — Splash Screen
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         [LOGO PG]               │
│      PersonalGroup              │
│    "Sua evolucao, nossa missao" │
│                                 │
│       ████████████             │
│        [loading bar]           │
│                                 │
└─────────────────────────────────┘
```

#### Tela 02 — Boas-vindas / Selecao de Perfil
```
┌─────────────────────────────────┐
│  Bem-vindo ao PersonalGroup     │
│                                 │
│  Como voce quer entrar?         │
│                                 │
│  ┌───────────┐  ┌───────────┐  │
│  │  [icon]   │  │  [icon]   │  │
│  │  Sou      │  │  Sou      │  │
│  │  Aluno    │  │  Personal │  │
│  └───────────┘  └───────────┘  │
│                                 │
│  [BTN: Entrar com Google]       │
│  [BTN: Entrar com Apple ID]     │
│  [BTN: Usar email e senha]      │
│                                 │
│  Nao tenho cadastro? [Cadastrar]│
└─────────────────────────────────┘
```

#### Tela 03 — Login
```
┌─────────────────────────────────┐
│  ← Voltar     Entrar            │
│                                 │
│  [INP: E-mail ou CPF]           │
│  [INP: Senha] ●●●●●●●  [ver]   │
│                                 │
│  [BTN: Entrar]                  │
│                                 │
│  ─────── ou entre com ──────── │
│  [BTN Google] [BTN Apple]       │
│                                 │
│  [BTN: Entrar com biometria]    │
│  (Face ID / Touch ID)           │
│                                 │
│  Esqueci minha senha            │
│  Primeiro acesso                │
└─────────────────────────────────┘
```

#### Tela 04 — Cadastro Aluno (Passo 1/3 — Dados Pessoais)
```
┌─────────────────────────────────┐
│  ← Voltar   Cadastro  [1●○○]    │
│                                 │
│  [IMG: foto de perfil] [editar] │
│                                 │
│  [INP: Nome completo]           │
│  [INP: CPF]                     │
│  [INP: Data de nascimento]      │
│  [SEL: Sexo biologico]          │
│  [INP: Telefone / WhatsApp]     │
│  [INP: E-mail]                  │
│  [INP: Senha]                   │
│  [INP: Confirmar senha]         │
│                                 │
│  [BTN: Proximo →]               │
└─────────────────────────────────┘
```

#### Tela 05 — Cadastro Aluno (Passo 2/3 — Saude e Objetivos)
```
┌─────────────────────────────────┐
│  ← Voltar   Cadastro  [1●2●○]   │
│                                 │
│  Objetivos principais           │
│  ☐ Emagrecimento  ☐ Hipertrofia │
│  ☐ Saude          ☐ Performance │
│  ☐ Reabilitacao   ☐ Outro       │
│                                 │
│  Frequencia desejada            │
│  [SEL: 3x | 4x | 5x | 6x | 7x] │
│                                 │
│  Dores ou limitacoes atuais     │
│  [INP: textarea]                │
│                                 │
│  Historico de lesoes            │
│  [INP: textarea]                │
│                                 │
│  Preferencias de treino         │
│  ☐ Manha  ☐ Tarde  ☐ Noite      │
│                                 │
│  [BTN: Proximo →]               │
└─────────────────────────────────┘
```

#### Tela 06 — Cadastro Aluno (Passo 3/3 — Plano e Confirmacao)
```
┌─────────────────────────────────┐
│  ← Voltar   Cadastro  [●●●]     │
│                                 │
│  Seu plano                      │
│  ┌─────────────────────────┐    │
│  │  Plano Premium          │    │
│  │  Inicio: 04/03/2026     │    │
│  │  Expiracao: 04/04/2026  │    │
│  │  Personal: [nome]       │    │
│  └─────────────────────────┘    │
│                                 │
│  Atestado medico (opcional)     │
│  [BTN: Anexar PDF/foto]         │
│                                 │
│  Aceito os termos de uso  ☐     │
│  Aceito a politica de priv. ☐   │
│                                 │
│  [BTN: Concluir cadastro]       │
└─────────────────────────────────┘
```

#### Tela 07 — Cadastro Personal Trainer (Passo 1/2)
```
┌─────────────────────────────────┐
│  ← Voltar  Cad. Personal [●○]   │
│                                 │
│  [IMG: foto de perfil] [editar] │
│                                 │
│  [INP: Nome completo]           │
│  [INP: CREF / Registro]         │
│  [INP: CPF]                     │
│  [INP: Telefone]                │
│  [INP: E-mail]                  │
│  [INP: Senha]                   │
│                                 │
│  Especialidades                 │
│  ☐ Musculacao  ☐ Funcional      │
│  ☐ Emagrecimento  ☐ Idosos      │
│  ☐ Reabilitacao  ☐ Pilates      │
│                                 │
│  Mini bio (max 300 chars)       │
│  [INP: textarea]                │
│                                 │
│  [BTN: Proximo →]               │
└─────────────────────────────────┘
```

#### Tela 08 — Cadastro Personal (Passo 2/2 — Horarios e Certificados)
```
┌─────────────────────────────────┐
│  ← Voltar  Cad. Personal [●●]   │
│                                 │
│  Horarios disponiveis           │
│  Seg ☐5h30 ☐6h ☐7h ... ☐22h    │
│  Ter ☐5h30 ☐6h ☐7h ... ☐22h    │
│  Qua ☐5h30 ☐6h ☐7h ... ☐22h    │
│  Qui ☐5h30 ☐6h ☐7h ... ☐22h    │
│  Sex ☐5h30 ☐6h ☐7h ... ☐22h    │
│  Sab ☐7h ☐8h ☐9h ... ☐13h      │
│  Dom ☐8h ☐9h ☐10h ... ☐13h     │
│                                 │
│  Certificados / diplomas        │
│  [BTN: Adicionar arquivo]       │
│  [lista de arquivos anexados]   │
│                                 │
│  [BTN: Concluir cadastro]       │
└─────────────────────────────────┘
```

---

### 1.2 AREA DO ALUNO

#### Tela 09 — Home Aluno
```
┌─────────────────────────────────┐
│  [LOGO]  Boa tarde, Carlos!  🔔2│
│  ─────────────────────────────  │
│  ┌─────────────────────────┐    │
│  │ [CARD: Status do Plano] │    │
│  │ Plano Premium  ██████░  │    │
│  │ 18 dias restantes       │    │
│  │ Expira: 22/03/2026      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌──────────┐  ┌──────────┐     │
│  │ Freq.    │  │ Proximo  │     │
│  │ semanal  │  │ treino   │     │
│  │  4/5x ✓  │  │ Amanha   │     │
│  │          │  │  06:00h  │     │
│  └──────────┘  └──────────┘     │
│                                 │
│  ┌─────────────────────────┐    │
│  │ FAZER CHECK-IN AGORA    │    │
│  │     [BTN grande]        │    │
│  └─────────────────────────┘    │
│                                 │
│  Proximos eventos               │
│  • PersonalDay em 12 dias       │
│  • Reavaliacao em 30 dias       │
│  • Wellness disponivel          │
│                                 │
│  [TAB: Home|Treino|Evolucao|+]  │
└─────────────────────────────────┘
```

#### Tela 10 — Check-in Aluno
```
┌─────────────────────────────────┐
│  ← Voltar        Check-in       │
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │   [QR CODE ou animacao] │    │
│  │                         │    │
│  │   Aproxime da catraca   │    │
│  │   ou mostre ao recepc.  │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────── ou ──────────────────  │
│                                 │
│  [BTN: Check-in Manual]         │
│  (solicita confirmacao do staff)│
│                                 │
│  Ultimo check-in:               │
│  Hoje 06:02h ✓                  │
│  Ontem 07:15h ✓                 │
│                                 │
│  Frequencia este mes: 14/20     │
└─────────────────────────────────┘
```

#### Tela 11 — Meu Treino (Protocolo Atual)
```
┌─────────────────────────────────┐
│  ← Voltar    Treino de Hoje     │
│                                 │
│  Ciclo: Hipertrofia B  Sem 3/8  │
│  Protocolo: Upper Body A        │
│                                 │
│  [CARD: Exercicio 1/6]          │
│  Supino Reto com Barra          │
│  4 series × 8-10 reps           │
│  Carga sugerida: 60kg           │
│  [BTN: Iniciar Serie]           │
│                                 │
│  [CARD: Exercicio 2/6]          │
│  Remada Curvada                 │
│  4 series × 10-12 reps          │
│  [BTN: Ver detalhes]            │
│                                 │
│  [CARD: Exercicio 3/6] ...      │
│                                 │
│  [BTN: Iniciar Treino]          │
│  [BTN: Solicitar mudanca]       │
└─────────────────────────────────┘
```

#### Tela 12 — Sessao Ativa
```
┌─────────────────────────────────┐
│  ⏱ 00:42:17    Encerrar treino │
│  ─────────────────────────────  │
│  Supino Reto   (2/6)            │
│                                 │
│  Serie 2 de 4                   │
│  ┌─────────────────────────┐    │
│  │    Reps realizadas      │    │
│  │   [  -  ] [10] [  +  ] │    │
│  │    Carga (kg)           │    │
│  │   [  -  ] [62] [  +  ] │    │
│  │    RPE (1-10)           │    │
│  │   ● ● ● ● ● ● ○ ○ ○ ○  │    │
│  └─────────────────────────┘    │
│                                 │
│  [BTN: Registrar Serie]         │
│                                 │
│  Descanso: 01:30 ⏳             │
│  ████████░░░░░░░ 60s            │
│                                 │
│  Series: ✓✓○○  RPE medio: 6/10 │
└─────────────────────────────────┘
```

#### Tela 13 — Minha Evolucao
```
┌─────────────────────────────────┐
│  ← Voltar    Minha Evolucao     │
│                                 │
│  [TAB: Medidas | Fotos | Graficos]│
│                                 │
│  ── Medidas Corporais ─────────  │
│  Data: 04/03/2026 | Peso: 78kg  │
│  ┌──────────────────────────┐   │
│  │ Gordura:  18% → 15% ↓   │   │
│  │ Massa M.: 62kg → 66kg ↑  │   │
│  │ IMC:      23.1 → 22.4 ↓  │   │
│  │ VO2 Max:  38 → 42 ↑      │   │
│  └──────────────────────────┘   │
│                                 │
│  Grafico de progresso           │
│  ┌──────────────────────────┐   │
│  │  78│╲                    │   │
│  │  76│  ╲___/╲             │   │
│  │  74│       ╲___          │   │
│  │    └──────────────────── │   │
│  │    Dez Jan Fev Mar       │   │
│  └──────────────────────────┘   │
│                                 │
│  [BTN: Ver fotos comparativas]  │
│  [BTN: Exportar relatorio PDF]  │
└─────────────────────────────────┘
```

#### Tela 14 — Fotos Comparativas
```
┌─────────────────────────────────┐
│  ← Voltar   Fotos Comparativas  │
│                                 │
│  ┌──────────┐  ┌──────────┐    │
│  │          │  │          │    │
│  │  ANTES   │  │  DEPOIS  │    │
│  │ Jan 2026 │  │ Mar 2026 │    │
│  │          │  │          │    │
│  └──────────┘  └──────────┘    │
│     [frente]  [costas] [lado]  │
│                                 │
│  Timeline de fotos              │
│  Jan ── Fev ── Mar              │
│   ●       ●      ●              │
│                                 │
│  [BTN: Adicionar nova foto]     │
│  (frente, costas, lado)         │
└─────────────────────────────────┘
```

#### Tela 15 — Wellness / Espacos de Recuperacao
```
┌─────────────────────────────────┐
│  ← Voltar         Wellness      │
│                                 │
│  Seu saldo: 2 sessoes/mes       │
│  Utilizadas: 1   Disponiveis: 1 │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Massagem Relaxante     │    │
│  │  Duracao: 60 min        │    │
│  │  [BTN: Agendar]         │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Fisioterapia           │    │
│  │  Duracao: 45 min        │    │
│  │  [BTN: Agendar]         │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Consultoria Nutricional│    │
│  │  Duracao: 50 min        │    │
│  │  [BTN: Agendar]         │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Recuperacao Muscular   │    │
│  │  (Crioterapia/Compressao│    │
│  │  [BTN: Agendar]         │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### Tela 16 — Agendamento Wellness
```
┌─────────────────────────────────┐
│  ← Voltar   Agendar Sessao      │
│                                 │
│  Servico: Massagem Relaxante    │
│  Duracao: 60 minutos            │
│                                 │
│  Selecione a data               │
│  ┌────────────────────────┐     │
│  │  < Março 2026         >│     │
│  │  D  S  T  Q  Q  S  S  │     │
│  │  1  2  3  [4] 5  6  7  │     │
│  │  8  9  10 11 12 13 14  │     │
│  └────────────────────────┘     │
│                                 │
│  Horarios disponiveis           │
│  [08:00] [09:00] [10:00]        │
│  [14:00] ■OCUPADO■ [16:00]      │
│                                 │
│  [BTN: Confirmar agendamento]   │
└─────────────────────────────────┘
```

#### Tela 17 — Mensagens e Notificacoes
```
┌─────────────────────────────────┐
│  ← Voltar        Mensagens      │
│                                 │
│  [TAB: Todas | Pessoais | Avisos]│
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🎂 Feliz Aniversario!  │    │
│  │ PersonalGroup           │    │
│  │ Hoje • nao lida         │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 💪 Voce atingiu 20 dias │    │
│  │ consecutivos de treino! │    │
│  │ Ontem • lida            │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 📋 Seu plano expira em  │    │
│  │ 7 dias. Renove ja!      │    │
│  │ 02/03 • lida            │    │
│  └─────────────────────────┘    │
│                                 │
│  [BTN: Tira-duvidas com IA]     │
└─────────────────────────────────┘
```

#### Tela 18 — Tira-Duvidas (Chat Assistente)
```
┌─────────────────────────────────┐
│  ← Voltar    Tira-Duvidas PG   │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Ola! Sou o assistente   │    │
│  │ PersonalGroup. Como     │    │
│  │ posso ajudar?           │    │
│  └─────────────────────────┘    │
│                                 │
│        ┌────────────────────┐   │
│        │ Qual o horario de  │   │
│        │ funcionamento?     │   │
│        └────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐    │
│  │ De seg a sex: 5h30-22h  │    │
│  │ Sabado: 7h-13h          │    │
│  │ Domingo/feriado: 8h-13h │    │
│  └─────────────────────────┘    │
│                                 │
│  Sugestoes rapidas:             │
│  [Como trancar plano?]          │
│  [Quando e minha avaliacao?]    │
│                                 │
│  [INP: Digite sua duvida...] 📤 │
└─────────────────────────────────┘
```

#### Tela 19 — Ranking e Gamificacao
```
┌─────────────────────────────────┐
│  ← Voltar     Ranking PG        │
│                                 │
│  Seu nivel: Prata  ⭐⭐⭐        │
│  Pontos: 1.240 / 1.500 p/ Ouro  │
│  ██████████████░░░░░             │
│                                 │
│  [TAB: Geral | Amigos | Mensal] │
│                                 │
│  🥇  Ana Costa          1.890pts│
│  🥈  Pedro Lima         1.670pts│
│  🥉  Mariana S.         1.450pts│
│  4.  Carlos (voce) ►   1.240pts│
│  5.  Julia M.           1.100pts│
│                                 │
│  Suas conquistas                │
│  🏅 30 dias seguidos            │
│  🏅 10 avaliacoes positivas     │
│  🔒 Frequencia Perfeita (50x)   │
│                                 │
│  Como ganhar pontos?            │
│  +10 Check-in diario            │
│  +50 Avaliacao fisica           │
│  +5  Sessao wellness            │
└─────────────────────────────────┘
```

#### Tela 20 — Perfil do Aluno
```
┌─────────────────────────────────┐
│  ← Voltar        Meu Perfil     │
│                                 │
│  [IMG: avatar 80px]             │
│  Carlos Mendonca                │
│  Aluno desde Jan 2025           │
│  Personal: Dr. Rafael S.        │
│                                 │
│  [TAB: Dados | Plano | Config]  │
│                                 │
│  Dados pessoais                 │
│  Nome: Carlos Mendonca [editar] │
│  Sexo: Masculino                │
│  Idade: 32 anos                 │
│  WhatsApp: (98) 99999-9999      │
│                                 │
│  Objetivos: Hipertrofia         │
│  Freq.: 5x por semana           │
│  Limitacoes: Joelho direito     │
│                                 │
│  [BTN: Solicitar trancamento]   │
│  [BTN: Enviar atestado]         │
│  [BTN: Sair da conta]           │
└─────────────────────────────────┘
```

#### Tela 21 — Solicitacao de Trancamento
```
┌─────────────────────────────────┐
│  ← Voltar   Trancar Plano       │
│                                 │
│  Motivo do trancamento          │
│  ○ Viagem                       │
│  ○ Doenca / cirurgia            │
│  ○ Gravidez                     │
│  ○ Questao financeira           │
│  ○ Outro motivo                 │
│                                 │
│  Periodo solicitado             │
│  De: [INP: data inicio]         │
│  Ate: [INP: data fim]           │
│                                 │
│  Documentacao (obrigatorio)     │
│  [BTN: Anexar PDF ou foto]      │
│  atestado_medico.pdf ✓          │
│                                 │
│  Descricao adicional            │
│  [INP: textarea]                │
│                                 │
│  [BTN: Enviar solicitacao]      │
└─────────────────────────────────┘
```

#### Tela 22 — Agenda do Aluno
```
┌─────────────────────────────────┐
│  ← Voltar          Agenda       │
│                                 │
│  Março 2026                     │
│  < ─────────────────────────── >│
│  S  T  Q  Q  S  S  D           │
│  2  3  [4] 5  6  7  8          │
│  9  10 11 12 13 14 15          │
│                                 │
│  Hoje - Quarta, 04/03           │
│  ┌─────────────────────────┐    │
│  │ 06:00 🏋️ Treino Upper A │    │
│  │ 09:00 💆 Massagem        │    │
│  └─────────────────────────┘    │
│                                 │
│  Quinta, 05/03                  │
│  ┌─────────────────────────┐    │
│  │ 06:00 🏋️ Treino Lower A │    │
│  └─────────────────────────┘    │
│                                 │
│  Proximos eventos               │
│  📅 15/03 — PersonalDay         │
│  📅 04/06 — Reavaliacao         │
└─────────────────────────────────┘
```

---

### 1.3 AREA DO PERSONAL TRAINER

#### Tela 23 — Home Personal
```
┌─────────────────────────────────┐
│  [LOGO] Ola, Rafael!        🔔3 │
│  ─────────────────────────────  │
│  ┌──────────┐  ┌──────────┐    │
│  │ Alunos   │  │ Treinos  │    │
│  │  Ativos  │  │  Hoje    │    │
│  │   24     │  │   8      │    │
│  └──────────┘  └──────────┘    │
│  ┌──────────┐  ┌──────────┐    │
│  │ Alertas  │  │ Avaliac. │    │
│  │ de Risco │  │ Pend.    │    │
│  │   2 ⚠️   │  │   3      │    │
│  └──────────┘  └──────────┘    │
│                                 │
│  Alunos em alerta               │
│  ⚠️ Maria F. — 3 faltas seg.    │
│  ⚠️ Joao P. — Plano expirando  │
│                                 │
│  Check-in pessoal               │
│  [BTN: Registrar minha entrada] │
│                                 │
│  [TAB: Home|Alunos|Protocolos|+]│
└─────────────────────────────────┘
```

#### Tela 24 — Lista de Alunos
```
┌─────────────────────────────────┐
│  ← Voltar       Meus Alunos     │
│                                 │
│  [INP: Buscar aluno...]  [🔍]   │
│  [Filtro: Todos | Ativos | Alerta]│
│                                 │
│  ┌─────────────────────────┐    │
│  │ [foto] Ana Costa        │    │
│  │ Plano: Premium | 5x/sem │    │
│  │ Freq.: ████████░░ 80%  │    │
│  │ Status: ✅ Normal       │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ [foto] Maria Figueiredo │    │
│  │ Plano: Standard | 3x/sem│    │
│  │ Freq.: ████░░░░░░ 40%  │    │
│  │ Status: ⚠️ Alerta       │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ [foto] Joao Pereira     │    │
│  │ Plano: Premium | 4x/sem │    │
│  │ Expira em 5 dias ⚠️     │    │
│  │ Status: ✅ Normal       │    │
│  └─────────────────────────┘    │
│                                 │
│  [BTN: + Novo aluno]            │
└─────────────────────────────────┘
```

#### Tela 25 — Perfil do Aluno (Visao do Personal)
```
┌─────────────────────────────────┐
│  ← Alunos    Ana Costa          │
│                                 │
│  [foto] Ana Costa   ✅ Ativo    │
│  32 anos | Objetivo: Hipertrofia│
│  Plano Premium | Expira 15/04   │
│                                 │
│  [TAB: Resumo|Treino|Evolucao|Hist]│
│                                 │
│  Frequencia este mes            │
│  ████████████████░░░░ 16/20     │
│  Seg✓ Ter✓ Qua- Qui✓ Sex✓ Sab-  │
│                                 │
│  Protocolo atual: Hipertrofia A │
│  Ciclo: Sem 6 de 8              │
│  Proxima avaliacao: 15/03       │
│                                 │
│  Ultima sessao: Ontem           │
│  RPE medio: 7.2 | 6 exercicios  │
│                                 │
│  [BTN: Editar protocolo]        │
│  [BTN: Agendar avaliacao]       │
│  [BTN: Enviar mensagem]         │
└─────────────────────────────────┘
```

#### Tela 26 — Editor de Protocolo
```
┌─────────────────────────────────┐
│  ← Voltar   Protocolo: Upper A  │
│  Versao 3.1 | Salvo 02/03/2026  │
│                                 │
│  [INP: Nome do protocolo]       │
│  [INP: Objetivo]                │
│                                 │
│  Exercicios                     │
│  ┌──────────────────────────┐   │
│  │ 1. Supino Reto Barra     │   │
│  │ Series: 4 | Reps: 8-10   │   │
│  │ Progressao: +2.5kg/sem   │   │
│  │ [editar] [remover]       │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ 2. Remada Curvada       │   │
│  │ Series: 4 | Reps: 10-12 │   │
│  │ [editar] [remover]      │   │
│  └──────────────────────────┘   │
│                                 │
│  [BTN: + Adicionar exercicio]   │
│  [BTN: Salvar protocolo]        │
│  [BTN: Atribuir a aluno]        │
└─────────────────────────────────┘
```

#### Tela 27 — Avaliacao Fisica
```
┌─────────────────────────────────┐
│  ← Voltar  Avaliacao: Ana Costa │
│  Tipo: Periodica | 04/03/2026   │
│                                 │
│  Medicoes                       │
│  [INP: Peso (kg)]  [78.5]       │
│  [INP: Altura (cm)] [165]       │
│  [INP: % Gordura]  [18.0]       │
│  [INP: Massa Magra (kg)] [calc] │
│  [INP: VO2 Max]    [42]         │
│  [INP: Pressao Art.] [120/80]   │
│                                 │
│  Circunferencias (cm)           │
│  Cintura:[70] Quadril:[96]      │
│  Braco:[32]   Coxa:[54]         │
│                                 │
│  Observacoes                    │
│  [INP: textarea]                │
│                                 │
│  Status de saude                │
│  ○ Normal  ○ Atencao  ○ Critico │
│                                 │
│  [BTN: Salvar avaliacao]        │
└─────────────────────────────────┘
```

#### Tela 28 — Relatorios do Personal
```
┌─────────────────────────────────┐
│  ← Voltar        Relatorios     │
│                                 │
│  [TAB: Frequencia | Performance │
│        Avaliacoes | Wellness]   │
│                                 │
│  Frequencia — Marco 2026        │
│  ┌────────────────────────┐     │
│  │     [grafico barras]   │     │
│  │ 100%│    ██            │     │
│  │  80%│ ██ ██ ██         │     │
│  │  60%│ ██ ██ ██ ██      │     │
│  │     └─────────────     │     │
│  │     Ana Mri Joa Car    │     │
│  └────────────────────────┘     │
│                                 │
│  Periodo: [Semana|Mes|Ano]      │
│                                 │
│  Alunos com menor frequencia    │
│  1. Maria F. — 40%  ⚠️          │
│  2. Rui S. — 50%                │
│                                 │
│  [BTN: Exportar PDF]            │
│  [BTN: Exportar Excel]          │
└─────────────────────────────────┘
```

#### Tela 29 — Agenda do Personal
```
┌─────────────────────────────────┐
│  ← Voltar     Minha Agenda      │
│                                 │
│  Hoje — Quarta 04/03/2026       │
│  [BTN: + Bloquear horario]      │
│                                 │
│  05:30 ── Ana Costa (treino)    │
│  06:00 ── Pedro Lima (treino)   │
│  06:30 ── [disponivel]          │
│  07:00 ── Maria F. (avaliacao)  │
│     ⋮                           │
│  12:00 ── [disponivel]          │
│  14:00 ── Joao P. (treino)      │
│  15:00 ── [disponivel]          │
│     ⋮                           │
│  21:30 ── Carlos M. (treino)    │
│  22:00 ── fim do expediente     │
│                                 │
│  [BTN: Gerenciar disponibilidade│
└─────────────────────────────────┘
```

---

### 1.4 AREA ADMINISTRATIVA (CHEFE / ADMIN)

#### Tela 30 — Dashboard Admin
```
┌─────────────────────────────────┐
│  [LOGO]  Painel Admin       🔔5 │
│  ─────────────────────────────  │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Alu. │ │Pess. │ │Check │    │
│  │ Ativos│ │Ativos│ │ Hoje │    │
│  │  86  │ │  12  │ │  47  │    │
│  └──────┘ └──────┘ └──────┘    │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Planos│ │Aval. │ │Alert.│    │
│  │Expir.│ │Pend. │ │ Risk │    │
│  │  8 ⚠│ │  5   │ │ 3 🔴 │    │
│  └──────┘ └──────┘ └──────┘    │
│                                 │
│  Alerta imediato                │
│  🔴 Luiz P. — status CRITICO   │
│  ⚠️  8 planos expiram em 7 dias │
│                                 │
│  [TAB: Painel|Alunos|Config|+]  │
└─────────────────────────────────┘
```

#### Tela 31 — Gestao de Comunicados
```
┌─────────────────────────────────┐
│  ← Voltar      Comunicados      │
│                                 │
│  [BTN: + Novo comunicado]       │
│                                 │
│  Enviados recentemente          │
│  ┌─────────────────────────┐    │
│  │ Manutencao equipamentos │    │
│  │ Todos os alunos         │    │
│  │ 02/03/2026  86 leituras │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Campanha de renovacao   │    │
│  │ Planos expirando        │    │
│  │ 01/03/2026  8 leituras  │    │
│  └─────────────────────────┘    │
│                                 │
│  Agendados                      │
│  📅 08/03 — Dia Mulher campaign │
│                                 │
│  [BTN: Criar mensagem segmentada│
└─────────────────────────────────┘
```

#### Tela 32 — Gestao de Planos e Solicitacoes
```
┌─────────────────────────────────┐
│  ← Voltar  Planos e Solicitacoes│
│                                 │
│  [TAB: Ativos | Expirados | Pend]│
│                                 │
│  Solicitacoes pendentes (3)     │
│  ┌─────────────────────────┐    │
│  │ Trancamento: Maria F.   │    │
│  │ Motivo: Gravidez        │    │
│  │ Periodo: 10/03 - 10/06  │    │
│  │ Doc: atestado.pdf ✓     │    │
│  │ [BTN: Aprovar] [Negar]  │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Mudanca de treino: Rui S│    │
│  │ "Dor no ombro esquerdo" │    │
│  │ [BTN: Encaminhar Pessoal│    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

---

## 2. MODELO DE BANCO DE DADOS

### Plataforma: Firebase Firestore (NoSQL)

### 2.1 Collection: `users`
```
users/{userId}
├── id: string (UID Firebase Auth)
├── name: string
├── email: string
├── phone: string (E.164: +5598999999999)
├── cpf: string (hash SHA-256)
├── role: enum [ALUNO, PERSONAL, CHEFE, ADMIN]
├── avatarUrl: string (Firebase Storage URL)
├── birthDate: Timestamp
├── gender: enum [M, F, OTHER]
├── createdAt: Timestamp
├── updatedAt: Timestamp
├── lastLogin: Timestamp
├── authProviders: string[] [email, google, apple]
├── biometricEnabled: boolean
├── notificationsEnabled: boolean
│
├── ─── (apenas ALUNO) ───
├── personalId: string (ref users/{id})
├── unitId: string (ref units/{id})
├── goals: string[] [EMAGRECIMENTO, HIPERTROFIA, SAUDE, PERFORMANCE, REABILITACAO]
├── weeklyFrequency: number (3|4|5|6|7)
├── preferredSchedule: string[] [MANHA, TARDE, NOITE]
├── limitations: string
├── injuryHistory: string
├── healthStatus: enum [NORMAL, WARNING, CRITICAL]
├── wellnessSessionsUsed: number
├── wellnessSessionsReset: Timestamp
├── rankingPoints: number
├── rankingLevel: enum [BRONZE, PRATA, OURO, PLATINA, DIAMANTE]
│
└── ─── (apenas PERSONAL) ───
    ├── specialties: string[]
    ├── miniBio: string
    ├── cref: string
    └── isActive: boolean
```

### 2.2 Collection: `plans`
```
plans/{planId}
├── id: string
├── userId: string (ref users/{id})
├── personalId: string (ref users/{id})
├── unitId: string
├── planType: enum [STANDARD, PREMIUM, VIP]
├── startDate: Timestamp
├── endDate: Timestamp
├── weeklyFrequency: number
├── status: enum [ACTIVE, EXPIRED, FROZEN, CANCELLED]
├── autoRenew: boolean
├── price: number
├── createdAt: Timestamp
│
└── freezeHistory: subcollection
    └── {freezeId}
        ├── requestedAt: Timestamp
        ├── startDate: Timestamp
        ├── endDate: Timestamp
        ├── reason: enum [VIAGEM, DOENCA, GRAVIDEZ, FINANCEIRO, OUTRO]
        ├── description: string
        ├── documentUrls: string[]
        ├── status: enum [PENDING, APPROVED, REJECTED]
        ├── approvedBy: string
        └── approvedAt: Timestamp
```

### 2.3 Collection: `schedules`
```
schedules/{scheduleId}
├── userId: string
├── type: enum [ALUNO, PERSONAL]
├── weeklySlots: map
│   ├── MON: string[] [05:30, 06:00, 06:30, ...]
│   ├── TUE: string[]
│   ├── WED: string[]
│   ├── THU: string[]
│   ├── FRI: string[]
│   ├── SAT: string[]
│   └── SUN: string[]
├── blockedDates: Timestamp[] (ferias, feriados)
└── updatedAt: Timestamp
```

### 2.4 Collection: `checkins`
```
checkins/{checkinId}
├── id: string
├── userId: string
├── unitId: string
├── checkinAt: Timestamp
├── type: enum [AUTO_QR, MANUAL, STAFF_CONFIRMED]
├── confirmedBy: string (se MANUAL)
└── metadata: map
    ├── deviceId: string
    └── ipAddress: string (anonimizado)
```

### 2.5 Collection: `training_cycles`
```
training_cycles/{cycleId}
├── id: string
├── userId: string
├── personalId: string
├── protocolId: string
├── name: string
├── goal: string
├── startDate: Timestamp
├── endDate: Timestamp (estimado)
├── totalSessions: number
├── currentSession: number
├── status: enum [ACTIVE, COMPLETED, CANCELLED]
├── executionScore: number (0-100)
├── progressionRate: number (0-100)
├── presenceRate: number (0-100)
├── suggestedLoadIncrement: number
└── createdAt: Timestamp
```

### 2.6 Collection: `session_logs`
```
session_logs/{sessionId}
├── id: string
├── userId: string
├── cycleId: string
├── protocolId: string
├── startedAt: Timestamp
├── finishedAt: Timestamp
├── durationMinutes: number
├── averageRpe: number
├── completionRate: number (% exercicios concluidos)
└── exercises: array
    └── {
        ├── exerciseId: string
        ├── exerciseName: string
        ├── setsCompleted: number
        └── sets: array
            └── {
                ├── setNumber: number
                ├── mode: enum [REPS, TIME]
                ├── value: number
                ├── weightKg: number
                └── rpe: number
            }
    }
```

### 2.7 Collection: `protocols`
```
protocols/{protocolId}
├── id: string
├── name: string
├── goal: string
├── version: string (semver: 1.0.0)
├── createdBy: string (personalId)
├── isPublic: boolean
├── createdAt: Timestamp
├── updatedAt: Timestamp
└── exercises: array
    └── {
        ├── id: string
        ├── name: string
        ├── muscleGroup: string
        ├── sets: number
        ├── reps: string (ex: "8-10")
        ├── restSeconds: number
        ├── progressionRule: string
        ├── variations: string[]
        └── notes: string
    }
```

### 2.8 Collection: `assessments`
```
assessments/{assessmentId}
├── id: string
├── studentId: string
├── personalId: string
├── date: Timestamp
├── type: enum [INICIAL, PERIODICA, EXTRAORDINARIA]
├── validated: boolean
├── validatedAt: Timestamp
│
├── biometrics: map
│   ├── weightKg: number
│   ├── heightCm: number
│   ├── fatPercentage: number
│   ├── leanMassKg: number (calculado)
│   ├── bmi: number (calculado)
│   ├── vo2Max: number
│   ├── bloodPressure: string
│   └── circumferences: map
│       ├── waistCm: number
│       ├── hipCm: number
│       ├── armCm: number
│       └── thighCm: number
│
├── healthStatus: enum [NORMAL, WARNING, CRITICAL]
├── observations: string
└── nextAssessmentDate: Timestamp (auto: +90 dias)
```

### 2.9 Collection: `events`
```
events/{eventId}
├── id: string
├── userId: string
├── type: enum [
│   PERSONAL_DAY,
│   REASSESSMENT,
│   PLAN_EXPIRY_WARNING,
│   BIRTHDAY,
│   GOAL_ACHIEVED,
│   CYCLE_COMPLETE
│ ]
├── scheduledDate: Timestamp
├── status: enum [PENDING, COMPLETED, CANCELLED]
├── notificationSent: boolean
├── satisfactionSurvey: map (para PERSONAL_DAY)
│   ├── score: number (1-10)
│   ├── feedback: string
│   └── submittedAt: Timestamp
└── metadata: map
```

### 2.10 Collection: `wellness_bookings`
```
wellness_bookings/{bookingId}
├── id: string
├── userId: string
├── serviceId: string (ref wellness_services/{id})
├── serviceName: string
├── date: Timestamp
├── time: string
├── status: enum [CONFIRMED, CANCELLED, COMPLETED, NO_SHOW]
├── createdAt: Timestamp
└── cancelledAt: Timestamp
```

### 2.11 Collection: `wellness_services`
```
wellness_services/{serviceId}
├── id: string
├── name: string
├── description: string
├── durationMinutes: number
├── maxSessionsPerMonth: number
├── isActive: boolean
└── availableSlots: map
    └── {weekday}: string[] (horarios disponiveis)
```

### 2.12 Collection: `messages`
```
messages/{messageId}
├── id: string
├── senderId: string (userId ou system)
├── type: enum [INSTITUTIONAL, MOTIVATIONAL, CRM, BIRTHDAY, PROMOTIONAL]
├── title: string
├── body: string
├── targetType: enum [ALL, ROLE, GROUP, INDIVIDUAL]
├── targetIds: string[] (userId ou role)
├── scheduledAt: Timestamp
├── sentAt: Timestamp
├── createdAt: Timestamp
└── readBy: map
    └── {userId}: Timestamp
```

### 2.13 Collection: `body_progress`
```
body_progress/{progressId}
├── id: string
├── userId: string
├── assessmentId: string (ref)
├── date: Timestamp
├── weightKg: number
├── fatPercentage: number
├── leanMassKg: number
├── waistCm: number
└── photos: map
    ├── frontUrl: string
    ├── backUrl: string
    └── sideUrl: string
```

### 2.14 Collection: `notifications`
```
notifications/{notifId}
├── id: string
├── userId: string
├── type: enum [PUSH, EMAIL, IN_APP]
├── title: string
├── body: string
├── data: map (deep link, metadata)
├── scheduledAt: Timestamp
├── sentAt: Timestamp
├── readAt: Timestamp
└── status: enum [PENDING, SENT, FAILED, READ]
```

### 2.15 Collection: `documents`
```
documents/{docId}
├── id: string
├── userId: string
├── type: enum [ATESTADO_MEDICO, CERTIFICADO_PERSONAL, FOTO_PERFIL, FOTO_PROGRESSO]
├── url: string (Firebase Storage)
├── filename: string
├── mimeType: string
├── sizeBytes: number
├── uploadedAt: Timestamp
├── validUntil: Timestamp (para atestados)
└── status: enum [PENDING_REVIEW, APPROVED, REJECTED]
```

### 2.16 Collection: `achievements`
```
achievements/{achievementId}
├── id: string
├── userId: string
├── type: enum [
│   STREAK_7, STREAK_30, STREAK_60,
│   SESSIONS_10, SESSIONS_50, SESSIONS_100,
│   ASSESSMENTS_3, WELLNESS_10,
│   PERFECT_WEEK, PERFECT_MONTH
│ ]
├── title: string
├── description: string
├── points: number
├── unlockedAt: Timestamp
└── isDisplayed: boolean
```

### 2.17 Collection: `units`
```
units/{unitId}
├── id: string
├── name: string
├── address: string
├── phone: string
├── email: string
├── hours: map
│   ├── weekday: { open: "05:30", close: "22:00" }
│   ├── saturday: { open: "07:00", close: "13:00" }
│   └── sunday: { open: "08:00", close: "13:00" }
└── isActive: boolean
```

### Diagrama de Relacionamentos
```
users ─────────┬──── plans (1:N)
               ├──── checkins (1:N)
               ├──── training_cycles (1:N) ──── session_logs (1:N)
               ├──── assessments (1:N) ──────── body_progress (1:1)
               ├──── wellness_bookings (1:N) ── wellness_services (N:1)
               ├──── messages (N:M via targetIds)
               ├──── notifications (1:N)
               ├──── documents (1:N)
               ├──── achievements (1:N)
               ├──── events (1:N)
               └──── schedules (1:1)

training_cycles ──── protocols (N:1)
```

---

## 3. DESCRICAO DOS FLUXOS

### FLUXO 1: Cadastro de Aluno

**Ator:** Novo aluno (ou recepcionista)
**Pre-condicao:** Nenhuma
**Resultado:** Conta criada, plano vinculado, avaliacao agendada

```
PASSO 1 — Escolha de acesso
  ├── Via Google/Apple ID → pre-preenche nome e email
  └── Via email/senha → preenche manualmente

PASSO 2 — Dados pessoais
  ├── Nome, CPF, data nascimento, sexo, telefone, email, senha
  └── Foto de perfil (opcional, pode adicionar depois)

PASSO 3 — Saude e objetivos
  ├── Selecao de objetivos (multiplos)
  ├── Frequencia semanal desejada
  ├── Dores/limitacoes atuais
  ├── Historico de lesoes
  └── Preferencia de horario (manha/tarde/noite)

PASSO 4 — Plano e documentos
  ├── Staff seleciona o plano contratado
  ├── Personal trainer vinculado
  ├── Atestado medico (opcional)
  └── Aceite de termos

PASSO 5 — Confirmacao automatica
  ├── Conta criada em Firebase Auth
  ├── Document criado em users/{id}
  ├── Plan criado em plans/{id} com status ACTIVE
  ├── Evento AVALIACAO_INICIAL agendado para 48h
  ├── Notificacao push: "Bem-vindo ao PersonalGroup!"
  └── Mensagem de boas-vindas criada em messages
```

---

### FLUXO 2: Cadastro de Personal Trainer

**Ator:** Administrador ou Chefe
**Pre-condicao:** Acesso admin ao sistema
**Resultado:** Personal ativo com horarios configurados

```
PASSO 1 — Dados profissionais
  ├── Nome, CPF, CREF, telefone, email, senha
  ├── Foto de perfil
  ├── Especialidades (multi-selecao)
  └── Mini-bio

PASSO 2 — Disponibilidade e certificados
  ├── Mapa semanal de horarios disponiveis
  │   (grade visual: dias x horas)
  └── Upload de certificados/diplomas

PASSO 3 — Confirmacao
  ├── Conta criada em Firebase Auth com role PERSONAL
  ├── Document criado em users/{id}
  ├── Schedule criado em schedules/{id}
  ├── Documentos salvos em documents
  └── Email de boas-vindas enviado
```

---

### FLUXO 3: Check-in do Aluno

**Ator:** Aluno
**Pre-condicao:** Plano ativo, dentro do horario de funcionamento
**Resultado:** Presenca registrada, pontos creditados

```
OPCAO A — Check-in via QR Code
  ├── Aluno abre o app > aba Check-in
  ├── QR code dinamico gerado (valido por 2 minutos)
  ├── Leitor da catraca/recepcao escaneia
  ├── Sistema valida: plano ativo? horario permitido?
  │   ├── Valido → Acesso liberado → catraca abre
  │   └── Invalido → Alerta exibido (plano expirado, fora do horario)
  └── Checkin salvo em checkins/{id}

OPCAO B — Check-in Manual
  ├── Aluno solicita no app
  ├── Recepcao confirma no painel admin
  ├── Checkin salvo com type: MANUAL + confirmedBy: staffId
  └── Notificacao confirmando ao aluno

POS CHECK-IN (automatico)
  ├── +10 pontos de ranking creditados
  ├── Streak verificado (atualiza conquistas se necessario)
  ├── Frequencia semanal atualizada
  ├── Alerta disparado se faltas excessivas (>3 consecutivas)
  └── Timeline entry criado
```

---

### FLUXO 4: Avaliacao Fisica

**Ator:** Personal Trainer (conduz) + Aluno (participa)
**Pre-condicao:** Avaliacao agendada no sistema
**Resultado:** Dados salvos, proximo ciclo de treino configurado

```
PASSO 1 — Agendamento
  ├── Personal cria avaliacao no app para o aluno
  ├── Tipo: INICIAL | PERIODICA | EXTRAORDINARIA
  ├── Notificacao push enviada ao aluno
  └── Evento criado em events com data/hora

PASSO 2 — Realizacao (tela da avaliacao)
  ├── Personal seleciona aluno
  ├── Preenche biometria:
  │   ├── Peso, altura, IMC (calculado)
  │   ├── % gordura, massa magra (calculada)
  │   ├── VO2 Max, pressao arterial
  │   └── Circunferencias (cintura, quadril, braco, coxa)
  └── Observacoes e status de saude

PASSO 3 — Finalizacao automatica
  ├── Assessment salvo em assessments/{id}
  ├── Body progress criado em body_progress/{id}
  ├── +50 pontos de ranking ao aluno
  ├── Proxima avaliacao agendada (+90 dias) em events
  ├── Evento PERSONAL_DAY agendado (+45 dias)
  └── Novo ciclo de treino sugerido ao personal

PASSO 4 — PersonalDay (45 dias apos avaliacao)
  ├── Notificacao enviada ao aluno
  ├── Questionario de satisfacao exibido no app
  ├── Respostas salvas em events/{id}.satisfactionSurvey
  └── Alerta ao personal para revisao
```

---

### FLUXO 5: Agendamento de Wellness

**Ator:** Aluno
**Pre-condicao:** Sessoes mensais disponiveis (saldo > 0)
**Resultado:** Sessao confirmada na agenda

```
PASSO 1 — Selecao de servico
  ├── Aluno acessa area Wellness
  ├── Visualiza saldo (ex: 1/2 utilizadas)
  └── Seleciona servico: Massagem | Fisio | Nutricao | Recuperacao

PASSO 2 — Selecao de data e horario
  ├── Calendario exibe apenas datas disponiveis
  ├── Grade de horarios com disponibilidade em tempo real
  │   (verde = disponivel, cinza = ocupado)
  └── Aluno seleciona slot

PASSO 3 — Confirmacao
  ├── Resumo: servico, data, horario, duracao
  └── Aluno confirma

PASSO 4 — Pos-confirmacao
  ├── Booking salvo em wellness_bookings/{id} com status CONFIRMED
  ├── wellnessSessionsUsed incrementado em users/{id}
  ├── Notificacao push: "Agendamento confirmado!"
  ├── Lembrete automatico agendado (24h antes)
  ├── +5 pontos de ranking
  └── Evento aparece na agenda do aluno

CANCELAMENTO
  ├── Aluno cancela com antecedencia minima de 4h
  ├── Status atualizado para CANCELLED
  ├── wellnessSessionsUsed decrementado (sessao devolvida)
  └── Notificacao de cancelamento enviada

RESET MENSAL (Cloud Function, dia 1 de cada mes)
  └── wellnessSessionsUsed zerado para todos os usuarios
```

---

### FLUXO 6: Controle de Plano (Avisos e Renovacao)

**Ator:** Sistema (automatico) + Aluno + Admin
**Pre-condicao:** Plano ativo com data de expiracao
**Resultado:** Aluno notificado e plano renovado ou trancado

```
ALERTAS AUTOMATICOS (Cloud Functions / Scheduled Jobs)
  ├── 30 dias antes da expiracao:
  │   └── Notificacao PUSH + mensagem in-app ao aluno
  ├── 15 dias antes:
  │   └── Notificacao PUSH + e-mail ao aluno
  ├── 7 dias antes:
  │   └── PUSH + e-mail ao aluno + alerta no dashboard admin
  └── Dia da expiracao:
      ├── Status do plano -> EXPIRED
      ├── Check-in bloqueado
      └── Notificacao urgente ao aluno e admin

FLUXO DE TRANCAMENTO (iniciado pelo aluno)
  ├── Aluno acessa Perfil > Solicitar Trancamento
  ├── Seleciona motivo e periodo
  ├── Anexa documento comprobatorio
  ├── Solicitacao enviada para admin (status: PENDING)
  ├── Admin aprova ou rejeita com justificativa
  ├── Se APROVADO:
  │   ├── Plan status -> FROZEN
  │   ├── endDate prorrogada pelo periodo de trancamento
  │   └── Notificacao ao aluno: "Trancamento aprovado"
  └── Se REJEITADO:
      └── Notificacao ao aluno com motivo da rejeicao
```

---

### FLUXO 7: Envio de Atestado Medico

**Ator:** Aluno
**Pre-condicao:** Necessidade de comprovacao medica
**Resultado:** Documento vinculado ao perfil e revisado pelo staff

```
PASSO 1 — Upload
  ├── Aluno acessa Perfil > Enviar Atestado
  ├── Seleciona arquivo (PDF, JPG, PNG - max 5MB)
  └── Informa validade do atestado

PASSO 2 — Envio e notificacao
  ├── Arquivo salvo em Firebase Storage (path: /documents/{userId}/atestados/)
  ├── Document criado em documents/{id} com status: PENDING_REVIEW
  └── Alerta criado para o admin no dashboard

PASSO 3 — Revisao pelo Staff
  ├── Admin visualiza documento
  ├── Aprova ou rejeita
  ├── Se APROVADO:
  │   ├── Status -> APPROVED
  │   ├── Data de validade registrada
  │   └── Notificacao ao aluno
  └── Se REJEITADO:
      └── Notificacao com motivo ao aluno

INTEGRACAO COM TRANCAMENTO
  └── Ao solicitar trancamento, sistema verifica se atestado
      ja foi enviado e aprovado para o mesmo periodo
```

---

### FLUXO 8: Sistema de Mensagens e Comunicacao

**Ator:** Admin/Personal (envia) + Aluno/Personal (recebe)
**Pre-condicao:** Usuarios com conta ativa
**Resultado:** Mensagem entregue e registrada

```
TIPOS DE MENSAGEM

  A) MOTIVACIONAL (automatico)
     ├── Disparado por: streak 7 dias, 30 dias, 60 dias
     ├── Disparado por: meta atingida, avaliacao positiva
     └── Template de texto personalizado com nome do aluno

  B) CRM — Aniversario
     ├── Cloud Function: todo dia verifica aniversariantes
     └── Mensagem automatica enviada na data

  C) SEGMENTADA — por grupo
     ├── Admin seleciona: todos | por personal | plano especifico
     ├── Cria titulo e corpo da mensagem
     ├── Define envio imediato ou agendado
     └── Enviado a todos os targetIds

  D) INDIVIDUAL
     ├── Personal acessa perfil do aluno
     ├── Cria mensagem personalizada
     └── Entregue apenas ao aluno em questao

  E) COMUNICADOS OFICIAIS
     ├── Manutencao, eventos, campanhas
     └── Enviado a todos com push notification

CANAL TIRA-DUVIDAS (Chat IA)
  ├── Aluno acessa chat no app
  ├── Pergunta e respondida por IA (Gemini API)
  ├── Conhecimento base: FAQs, horarios, planos, regras
  └── Perguntas nao respondidas encaminhadas para staff
```

---

### FLUXO 9: Sistema de Gamificacao (Ranking)

**Ator:** Sistema (automatico) + Aluno
**Pre-condicao:** Aluno com conta ativa
**Resultado:** Engajamento e retencao do aluno

```
CREDITO DE PONTOS (automatico por evento)
  ├── Check-in realizado:         +10 pts
  ├── Sessao de treino completa:  +20 pts
  ├── Avaliacao fisica:           +50 pts
  ├── Sessao wellness agendada:   +5 pts
  ├── 7 dias consecutivos:        +30 pts (bonus streak)
  ├── 30 dias consecutivos:       +100 pts (bonus streak)
  └── PersonalDay preenchido:     +15 pts

NIVEIS DE RANKING
  ├── BRONZE:   0 - 499 pts
  ├── PRATA:    500 - 1.499 pts
  ├── OURO:     1.500 - 3.499 pts
  ├── PLATINA:  3.500 - 6.999 pts
  └── DIAMANTE: 7.000+ pts

CONQUISTAS (badges)
  ├── Primeiro treino
  ├── 7 dias seguidos
  ├── 30 dias seguidos
  ├── 10 sessoes / 50 sessoes / 100 sessoes
  ├── 3 avaliacoes fisicas
  ├── Semana perfeita (todos os treinos previstos)
  └── Mes perfeito

RANKING
  ├── Ranking geral da academia (todos os alunos)
  ├── Ranking mensal (reseta todo mes)
  └── Ranking do personal (alunos de um mesmo personal)

PREMIO / BENEFICIO (definido pela academia)
  └── Top 3 mensal pode ganhar sessao wellness extra
      ou outro beneficio definido pelo admin
```

---

### FLUXO 10: Relatorios e Exportacao

**Ator:** Personal Trainer / Admin
**Pre-condicao:** Dados existentes no sistema
**Resultado:** Relatorio exportado (PDF ou Excel)

```
RELATORIO DE FREQUENCIA
  ├── Filtros: periodo (semana/mes/ano), aluno, personal, plano
  ├── Dados: total check-ins, % frequencia, faltas, streaks
  └── Exportacao: PDF (visual) ou Excel (dados brutos)

RELATORIO DE PERFORMANCE
  ├── Evolucao de carga por exercicio
  ├── RPE medio ao longo do tempo
  └── Comparativo entre ciclos de treino

RELATORIO DE AVALIACOES
  ├── Historico biometrico do aluno
  ├── Grafico de evolucao de peso/gordura/massa
  └── Exportavel como PDF com fotos comparativas

RELATORIO ADMINISTRATIVO (Admin only)
  ├── Total de alunos ativos/inativos por periodo
  ├── Taxa de renovacao de planos
  ├── Servicos wellness mais utilizados
  ├── NPS (baseado nas pesquisas PersonalDay)
  └── Pontuacao media de satisfacao

GERACAO (Cloud Function ou geracao client-side)
  ├── Usuario solicita relatorio com filtros
  ├── Sistema compila os dados do Firestore
  ├── PDF gerado com identidade visual PersonalGroup
  └── Download direto no app ou enviado por e-mail
```

---

## SUMARIO EXECUTIVO

### Numero de Telas: 32 telas mapeadas

| Area | Quantidade |
|------|-----------|
| Autenticacao / Onboarding | 8 |
| Area do Aluno | 14 |
| Area do Personal | 7 |
| Area Administrativa | 3 |

### Numero de Collections no Banco: 17

| Collection | Registros estimados |
|------------|-------------------|
| users | 100 - 500 |
| plans | 100 - 500 |
| checkins | 50.000+/ano |
| session_logs | 20.000+/ano |
| assessments | 400+/ano |
| messages | 1.000+/ano |
| notifications | 50.000+/ano |

### Fluxos Documentados: 10

1. Cadastro de Aluno
2. Cadastro de Personal Trainer
3. Check-in (QR e Manual)
4. Avaliacao Fisica + PersonalDay
5. Agendamento Wellness
6. Controle de Plano (avisos + trancamento)
7. Envio de Atestado
8. Sistema de Mensagens
9. Gamificacao / Ranking
10. Relatorios e Exportacao

### Tecnologias Recomendadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + TypeScript + Tailwind CSS |
| Mobile nativo | React Native (reutiliza logica) |
| Backend | Firebase (Auth + Firestore + Storage + Functions) |
| Notificacoes | Firebase Cloud Messaging (FCM) |
| Chat IA | Google Gemini API |
| Relatorios PDF | pdfmake ou jsPDF |
| Wearables | Health Connect (Android) / HealthKit (iOS) |
| Analytics | Firebase Analytics + Mixpanel |
| Monitoramento de erros | Sentry |
