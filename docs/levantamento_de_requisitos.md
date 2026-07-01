# Documento de Levantamento de Requisitos - TrocaApp

## Objetivo do Projeto
O objetivo do projeto **TrocaApp** é fornecer uma plataforma web estruturada para facilitar a conexão e a troca de produtos entre usuários. O sistema aproxima pessoas dispostas a disponibilizar itens ("Ofertantes") de pessoas que desejam adquirir itens ("Interessados"), centralizando o catálogo de produtos numa vitrine virtual. Adicionalmente, o sistema fornece uma área robusta de gerenciamento administrativo para controle do ciclo de vida de contas e manutenção da plataforma, empregando controle de acesso estrito baseado em papéis (RBAC).

---

## 1. Requisitos Funcionais (RF)

| ID Requisito | Nome do Requisito | Descrição |
| :--- | :--- | :--- |
| **RF01** | Cadastro de Usuários | O sistema deve permitir o cadastro de novos usuários informando nome, e-mail, telefone, senha e, opcionalmente, foto de perfil. |
| **RF02** | Login de Usuários | O sistema deve permitir que os usuários façam login fornecendo seu e-mail e senha cadastrados. |
| **RF03** | Logout de Usuários | O sistema deve permitir que usuários logados encerrem suas sessões ativas com segurança. |
| **RF04** | Controle de Perfis (RBAC) | O sistema deve categorizar os usuários em diferentes níveis de acesso: 'administrador', 'ofertante' e 'interessado'. |
| **RF05** | Edição de Perfil | O sistema deve permitir que um usuário modifique suas próprias informações pessoais através de um formulário de edição. |
| **RF06** | Atualização de Senha | O sistema deve permitir que o usuário defina uma nova senha ou mantenha a atual ao editar seu perfil. |
| **RF07** | Cadastro de Produtos | O sistema deve permitir que usuários 'ofertantes' cadastrem novos itens para troca anexando nome, características e foto. |
| **RF08** | Listagem de Meus Produtos | O sistema deve disponibilizar aos 'ofertantes' um painel privativo com a lista de todos os seus produtos anunciados. |
| **RF09** | Edição de Produto | O sistema deve permitir que o usuário altere as informações de um produto que ele mesmo cadastrou. |
| **RF10** | Exclusão de Produto | O sistema deve permitir que um usuário remova um anúncio de produto criado por ele. |
| **RF11** | Vitrine Pública | O sistema deve exibir todos os produtos disponíveis na plataforma numa página de vitrine coletiva. |
| **RF12** | Detalhamento de Produto | O sistema deve permitir que qualquer usuário logado visualize a página de detalhes técnicos de um produto na vitrine. |
| **RF13** | Filtro/Busca na Vitrine | O sistema deve permitir a busca de produtos na vitrine por meio de palavras-chave, nomes ou categorias. |
| **RF14** | Envio de Proposta | O sistema deve permitir que um 'interessado' envie uma notificação de interesse (proposta de troca) sobre um produto específico. |
| **RF15** | Recepção de Propostas | O sistema deve permitir que um 'ofertante' veja a lista de propostas de troca que usuários interessados submeteram aos seus produtos. |
| **RF16** | Aceite/Recusa de Troca | O sistema deve possuir botões/mecanismos para o ofertante aprovar ou rejeitar uma solicitação de troca de um interessado. |
| **RF17** | Contato pós-Proposta | O sistema deve revelar as informações de contato (ex: WhatsApp/telefone) de ambas as partes assim que a troca for aprovada. |
| **RF18** | Visualização de Histórico | O sistema deve exibir aos usuários um registro de trocas que eles já concluíram com sucesso através da plataforma. |
| **RF19** | Painel Geral de Usuários | O sistema deve permitir que administradores acessem uma listagem completa e tabelada com todos os usuários do banco de dados. |
| **RF20** | Cadastro por Administrador | O sistema deve permitir que um 'administrador' realize o cadastro direto de novos usuários no sistema através de um painel gerencial. |
| **RF21** | Edição de Contas de Terceiros | O sistema deve permitir que 'administradores' editem os dados de qualquer usuário cadastrado no sistema (suporte/moderação). |
| **RF22** | Exclusão de Contas | O sistema deve permitir que 'administradores' excluam permanentemente qualquer usuário do sistema. |
| **RF23** | Tratamento de Upload (Usuários) | O sistema deve processar o envio de imagens em requisições de formulários (multipart/form-data) e armazenar a URL das fotos de perfil. |
| **RF24** | Tratamento de Upload (Produtos) | O sistema deve processar e gerir a imagem do produto quando enviada ou atualizada em sua respectiva tela. |
| **RF25** | Menu Dinâmico de Navegação | A barra de navegação da aplicação deve alterar suas opções dinamicamente com base no perfil (permissões) do usuário logado. |
| **RF26** | Restrição de Rotas Ocultas | O sistema deve bloquear programaticamente rotas administrativas caso tentem ser acessadas por contas de interessados ou ofertantes. |
| **RF27** | Prevenção de Auto-Elevação | O sistema não deve permitir que o formulário de cadastro público da página principal crie contas com perfil 'administrador'. |
| **RF28** | Tratamento de Erros e Feedbacks | O sistema deve redirecionar o usuário para uma tela genérica de Erro (ou usar alertas visuais) em caso de credenciais inválidas ou acesso não autorizado. |
| **RF29** | Manutenção de Permissão Existente | O sistema não deve redefinir o nível de permissão de um usuário, mantendo-o intacto caso campos em branco sejam salvos na edição. |
| **RF30** | Visualização de Imagem Padrão | O sistema deve injetar uma imagem "placeholder" ou genérica na visualização caso um usuário ou produto não possua foto cadastrada. |

