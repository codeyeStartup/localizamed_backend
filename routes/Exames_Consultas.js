const express = require('express');
const Exames_Consultas = require("../models/exames_consultas");
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;


const exames_consultasRouter = express.Router();

//função de RETORNAR TODOS os exames e consultas
exames_consultasRouter.get('/exames_consultas', (req, res, next)=>{
    async function AllExames_consultas(){
        Exames_Consultas.find({}, (erro, dados) => {
            if(erro){
                res.status(417).send({ message: "Nenhum registro recebido"});
            }
            res.status(200);
            res.json(dados);
        });
    }

    AllExames_consultas();
});

//função para RETORNAR UM ÚNICO exame ou consulta pelo id
exames_consultasRouter.get('/exames_consultas/:id', (req, res, next) => {
    async function findExame_consulta(){
        Exames_Consultas.findById(req.params.id).then((exames_consultas) => {
            res.status(200);
            res.json(exames_consultas);
        }).catch((erro) => {
            if(erro){
                res.status(417).send({ message: "Nenhum exame/consulta encontrado"});
                throw erro;
            }
        });
    }

    findExame_consulta();
});

//função de INSERIR dados no banco
exames_consultasRouter.post('/exames_consultas', (req, res, next)=>{

    async function salvaExame_Consulta(){
        const exame_consulta = new Exames_Consultas({
            nome: req.body.nome.trim(),
            tipo: req.body.tipo.trim(),
            preco: req.body.preco,            
            });


        try{
            const result = await exame_consulta.save();
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

    salvaExame_Consulta();
});

//função de DELETAR uma consulta
exames_consultasRouter.delete('/exames_consultas/:id', (req, res, next)=>{

    async function deletarExames_consultas(){
        Exames_Consultas.findByIdAndDelete(req.params.id).then((exame_consulta) => {
            if(exame_consulta){
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

    deletarExames_consultas();

});

//função de ATUALIZAR exames consultas
exames_consultasRouter.put('/exames_consultas/:id', (req, res, next)=>{

    async function atualizarExames_Consultas(){
        try{
            Exames_Consultas.findByIdAndUpdate(req.params.id, req.body, function(erro) {
                if (erro) {
                    res.send(erro);
                }
                res.status(201).send("Atualizado com sucesso!");
            });
        } catch{
            res.status(417).send("Algo deu errado");
        }

};

atualizarExames_Consultas();
});

//ATUALIZAR médico

module.exports = exames_consultasRouter;
