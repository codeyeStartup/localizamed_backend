const express = require('express');
const Clinicas = require("../models/clinicas");

const pesquisaRouter = express.Router();

pesquisaRouter.post('/search_clinica', async (req, res, next) => {

	const search = req.body.search;

	Clinicas.aggregate([
		/* { $unwind: "$medico" },
		{ $unwind: "$exame_consulta" }, */
		{
			$lookup: {
				from: "medicos",
				localField: "medico.medicoId",
				foreignField: "_id",
				as: 'result'
			}
		},
		//{ $unwind: '$result' },
		{
			$lookup: {
				from: "exames_consultas",
				localField: "exame_consulta.exame_consulta_id",
				foreignField: "_id",
				as: 'result2'
			}
		},
		//{ $unwind: '$result2' }, 
		{
			$match: {
				$or: [
					{
						'nome': { $regex: new RegExp(req.body.search, "i") }
					},
					{
						'cidade': { $regex: new RegExp(req.body.search, "i") }
					},
					{
						'result.nome': { $regex: new RegExp(req.body.search, "i") }
					},
					{
						'result2.nome': { $regex: new RegExp(req.body.search, "i") }
					},

				]


			}
		},
		{
			$group: {
				_id: {
					nome: "$nome", 
					id: "$_id", 
					cidade: "$cidade"
				}
			}
		},
	]).exec(function (err, data) {
		if (err) {
			console.log(err);
		}
		//console.log(data);
		res.json(data);
	});
});


module.exports = pesquisaRouter;
