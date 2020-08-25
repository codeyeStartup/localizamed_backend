const express = require('express');
const Especialidades = require("../models/especialidades");
const especialidadesRouter = express.Router();

//retornar TODAS as especialidades
especialidadesRouter.get('/especialidades', (req, res, next) => {
	async function allEspecialidades(){
		Especialidades.find({}, (erro, dados) => {
			if(erro) {
				res.status(417).send({ message: "Nenhum registro recebido"});
			}
			res.status(200);
			res.json(dados);
		});
	}

	allEspecialidades();
});

//retornar uma UNICA especialidade
especialidadesRouter.get('/especialidade/:id', (req, res, next) => {
	async function findEspecialidade(){
		Especialidades.findById(req.params.id).then((especialidade) => {
			res.status(200);
			res.json(especialidade);
		}).catch((erro) => {
			if(erro) {
				res.status(417).send({ message: "Nenhuma especialidade encontrada"});
			}
		});
	}

	findEspecialidade();
});

//INSERIR uma nova especialidade
especialidadesRouter.post('/especialidade', (req, res, next) => {
	async function salvaEspecialidade(){
		const especialidades = new Especialidades({
			especialidade: req.body.especialidade
		});

		try{
			const result = await especialidades.save();
			console.log("Especialidade inserida");
			res.status(201).send({ message: "Especialidade inserida"});
		} catch (erro){
			console.log(erro.message);
			res.status(406).send({ message: "Cadastro falhou"});
		}
	}

	salvaEspecialidade();
});

//DELETAR uma especialidade
especialidadesRouter.delete('/especialidade/:id', (req, res, next) => {
	async function deletarEspecialidade(){
		Especialidades.findByIdAndDelete(req.params.id).then((especialidade) => {
			if(especialidade) {
				res.status(200).send({ message: "Especialidade deletada"});
			} else {
				res.status(404).send({ message: "Registro não encontrado"});
			}
		}).catch((erro) => {
			if(erro) {
				res.status(417).send({ message: "Falha ao deletar registro"});
				throw erro;
			}
		})
	}

	deletarEspecialidade();
});

//ATUALIZAR uma especialidade
especialidadesRouter.put('/especialidade/:id', (req, res, next) => {
	async function atualizarEspecialidade(){
		try{
			Especialidades.findByIdAndUpdate(req.params.id, req.body, function(erro) {
				if (erro) {
					res.send(erro);
				}
				res.status(201).send("Especialidade atualizada");
			});
		} catch {
			res.status(417).send("Falha ao atualizar registro");
		}
	}

	atualizarEspecialidade();
});

module.exports = especialidadesRouter;