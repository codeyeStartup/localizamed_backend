const express = require('express');
const Planos_de_saude = require("../models/planos_de_saude");
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;


const planosDeSaudeRouter = express.Router();

//função de RETORNAR TODOS os exames e consultas
planosDeSaudeRouter.get('/planos_de_saude', (req, res, next)=>{
    async function AllPlanos_de_saude(){
        Planos_de_saude.find({}, (erro, dados) => {
            if(erro){
                res.status(417).send({ message: "Nenhum registro recebido"});
            }
            res.status(200);
            res.json(dados);
        });
    }

    AllPlanos_de_saude();
});

//função para RETORNAR UM ÚNICO plano de saúde pelo id
planosDeSaudeRouter.get('/planos_de_saude/:id', (req, res, next) => {
    async function findplano_de_saude(){
        Planos_de_saude.findById(req.params.id).then((plano_de_saude) => {
            res.status(200);
            res.json(plano_de_saude);
        }).catch((erro) => {
            if(erro){
                res.status(417).send({ message: "Nenhum plano de saúde encontrado"});
                throw erro;
            }
        });
    }

    findplano_de_saude();
});

//função de INSERIR dados no banco
planosDeSaudeRouter.post('/planos_de_saude', (req, res, next)=>{

    async function salvaPlano_de_saude(){
        const plano_de_saude = new Planos_de_saude({
            nome: req.body.nome,
            data_atualizacao: null
            });


        try{
            const result = await plano_de_saude.save();
            console.log("Operação realizada com sucesso");
            res.status(201).send({ message: "Cadastrado com sucesso!"});
            /* res.statusCode = 201;
            res.send(); */
        } catch(erro){
            console.log(erro.message);
            res.status(406).send({ message: "Cadastro falhou"});
            /* res.statusCode = 406;
            res.send(); */
        }
    }

    salvaPlano_de_saude();
});

//função de DELETAR uma consulta
planosDeSaudeRouter.delete('/planos_de_saude/:id', (req, res, next)=>{

    async function deletarPlanos_de_saude(){
        Planos_de_saude.findByIdAndDelete(req.params.id).then((plano_de_saude) => {
            if(plano_de_saude){
                res.status(200).send({ message: "Deletado com sucesso"});
            } else{
                res.status(404).send({ message: "Registro não encontrado"});
            }
        }).catch((erro) => {
            if(erro){
                res.status(417).send({ message: "Falha ao deletar registro"});
                throw erro;
            }
        });
    }

    deletarPlanos_de_saude();

});

//função de ATUALIZAR planos de saude
planosDeSaudeRouter.put('/planos_de_saude/:id', (req, res, next)=>{

    async function atualizarPlanos_de_saude(){
        try{
            Planos_de_saude.findByIdAndUpdate(req.params.id, req.body, function(erro) {
                if (erro) {
                    res.send(erro);
                }
                res.status(201).send("Atualizado com sucesso!");
            });
        } catch{
            res.status(417).send("Algo deu errado");
        }

};

atualizarPlanos_de_saude();
});

//ATUALIZAR médico

module.exports = planosDeSaudeRouter;
