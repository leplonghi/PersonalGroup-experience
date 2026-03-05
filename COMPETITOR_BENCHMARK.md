# 📊 Análise de Concorrência: Smart Fit, Bodytech & Selfit
**Data:** 24/01/2026
**Foco:** Benchmarking de funcionalidades para o PersonalGroup Experience

---

## 🏎️ Visão Geral dos Concorrentes

| Academia | Posicionamento | Foco do App |
|----------|---------------|-------------|
| **Smart Fit** | High Volume, Low Cost | Autonomia, Escala, Ocupação, Treinos Rápidos (TV/Go) |
| **Bodytech** | Premium / Wellness | Gestão de Aulas, Personalização (Smart Coach), Bem-estar |
| **Selfit** | Custo-Benefício | Agendamento, Rede Social (Timeline), Convites |
| **Personal Group** | **Boutique / Metodologia** | **Experiência Premium, Acompanhamento Próximo, Metodologia Flex** |

---

## ⚔️ Matriz de Funcionalidades (Gap Analysis)

| Funcionalidade | 🟢 Smart Fit | 🔵 Bodytech | 🟡 Selfit | 🟣 Personal Group (Atual) |
|:---|:---:|:---:|:---:|:---:|
| **Check-in Digital** | ✅ (QR/Bios) | ✅ | ✅ | ✅ (QR Code) |
| **Gráfico de Ocupação** | ✅ (Core Feature) | ❌ | ❌ | ❌ **(GAP)** |
| **Vídeos de Execução** | ✅ (Alta qualidade) | ✅ | ✅ | ❌ **(GAP CRÍTICO)** |
| **Reserva de Aulas** | ❌ (Mais treino livre) | ✅ (Forte) | ✅ | ⚠️ (Apenas Wellness) |
| **Lista de Espera** | N/A | ✅ | ✅ | ❌ **(GAP)** |
| **Gamificação/Social** | ✅ (Ranking/Grupos) | ❌ | ✅ (Feed) | ⚠️ (Timeline simples) |
| **Convite/Guest Pass** | ❌ | ✅ (30 dias) | ✅ (Amigos) | ❌ **(GAP Marketing)** |
| **Avaliação Física** | ✅ (Básica) | ✅ (Smart Coach) | ✅ | ✅ **(Forte: Flex)** |
| **Gestão Financeira** | ✅ (Renovação) | ✅ | ✅ | ❌ **(GAP)** |
| **Clube de Vantagens** | ✅ | ✅ (BT+) | ✅ | ❌ **(Oportunidade)** |
| **Conteúdo On-demand** | ✅ (Fit Go) | ✅ (BT Play) | ✅ (Weburn) | ❌ |

---

## 🚀 Oportunidades & Recomendações

Com base na análise, identificamos funcionalidades chave para elevar o PersonalGroup Experience ao nível ou acima dos concorrentes, mantendo a identidade Boutique.

### 1. 📹 Biblioteca de Exercícios em Vídeo (Prioridade Alta)
**O Gap:** Todos os concorrentes oferecem vídeos demonstrativos. Em uma metodologia complexa como a Flex, a execução correta é vital.
*   **Ação:** Implementar player de vídeo nos cards de exercício do `TrainingCycle`.
*   **Diferencial:** Gravar vídeos com os *próprios treinadores* da Personal Group para reforçar a proximidade e autoridade técnica.

### 2. 📊 Termômetro de Ocupação (Prioridade Média)
**O Gap:** O cliente premium valoriza seu tempo e conforto. Saber se a academia está cheia é essencial.
*   **Ação:** Adicionar um widget "Status do Club" na Home.
*   **Diferencial:** Além de mostrar lotação, sugerir "Melhores Horários para Treino Flex".

### 3. 🎟️ Guest Pass Digital (Marketing Orgânico)
**O Gap:** Bodytech e Selfit usam isso para aquisição.
*   **Ação:** Criar funcionalidade "Convide um Amigo" que gera um QR Code temporário de 1 dia.
*   **Regra:** Limitado a X convites/mês para manter a exclusividade.

### 4. 📅 Gestão de Aulas Coletivas (Se houver)
**O Gap:** Se a Personal Group tiver aulas (Yoga, Funcional, etc além do treino Flex), o sistema de reserva da Bodytech é o benchmark.
*   **Ação:** Expandir o módulo `Wellness` para suportar `Classes` com lista de espera automática.

### 5. ⭐️ Clubs & Gamificação (Retenção)
**O Gap:** O "sentimento de comunidade" pode ser digitalizado.
*   **Ação:** Criar "Squads" ou desafios baseados na frequencia (ex: "Clube dos 20 Treinos").
*   **Diferencial:** Recompensas reais (ex: massagem extra no Wellness, café grátis).

### 6. 💳 Gestão de Assinatura
**O Gap:** Transparência financeira.
*   **Ação:** Adicionar aba simples de "Plano" no Perfil, mostrando status de pagamento e data de renovação.

---

## 📝 Conclusão
O app PersonalGroup já vence na **profundidade técnica (Avaliação/Periodização)**, mas perde na **autonomia visual (Vídeos)** e **conveniência logística (Ocupação/Reservas)**. Implementar Vídeos e o Gráfico de Ocupação trará a percepção de "App de Rede Grande" com a qualidade de "Boutique".
