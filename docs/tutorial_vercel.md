# Tutorial: Implantação do trocAqui no Vercel

O Vercel é uma plataforma voltada para **Serverless Functions** (Funções sem servidor). Como o nosso projeto foi construído usando uma arquitetura tradicional com Node.js (Express, Arquivos Locais e MySQL), algumas adaptações críticas são necessárias para que ele funcione na nuvem.

---

## ⚠️ Atenção aos Desafios do Serverless

Antes de começar, você precisa entender como o Vercel funciona:
1. **Banco de Dados:** O Vercel não hospeda banco de dados MySQL. Você precisará colocar seu banco de dados na nuvem usando serviços gratuitos como o **Aiven**, **PlanetScale**, **Railway** ou **Tidb**.
2. **Upload de Imagens:** O Vercel não permite salvar arquivos no "Disco Rígido" dele. A pasta `/uploads` não funcionará. Para o Multer funcionar em produção, você precisaria enviar as fotos para um serviço externo como o **Cloudinary** ou **Vercel Blob**. Para fins didáticos iniciais, você pode subir o sistema sabendo que os uploads não irão persistir.

---

## Passo 1: Adaptar o `server.js`

O Vercel não quer que seu servidor fique "ouvindo" uma porta o tempo todo (`app.listen`). Ele quer que você exporte o aplicativo para que o próprio Vercel o acorde quando alguém acessar o site.

No final do seu arquivo `server/server.js`, altere a inicialização da porta:

```javascript
// Remova ou comente este bloco:
/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta ' + PORT);
});
*/

// Adicione este export no final do arquivo:
module.exports = app;
```

---

## Passo 2: Criar o arquivo `vercel.json`

Na **raiz do seu projeto** (onde fica a pasta server e client), crie um arquivo chamado `vercel.json`. Esse arquivo é o mapa que ensina o Vercel a rodar seu backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/css/(.*)",
      "dest": "/client/public/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "/client/public/js/$1"
    },
    {
      "src": "/uploads/(.*)",
      "dest": "/client/public/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "server/server.js"
    }
  ]
}
```
*Nota: Se a sua estrutura de pastas do Vercel der erro nas views, você pode precisar corrigir os caminhos do `path.join(__dirname)` no `server.js`.*

---

## Passo 3: Preparar o Banco de Dados (Nuvem)

Você precisa exportar seu banco local e importá-lo em uma nuvem (ex: Aiven for MySQL):
1. Crie uma conta no [Aiven](https://aiven.io/) ou serviço similar.
2. Crie um banco de dados MySQL gratuito.
3. Pegue as credenciais geradas (Host, User, Password, Port).
4. No Aiven, abra a aba de "Query" e rode seu script `data/schema.sql`.

---

## Passo 4: Subindo o Projeto para o GitHub

O Vercel trabalha lendo o seu código direto do GitHub.
1. No seu terminal, inicie o Git na raiz do projeto (se já não estiver):
   ```bash
   git init
   git add .
   git commit -m "Preparando para o Vercel"
   ```
2. Crie um repositório no GitHub e faça o `git push` do seu código.
3. **MUITO IMPORTANTE:** Crie um arquivo `.gitignore` e coloque `node_modules` e `.env` lá dentro para não vazar sua senha do banco!

---

## Passo 5: Implantando (Deploy) no Vercel

1. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta do GitHub.
2. Clique no botão **"Add New Project"**.
3. Escolha o repositório do `trocAqui` e clique em **"Import"**.
4. Na tela de configuração de Deploy, abra a aba **"Environment Variables"** (Variáveis de Ambiente) e cadastre as senhas do seu banco de dados na nuvem (AS MESMAS DO .ENV LOCAL):
   - `DB_HOST` = (Link do Aiven)
   - `DB_USER` = (Usuário do Aiven)
   - `DB_PASS` = (Senha do Aiven)
   - `DB_NAME` = (Nome do DB)
   - `JWT_SECRET` = sua_senha_secreta
5. Clique em **Deploy**.

O Vercel fará a instalação (`npm install`) e em poucos minutos te dará uma URL pública (ex: `https://trocaqui.vercel.app`). Seu sistema já poderá ser acessado pelo celular!
