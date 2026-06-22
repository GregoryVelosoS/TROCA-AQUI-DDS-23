const db = require('../config/db');


module.exports = {
    // CRUD
    // CREATE
    // Insere o produto considerando foto e visibilidade pública
    criarProduto: async (id_usuario, nome, descricao, preco, condicao, foto, is_publico) => {
        // Query pra fazer a consulta no banco
        const query = 'INSERT INTO produtos (id_usuario, nome, descricao, preco, condicao, foto, is_publico) VALUES (?, ?, ?, ?, ?, ?, ?)';

        // Guarda o resultado da consulta na variável
        const [resultado] = await db.execute(query, [id_usuario, nome, descricao, preco, condicao, foto, is_publico]);

        // Retorna pro controller o produto, nesse caso o id do usuário inserido
        return resultado.insertId;
    },

    //READ
    // Busca os produtos pertencentes ao usuário logado
    listarPorOfertante: async (id_usuario) => {
        // Query pra fazer a consulta no banco
        const query = 'SELECT * FROM produtos WHERE id_usuario = ?';
        
        // Guarda o resultado da consulta na variável
        const [linhas] = await db.execute(query, [id_usuario]);
        
        // Retorna pro controller o resultado, nesse caso a lista com todos os produtos, criados por aquele ofertante logado
        return linhas;
    },

    // Busca APENAS os públicos na base de dados 
    listarVitrinePublica: async () => {
        // Query pra fazer a consulta no banco
        // Utilizamos JOIN para juntar a tabela de produtos com a de usuários e trazer o dono
        const query = `
            SELECT p.*, u.nome AS ofertante_nome, u.telefone AS ofertante_telefone 
            FROM produtos p 
            INNER JOIN usuarios u ON p.id_usuario = u.id 
            WHERE p.is_publico = TRUE
        `;

        // Guarda o resultado da consulta na variável
        const [linhas] = await db.execute(query);

        // Retorna pro controller o resultado, nesse caso a lista com todos os produtos públicos
        return linhas;
    },

    // UPDATE
    // Busca um único produto pelo ID para preencher a tela de Edição
    buscarPorId: async (id) => {
        // Query pra fazer a consulta no banco
        const query = 'SELECT * FROM produtos WHERE id = ?';
        
        // Guarda o resultado da consulta na variável
        const [linhas] = await db.execute(query, [id]);
        
        // Retorna pro controller o resultado, nesse caso o produto encontrado
        return linhas[0];
    },


    // Processa a Atualização Completa do Produto (Com ou Sem a troca da foto)
    atualizarProduto: async (id, nome, descricao, preco, condicao, foto, is_publico) => {
        // Lógica para atualizar com e sem foto anexada
        if (foto) {
            // Se mandou foto, atualiza a coluna foto
            const query = 'UPDATE produtos SET nome=?, descricao=?, preco=?, condicao=?, foto=?, is_publico=? WHERE id=?';
            await db.execute(query, [nome, descricao, preco, condicao, foto, is_publico, id]);
        } else {
            // Se NÃO mandou foto nova, apenas atualiza os textos e ignora a foto (mantém a velha)
            const query = 'UPDATE produtos SET nome=?, descricao=?, preco=?, condicao=?, is_publico=? WHERE id=?';
            await db.execute(query, [nome, descricao, preco, condicao, is_publico, id]);
        }
    },

    // **DELETE
    // Inverte o valor 'is_publico' (Toggle)
    alternarVisibilidade: async (id) => {
        const query = 'UPDATE produtos SET is_publico = NOT is_publico WHERE id = ?';
        await db.execute(query, [id]);
    },

    // FUNÇÃO PRA ALTERNAR A INTERESSE VEM AQUI
    // Algo vem aqui

};
