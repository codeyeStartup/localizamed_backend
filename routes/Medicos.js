const express = require('express');
const fs = require('fs');
const cloudinary = require("cloudinary").v2;

const Medicos = require("../models/medicos");
const { cloud } = require("../utils/consts");

const medicoRouter = express.Router();

//função de RETORNAR TODOS os médicos
medicoRouter.get('/medicos', (req, res, next)=>{
    async function AllMedicos(){
        Medicos.find({}, (erro, dados) => {
            if(erro){
                res.status(417).send({ message: "Nenhum registro recebido"});
            }
            res.status(200);
            res.json(dados);
        });
    }

    AllMedicos();
});

//função para RETORNAR UM ÚNICO médico pelo id
medicoRouter.get('/medico/:id', (req, res, next) => {
    async function findMedico(){
        Medicos.findById(req.params.id).then((medico) => {
            res.status(200);
            res.json(medico);
        }).catch((erro) => {
            if(erro){
                res.status(417).send({ message: "Nenhum médico encontrado"});
                throw erro;
            }
        });
    }

    findMedico();
});

//função de INSERIR dados no banco
medicoRouter.post('/medicos',  (req, res, next)=>{


    var date = new Date();
	time_stamp = date.getTime();


	var url_imagem = time_stamp + '_' + req.files.caminho_foto.originalFilename;

	var path_origem = req.files.caminho_foto.path;
    var path_destino = './images/' + url_imagem;

    fs.rename(path_origem, path_destino, function(err){
		if(err){
			res.status(500).json({error: err});
			return;
		} 
        
    async function salvaMedico(){
        const medicos = new Medicos({
            nome: req.body.nome,
            //formacao: req.body.formacao,
            //crm: req.body.crm,
            especialidade: req.body.especialidade,
            cidade: req.body.cidade,
            sexo: req.body.sexo,
            temFoto: req.body.temFoto,
            caminho_foto: url_imagem
            });


        try{
            const result = await medicos.save();
            console.log("Operação realizada com sucesso");
            res.status(201).send({ message: "Cadastrado com sucesso!"});
        } catch(erro){
            console.log(erro.message);
            res.status(406).send({ message: "Cadastro falhou"});
    }
    }

    salvaMedico();
    }); 
});

//rota das imagens
// medicoRouter.get('/imagens/:caminho_foto', (req, res, next)=>{
//     const img = req.params.caminho_foto;

//     fs.readFile('./images/'+img, function(erro, content){
//         if(erro){
//             res.status(400).json(erro);
//             return;
//         }

//         res.writeHead(200, { 'content-type' : 'image/png'});
//         res.end(content);
//     });
// });

//função de DELETAR um médico
medicoRouter.delete('/medico/:id', (req, res, next)=>{

    async function deletarMedico(){
        Medicos.findOneAndDelete(req.params.id).then((medico) => {
            if(medico){
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

    deletarMedico();

});

//função de ATUALIZAR medicos
medicoRouter.put('/medico/:id', (req, res, next)=>{

    async function atualizarMedicos(){
        try{
            Medicos.findByIdAndUpdate(req.params.id, req.body, function(erro) {
                if (erro) {
                    res.send(erro);
                }
                res.status(201).send("Atualizado com sucesso!");
            });
        } catch{
            res.status(417).send("Algo deu errado");
        }

};

atualizarMedicos();
});

//funcao de atualizar foto do medico
medicoRouter.put("/medico_image/:id", (req, res) => {
    cloudinary.config(cloud);
  
    const { id } = req.params;
  
    Medicos.findById(id)
      .then(async (medico) => {
        const { secure_url } = await cloudinary.uploader.upload(
          req.files.caminho_foto.path,
          {
            folder: `images/medicos/${id}/`,
            public_id: id,
            invalidate: true,
            overwrite: true,
            allowed_formats: ["jpg", "png"],
            height: 320,
            width: 640,
            crop: "fit",
          }
        );
        const medicoImg = await Medicos.findByIdAndUpdate(
          { _id: req.params.id },
          { caminho_foto: secure_url.trim() }
        );
  
        return res.status(200).send("Enviado com sucesso");
      })
      .catch((err) => {
        return res.status(404).json(err.message);
      });
  });


module.exports = medicoRouter;
