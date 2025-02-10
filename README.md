# Aplicação de CHAT

Esta é uma aplicação de chat em tempo real que utiliza WebSockets para comunicação instantânea, além de autenticação via sessions e JWT para garantir a segurança dos usuários. A aplicação foi desenvolvida utilizando as seguintes tecnologias:

- **Frontend:** Angular, Bootstrap
- **Backend:** Node.js, Express, Socket.IO, dotenv
- **Serviços:** Firebase (Firestore Database e Authentication)

---

## Funcionalidades

- **Chat em tempo real:** Comunicação instantânea entre usuários através de WebSockets.
- **Autenticação:** Login seguro utilizando sessions e tokens JWT.
- **Armazenamento:** Persistência de dados (mensagens, informações de usuários, etc.) utilizando Firestore.
- **Interface responsiva:** Design adaptável com Bootstrap.

---

## Tecnologias Utilizadas

- **Angular:** Framework para construção do frontend.
- **Bootstrap:** Framework CSS para criação de interfaces responsivas e modernas.
- **Node.js & Express:** Servidor backend para gerenciamento de rotas, autenticação e APIs.
- **Socket.IO:** Implementação de comunicação em tempo real via WebSockets.
- **Firebase:** Firestore Database para armazenamento de dados e Firebase Authentication para gerenciamento de usuários.
- **dotenv:** Gerenciamento de variáveis de ambiente para manter as configurações sensíveis fora do código-fonte.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Angular CLI](https://angular.io/cli)
- Conta no [Firebase](https://firebase.google.com/) para configurar o Firestore e Authentication

---

## Instalação

1. **Clone o repositório:**

   git clone https://github.com/GNevez/ChatService
   cd seu-repositorio
   
## Instale as dependências:

cd backend-chat
npm install
Instale as dependências do frontend:

cd ../ng-fireapp
npm install
Configuração
Variáveis de Ambiente (Backend):

Crie um arquivo .env na pasta do backend com as seguintes variáveis (exemplo):

env
PORT=3001

## Firebase:

Configure seu projeto no Firebase.
Ative o Firestore Database e o Firebase Authentication.
Utilize as credenciais fornecidas pelo Firebase para completar as variáveis de ambiente.
Crie um arquivo "firebase-acc.json" na raiz do projeto backend e cole a configuração que você baixou do seu Firestore
Executando a Aplicação

## Backend
Na pasta backend, execute:

npm start
O servidor será iniciado na porta definida (por padrão, 3001).

## Frontend
Na pasta frontend, execute:

ng serve --open
O Angular iniciará o servidor de desenvolvimento e abrirá a aplicação no navegador (normalmente em http://localhost:4200).

## Estrutura do Projeto
A estrutura do projeto pode ser organizada da seguinte forma:

## Contribuição
Contribuições são bem-vindas! Caso queira melhorar ou adicionar novas funcionalidades à aplicação, sinta-se à vontade para criar issues e pull requests.

## Contato
Se tiver dúvidas ou sugestões, entre em contato pelo guilhermenferraz@gmail.com








