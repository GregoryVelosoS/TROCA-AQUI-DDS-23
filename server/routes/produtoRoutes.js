// importação do módulo express
const express = require("express");
const router = express.Router();

// Importar o controller dos produtos
const produtoController = require('../controllers/produtoController');

// Importar o multer
const upload = require('../config/multer'); 

// Importar o middleware de autenticação
const { verificarAutenticacao, somenteOfertante, usuariosComuns } = require('../middlewares/authMiddleware');

// Todos precisam estar logados
router.use(verificarAutenticacao);

// ROTAS DO OFERTANTE

// CRUD
// READ - LISTAR PRODUTOS 
// Obtém a lista de produtos, mas apenas aqueles cadastrados pelo usuário logado
router.get("/meus-produtos", somenteOfertante, produtoController.listarMeusProdutos)

// CREATE - CRIAR PRODUTOS
// Retornar a página de cadastro de produtos
router.get('/cadastro', somenteOfertante, produtoController.renderizarCadastro);

// Rota de cadastro de produto
// O multer, salva a imagem primeiro, através do upload.single, depois chama o controller
router.post('/cadastrar', somenteOfertante, upload.single('foto'), produtoController.cadastrar);

// UPDATE - LISTA as informações de um produto
router.get('/editar/:id', somenteOfertante, produtoController.editar);

// UPDATE - ATUALIZA AS INFORMAÇOES DE UM PRODUTO
router.post('/atualizar/:id', somenteOfertante, upload.single('foto'), produtoController.atualizar);

// ROTA DE ALTERNAR VISIBILIDADE DO PRODUTO
// ROTA VEM AQUI

// ROTAS GERAIS (Ofertantes e Interessados veem a Vitrine e dão Match)
router.post('/alternar-visibilidade/:id', somenteOfertante, produtoController.alternarVisibilidade);

// Obtém a lista de todos os produtos com visibilidade ativa
router.get("/vitrine", usuariosComuns, produtoController.listarVitrine )

// ROTA DE ALTERNAR INTERESSE DO PRODUTO
// ROTA VEM AQUI

module.exports = router