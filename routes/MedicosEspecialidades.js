const express = require('express');
const MedicosEspecialidades = require("../models/medicos_especialidades");

const medicoEspecialidadesRouter = express.Router();

//ROTORNAR TODOS os documentos
medicoEspecialidadesRouter.get('/medicoEsp', (req, res, next) => {
    async function AllData() {
        MedicosEspecialidades.find({}, (erro, dados) => {
            if (erro) {
                res.status(417).send({ message: "Nenhum registro encontrado" });
            }
            res.status(200);
            res.json(dados);
        });
    }
    AllData();
});

//retornar um DOCUMENTO específico
medicoEspecialidadesRouter.get('/medicoEsp/:id', (req, res, next) => {
    async function findOne() {
        MedicosEspecialidades.findById(req.params.id)
            .populate('medicoId').populate('especialidades.especialidadeId')
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
medicoEspecialidadesRouter.post('/medicoEsp', (req, res, next) => {
    async function newData() {
        const data = new MedicosEspecialidades(req.body, {
            medicoId: req.body.medicoId,
            especialidades: req.body.especialidades[{
                especialidadeId: req.body.especialidadeId
            }],
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
medicoEspecialidadesRouter.put('/medicoEsp/:id', (req, res, next) => {
    async function atualizar() {
        try {
            MedicosEspecialidades.findByIdAndUpdate(req.params.id, req.body, function (erro) {
                if (erro) {
                    res.send(erro);
                }
                res.status(201).send("Atualizado com sucesso!");
            });
        } catch{
            res.status(417).send("Algo deu errado");
        }
    };
    atualizar();
});

//DELETAR um registro
medicoEspecialidadesRouter.delete('/medicoEsp/:id', (req, res, next) => {
    async function deletar() {
        MedicosEspecialidades.findByIdAndDelete(req.params.id).then((dados) => {
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

module.exports = medicoEspecialidadesRouter;