---

## 2. Requisitos Não Funcionais (RNF)

| ID Requisito | Nome do Requisito | Descrição |
| :--- | :--- | :--- |
| **RNF01** | Criptografia de Senhas | As senhas dos usuários devem ser armazenadas de forma segura no banco de dados, convertidas em hashes de mão-única através da biblioteca `bcrypt`. |
| **RNF02** | Autenticação via JWT | As sessões do sistema devem utilizar tokens padrão JWT (JSON Web Token), fornecidos pelo back-end em cada login. |
| **RNF03** | Persistência do JWT em Cookies | Os tokens de sessão JWT gerados devem ser persistidos no navegador do usuário na forma de cookies `httpOnly`, dificultando o roubo via JS do lado cliente. |
| **RNF04** | Padrão Arquitetural MVC | Todo o projeto Node.js deve ser fisicamente isolado e desenvolvido utilizando as camadas independentes do paradigma MVC (Model - View - Controller). |
| **RNF05** | Renderização no Servidor (SSR) | A interface da aplicação web deve ser montada diretamente no backend (Server-Side Rendering) fazendo uso intensivo do motor de templates `EJS`. |
| **RNF06** | Padronização e Reutilização UI | A estrutura front-end da aplicação deve evitar repetição de código HTML usando inclusão de *partials* (fragmentos como `header.ejs` e `footer.ejs`). |
| **RNF07** | Processamento de Midias | O armazenamento de arquivos estáticos, como o *upload* de fotos submetidas nos formulários, deve ser gerenciado no Node.js por meio da biblioteca (middleware) `multer`. |
| **RNF08** | Banco de Dados Relacional | Os dados de produtos, usuários e relacionamento entre entidades devem ser persistidos no banco de dados usando linguagem SQL nativa com o pacote `mysql2`. |
| **RNF09** | Responsividade de Interface | O design do front-end deve adaptar-se adequadamente em telas mobile e desktop através de classes utilitárias do framework `Bootstrap 5`. |
| **RNF10** | Identidade Visual Global (CSS) | A aplicação web deve implementar variáveis nativas do CSS (`--cor-fundo`, `--cor-destaque`, etc.) num arquivo unificado de estilos (`tema.css`) para assegurar coesão visual a longo prazo. |
