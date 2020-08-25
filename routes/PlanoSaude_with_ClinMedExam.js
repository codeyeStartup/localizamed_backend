const express = require('express');
const PlanoSaude_ClinMedExame = require("../models/planos_saude_with_clin_exam_med");

const planoSaude_with_ClinMedExameRouter = express.Router();

//ROTORNAR TODOS os documentos
planoSaude_with_ClinMedExameRouter.get('/ps_clin_med_exam', (req, res, next) => {
    async function Alldata() {
        PlanoSaude_ClinMedExame.find({}, (erro, dados) => {
            if (erro) {
                res.status(417).send({ message: "Nenhum registro encontrado" });
            }
            res.status(200);
            res.json(dados);
        });
    }
    Alldata();
});

//retornar um DOCUMENTO específico
planoSaude_with_ClinMedExameRouter.get('/ps_clin_med_exam/:id', (req, res, next) => {
    async function findOne() {
        PlanoSaude_ClinMedExame.findById(req.params.id)
            .populate('clinicaMedicoExameId').populate('planoDeSaudeId')
            .then((dados) => {
                res.status(200);
                res.json(dados);
            }).catch((erro) => {
                if (erro) {
                    res.status(417).send({ message: "nenhum registro encontrado" });
                    throw erro;
                }
            });
    }

    findOne();
});

//INSERIR UM NOVO documento
planoSaude_with_ClinMedExameRouter.post('/ps_clin_med_exam', (req, res, next) => {
    async function newData() {
        
        const data = new PlanoSaude_ClinMedExame({           
            clinicaMedicoExameId: req.body.clinicaMedicoExameId,
            planoDeSaudeId: req.body.planoDeSaudeId,            
        });

        try {                
            const result = await data.save();
            console.log("Operação realizada com sucesso");
            res.status(201).send({ message: "Cadastrado com sucesso!" });
        } catch (erro) {
            console.log(erro.message);
            res.status(406).send({ message: "Cadastro falhou" });
        }
    }

    newData();
});

//ATUALIZAR um registro
planoSaude_with_ClinMedExameRouter.put('/ps_clin_med_exam/:id', (req, res, next) => {

    async function atualizar() {
        try {
            PlanoSaude_ClinMedExame.findByIdAndUpdate(req.params.id, req.body, function (erro) {
                if (erro) {
                    res.send(erro);
                }
                console.log(req.body);
                res.status(201).send("Atualizado com sucesso!");
            });
        } catch{
            res.status(417).send("Algo deu errado");
        }

    };

    atualizar();
});

//DELETAR um registro
planoSaude_with_ClinMedExameRouter.delete('/ps_clin_med_exam/:id', (req, res, next) => {

    async function deletar() {
        PlanoSaude_ClinMedExame.findByIdAndDelete(req.params.id).then((dados) => {
            if (dados) {
                res.status(200).send({ message: "Deletado com sucesso" });
            } else {
                res.status(404).send({ message: "Registro não encontrado" });
            }
        }).catch((erro) => {
            if (erro) {
                res.status(417).send({ message: "Falha ao deletar registro" });
                throw erro;
            }
        });
    }

    deletar();

});

module.exports = planoSaude_with_ClinMedExameRouter;