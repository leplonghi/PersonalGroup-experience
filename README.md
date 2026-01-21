# PersonalGroup Exclusive

Sistema de gerenciamento de treino e bem-estar para o PersonalGroup.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta Firebase (para produção)

### Instalação

1. **Clone o repositório** (se ainda não estiver clonado):
   ```bash
   git clone <repository-url>
   cd PersonalGroup-experience
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     copy .env.example .env
     ```
   - Edite o arquivo `.env` e adicione suas credenciais do Firebase
   - Para obter as credenciais, acesse o [Firebase Console](https://console.firebase.google.com/)

4. **Execute o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

O aplicativo estará disponível em `http://localhost:3000` (ou outra porta se 3000 estiver ocupada).

## 🔧 Configuração do Firebase

### Para Desenvolvimento Local

O aplicativo usa regras do Firestore permissivas para leitura durante o desenvolvimento. Para escritas, você precisará:

1. Criar um projeto Firebase
2. Habilitar Firestore Database
3. Copiar as credenciais para o arquivo `.env`
4. (Opcional) Executar o Firebase Emulator para desenvolvimento offline

### Para Produção

1. Atualize as regras do Firestore para produção:
   - Comente a função `allowDevRead()` 
   - Descomente as regras de autenticação estritas

2. Configure a autenticação:
   - Habilite o provedor Google no Firebase Authentication
   - Configure o domínio autorizado

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Firebase** - Backend as a Service
  - Firestore - Banco de dados
  - Authentication - Autenticação (a implementar)
  - Hosting - Deploy
- **Tailwind CSS** - Framework de estilos

## 🏗️ Estrutura do Projeto

```
PersonalGroup-experience/
├── components/          # Componentes React reutilizáveis
├── views/              # Páginas/visualizações principais
├── firebase.ts         # Configuração e funções do Firebase
├── types.ts            # Tipos TypeScript
├── constants.tsx       # Constantes e ícones
├── App.tsx             # Componente principal da aplicação
└── index.tsx           # Ponto de entrada
```

## 🐛 Correções Recentes

### Bugs Corrigidos:
1. ✅ Propriedades React SVG (`strokeJoin` → `strokeLinejoin`)
2. ✅ Configuração Firebase (environment variables)
3. ✅ Regras Firestore para desenvolvimento
4. ✅ Estrutura de variáveis de ambiente do Vite

### Melhorias Implementadas:
- Adicionado suporte a `.env` para configuração
- Criado arquivo `.env.example` para referência
- Atualizado `.gitignore` para proteger credenciais
- Adicionados tipos TypeScript para env vars
- Documentação melhorada

## 🔒 Segurança

- ⚠️ **NUNCA** faça commit do arquivo `.env` com credenciais reais
- Use `.env.example` como template
- Em produção, configure as variáveis de ambiente no serviço de hosting
- Mantenha as regras do Firestore estritas em produção

## 📝 Próximos Passos

1. Implementar autenticação Google
2. Adicionar testes unitários
3. Configurar CI/CD
4. Otimizar performance
5. Adicionar PWA support

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Crie um branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para o branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário do PersonalGroup.

---

**Desenvolvido por PersonalGroup Team**
