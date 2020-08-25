const express = require('express');
const ClinicasMedicosExames = require("../models/clinicas_exames_medicos");
const fs = require('fs');

const clinMedExamRouter = express.Router();

//ROTORNAR TODOS os documentos
clinMedExamRouter.get('/clin_med_exam', (req, res, next) => {
    async function AllClinMedExam() {
        ClinicasMedicosExames.find({}, (erro, dados) => {
            if (erro) {
                res.status(417).send({ message: "Nenhum registro encontrado" });
            }
            res.status(200);
            res.json(dados);
        });
    }
    AllClinMedExam();
});

//retornar um DOCUMENTO específico
clinMedExamRouter.get('/clin_exam_med/:id', (req, res, next) => {
    async function findOne() {
        ClinicasMedicosExames.findById(req.params.id)
            .populate('clinicaId').populate('medico.medicoId')
            .populate('exame_consulta.exameConsultaId')
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
clinMedExamRouter.post('/clin_exam_med', (req, res, next) => {
    async function newData() {
        
        const data = new ClinicasMedicosExames(req.body,{
           
            clinicaId: req.body.clinicaId,
            medico: req.body.medico[{
                medicoId: req.body.medicoId
            }],    
            exame_consulta: req.body.exame_consulta[{
                exameConsultaId: req.body.exameConsultaId
            }]
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
clinMedExamRouter.put('/clin_exam_med/:id', (req, res, next) => {

    async function atualizar() {
        try {
            ClinicasMedicosExames.findByIdAndUpdate(req.params.id, req.body, function (erro) {
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
clinMedExamRouter.delete('/clin_exam_med/:id', (req, res, next) => {

    async function deletar() {
        ClinicasMedicosExames.findByIdAndDelete(req.params.id).then((dados) => {
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

module.exports = clinMedExamRouter;





