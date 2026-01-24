# 🎨 Sistema de Cores PersonalGroup Experience

## Filosofia de Design
Sistema de cores centrado em **azuis profundos e gradientes**, eliminando cinzas/titanium para criar uma experiência visual rica e coesa em ambos os modos (claro/escuro).

---

## 🌈 Paleta Principal

### Azuis Profundos (Dark Mode Base)
```css
--pg-deep-blue: #080838      /* Header/Navigation - Azul profundo exclusivo */
--pg-midnight: #0A0F2C       /* Background dark principal */
--pg-ocean: #0F1B3F          /* Cards e surfaces dark */
```

### Azuis Vibrantes (Acentos)
```css
--pg-cobalt: #2563EB         /* Azul primário - botões, links, acentos */
--pg-sky: #3B82F6            /* Azul médio - hover states */
--pg-laser: #00F2FF          /* Ciano tecnológico - highlights */
```

### Azuis Claros (Light Mode Base)
```css
--pg-ice: #E0F2FE            /* Surface light mode */
--pg-frost: #F0F9FF          /* Background light mode */
```

### Funcionais
```css
--pg-success: #10B981        /* Verde - sucesso, status ativo */
--pg-warning: #F59E0B        /* Laranja - avisos */
--pg-surface: #FFFFFF        /* Branco puro */
```

---

## 🎭 Modos de Tema

### 🌞 Light Mode
- **Background**: Gradiente `#F0F9FF → #FFFFFF → #EFF6FF`
- **Texto principal**: `#1E3A8A` (azul escuro)
- **Texto secundário**: `#3B82F6` (azul médio)
- **Cards**: `rgba(255, 255, 255, 0.8)` com backdrop-blur
- **Bordas**: `rgba(37, 99, 235, 0.15)` (azul transparente)

### 🌙 Dark Mode
- **Background**: Gradiente radial `#0F1B3F → #080838 → #020617`
- **Texto principal**: `#E0F2FE` (azul muito claro)
- **Texto secundário**: `#93C5FD` (azul claro)
- **Cards**: `rgba(15, 27, 63, 0.6)` com backdrop-blur
- **Bordas**: `rgba(59, 130, 246, 0.2)` (azul transparente)

---

## 🎨 Gradientes

### Primary Gradient
```css
linear-gradient(135deg, #080838 0%, #2563EB 100%)
```
Uso: Fundos principais, hero sections

### Accent Gradient
```css
linear-gradient(135deg, #2563EB 0%, #00F2FF 100%)
```
Uso: Botões premium, highlights

### Hero Gradient
```css
linear-gradient(135deg, #0A0F2C 0%, #1E40AF 50%, #2563EB 100%)
```
Uso: Seções hero, cards especiais

### Background Light
```css
linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 50%, #EFF6FF 100%)
```

### Background Dark
```css
radial-gradient(ellipse at top, #0F1B3F 0%, #080838 40%, #020617 100%)
```

---

## 🔮 Glassmorphism

### Light Glass
```css
background: rgba(240, 249, 255, 0.6)
backdrop-filter: blur(10px)
border: 1px solid rgba(37, 99, 235, 0.15)
```

### Dark Glass
```css
background: rgba(8, 8, 56, 0.8)
backdrop-filter: blur(40px) saturate(200%)
border: 1px solid rgba(59, 130, 246, 0.2)
```

---

## 📦 Classes Utilitárias

### Backgrounds Theme-Aware
```css
.bg-app         /* Light: frost | Dark: midnight */
.bg-card        /* Light: white/80 blur | Dark: ocean/60 blur */
.bg-surface     /* Light: ice | Dark: ocean */
.bg-input       /* Light: frost/80 | Dark: deep-blue/50 */
```

### Texto Theme-Aware
```css
.text-app       /* Light: #1E3A8A | Dark: #E0F2FE */
.text-app-muted /* Light: #3B82F6 | Dark: #93C5FD */
```

### Bordas Theme-Aware
```css
.border-app     /* Light: blue/15 | Dark: blue/20 */
```

### Efeitos Especiais
```css
.glass-card     /* Glassmorphism card */
.glass-panel    /* Glassmorphism panel */
.blue-gradient  /* Primary gradient background */
.mesh-gradient  /* Hero gradient com overlay */
.precision-bg   /* Background com glows animados */
```

---

## 🎯 Uso por Componente

### Header & Navigation
- Background: `#080838` (deep-blue)
- Border: `border-white/10`
- Shadow: `shadow-blue-900/30`

### Cards
- **Flat**: `bg-white/80 dark:bg-ocean/60` + blur
- **Elevated**: `bg-white/90 dark:bg-ocean/70` + shadow
- **Glass**: `glass-panel`
- **Blue**: `mesh-gradient`
- **Outline**: `border-blue-300/30 dark:border-blue-400/30`

### Botões
- **Primary**: `bg-cobalt` → hover `#1D4ED8`
- **Shadow**: `rgba(37, 99, 235, 0.5)`
- **Border**: `border-blue-400/30`

---

## ✅ Tailwind Classes Disponíveis

```
bg-deep-blue    text-deep-blue    border-deep-blue
bg-midnight     text-midnight     border-midnight
bg-ocean        text-ocean        border-ocean
bg-cobalt       text-cobalt       border-cobalt
bg-sky          text-sky          border-sky
bg-laser        text-laser        border-laser
bg-ice          text-ice          border-ice
bg-frost        text-frost        border-frost
```

---

## 🚫 Cores Removidas (Não Usar)

❌ `--pg-obsidian` (#050505)
❌ `--pg-titanium` (#121212)
❌ `--pg-titanium-light` (#1A1A1A)
❌ Qualquer variação de `slate-`, `gray-`, `zinc-`, `neutral-`

---

## 💡 Princípios de Uso

1. **Sempre use azuis**: Mesmo para elementos "neutros", prefira azuis suaves
2. **Gradientes são seus amigos**: Use gradientes para criar profundidade
3. **Glassmorphism em tudo**: Adicione blur e transparência para modernidade
4. **Modo claro = azul suave**: Não use branco puro, use frost/ice
5. **Modo escuro = azul profundo**: Não use preto puro, use midnight/ocean
6. **Bordas sempre azuis**: Use transparências de azul, nunca cinza

---

## 🎨 Exemplos de Combinações

### Card Premium (Dark)
```css
background: rgba(15, 27, 63, 0.6)
backdrop-filter: blur(20px)
border: 1px solid rgba(59, 130, 246, 0.2)
box-shadow: 0 30px 60px rgba(37, 99, 235, 0.4)
```

### Card Premium (Light)
```css
background: rgba(255, 255, 255, 0.8)
backdrop-filter: blur(10px)
border: 1px solid rgba(37, 99, 235, 0.15)
box-shadow: 0 30px 60px rgba(8, 8, 56, 0.5)
```

### Texto com Gradiente
```css
/* Light */
background: linear-gradient(135deg, #E0F2FE 0%, #93C5FD 100%)

/* Dark */
background: linear-gradient(135deg, #FFFFFF 0%, #BFDBFE 100%)
```

---

**Última atualização**: 2026-01-24
**Versão**: 2.0 - Blue Centric System
