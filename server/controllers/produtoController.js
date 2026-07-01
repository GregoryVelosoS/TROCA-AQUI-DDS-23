const produtoModel = require('../models/produtoModel');


module.exports = {

    // LÓGICA DO OFERTANTE (DASHBOARD E CADASTRO)
    // CRUD
    
    // CREATE
    // Renderiza página de cadastro
    renderizarCadastro: (req, res) => {
        res.render('produtos/cadastrar');
    },

    // Cria o produto
    cadastrar: async (req, res) => {
        try {
            // Pegamos o ID do dono através da Sessão/JWT da Rota! (req.usuario)
            const id_usuario = req.usuario.id;
            
            // Variáveis vindas do Form HTML
            const { nome, descricao, preco, condicao, is_publico } = req.body;
            
            // Converte string do HTML ('1' ou 'true') para Boolean do banco
            const publico_bool = is_publico === '1' || is_publico === 'true';
            
            // O caminho da imagem foi gerado e salvo pelo Middleware do Multer
            const foto_caminho = req.file ? `/uploads/produtos/${req.file.filename}` : null;

            // Chama o model passando as informações 
            await produtoModel.criarProduto(id_usuario, nome, descricao, preco, condicao, foto_caminho, publico_bool);
            
            // Ao fim, redireciona o usuário pra página geral de produtos
            res.redirect('/produtos/meus-produtos');

        } catch (erro) {
            console.error(erro);
            res.status(500).render('erro', { mensagem: 'Erro ao cadastrar produto.' });
        }
    },

    // READ
    listarMeusProdutos: async (req, res) => {
        try {
            // Pegamos o ID do dono através da Sessão/JWT da Rota! (req.usuario)
            const idOfertante = req.usuario.id; 

            // Busca a lista de produtos cadastrados
            const produtos = await produtoModel.listarPorOfertante(idOfertante);

            // Busca quem teve interesse nos produtos dele (O Join do SQL)
            // const interessados = await produtoModel.buscarInteressadosNosMeusProdutos(idOfertante);
            interessados = [""]

            // Renderiza passando as DUAS variáveis para o painel!
            res.render('produtos/listar', { produtos: produtos, interessados: interessados });

        } catch (erro) {
            res.status(500).render('erro', { mensagem: 'Erro ao buscar dashboard.' });
        }
    },

    // UPDATE
    // Busca o produto
    editar: async (req, res) => {
        try {
            // Pega o id do produto, vindo da url da requisição, através do req.params
            const id = req.params.id; 
            console.log(id);

            // Chama a função no model, passando o id coletado
            const produto = await produtoModel.buscarPorId(id);
            console.log(produto);
            
            // renderiza a página de editar, já com o formulário preenchido com as informações
            res.render('produtos/editar', { produto });
        } catch (erro) {
            res.status(500).render('erro', { mensagem: 'Erro ao abrir tela de edição de produto.' });
        }
    },

    // Atualiza as informações
    atualizar: async (req, res) => {
        try {
            // Pega o id do produto, vindo da url da requisição, através do req.params
            const id = req.params.id;

            // Cria um objeto com as informações das caixinhas
            const { nome, descricao, preco, condicao, is_publico } = req.body;

            // Converte string do HTML ('1' ou 'true') para Boolean do banco
            const publico_bool = is_publico === '1' || is_publico === 'true';
            
            // Resgata o caminho da foto, vindo do multer
            const foto_caminho = req.file ? `/uploads/produtos/${req.file.filename}` : null;

            // Chamar o model, e atualizar o produto
            await produtoModel.atualizarProduto(id, nome, descricao, preco, condicao, foto_caminho, publico_bool);

            // Ao fim, redireciona o usuário pra página geral de produtos
            res.redirect('/produtos/meus-produtos');
        } catch (erro) {
            res.status(500).render('erro', { mensagem: 'Erro ao atualizar produto no banco.' });
        }
    },

    // FUNÇÃO PRA ALTERNAR A VISIBILIDADE VEM AQUI
    alternarVisibilidade: async (req, res) => {
        try {
            // Pega o id do produto, vindo da url da requisição, através do req.params
            const id = req.params.id;

            // Chamar o model, e troca a visibilidade do produto
            await produtoModel.alternarVisibilidade(id);

            // Ao fim, redireciona o usuário pra página geral de produtos
            res.redirect('/produtos/meus-produtos');
        } catch (erro) {
            res.status(500).render('erro', { mensagem: 'Erro ao alternar status do produto.' });
        }
    },

    // LÓGICA DA VITRINE - Visualização geral de todos os produtos
       listarVitrine: async (req, res) => {
        try {
            // Model já filtra no banco: WHERE is_publico = TRUE
            const produtos = await produtoModel.listarVitrinePublica();
            
            // Verifica o que o usuário logado já curtiu
            let meusInteresses = [];
            if (req.usuario) {
                meusInteresses = await produtoModel.buscarInteressesDoUsuario(req.usuario.id);
            }

            // Rederiza a página de vitrine, passando os produtos gerais e todos os curtidos 
            res.render('vitrine/index', { produtos, meusInteresses });
        } catch (erro) {
            res.status(500).render('erro', { mensagem: 'Erro ao carregar a Vitrine de Trocas.' });
        }
    },

        // READ
    listarInteressados: async (req, res) => {
        try {
            // Pegamos o ID do dono através da Sessão/JWT da Rota! (req.usuario)
            const idOfertante = req.usuario.id; 

            // Busca quem teve interesse nos produtos dele (O Join do SQL)
            const interessados = await produtoModel.buscarInteressadosNosMeusProdutos(idOfertante);

            // Renderiza passando as DUAS variáveis para o painel!
            res.render('vitrine/interessados', { interessados: interessados });

        } catch (erro) {
            res.status(500).render('erro', { mensagem: 'Erro ao buscar dashboard.' });
        }
    },

    // === TOGGLE DE INTERESSE (BOTÃO CORAÇÃO) ===
    // Engatilhado quando o usuário clica no botão da Vitrine
    alternarInteresse: async (req, res) => {
        try {
            //Pega o Id do produto clicado no momento
            const idProduto = req.params.id; 

            // Pegamos o ID do dono através da Sessão/JWT da Rota! (req.usuario)
            const idInteressado = req.usuario.id; 

            // Checa se já clicou antes
            const jaTemInteresse = await produtoModel.checarInteresse(idProduto, idInteressado);

            if (jaTemInteresse) {
                // Se o botão estava preto (Estado 2), ele remove o interesse
                await produtoModel.removerInteresse(idProduto, idInteressado);
            } else {
                // Se o botão estava vermelho (Estado 1), ele registra
                await produtoModel.registrarInteresse(idProduto, idInteressado);
            }
            
            // Redireciona de volta para continuar navegando
            res.redirect('/produtos/vitrine');
        } catch (erro) {
            res.status(500).render('erro', { mensagem: 'Erro ao processar interesse.' });
        }
    }
}
