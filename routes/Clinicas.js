const express = require("express");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const Clinicas = require("../models/clinicas");
const { cloud } = require("../utils/consts");
const verifyJWT = require("../utils/verifyJWT");

const clinicasRouter = express.Router();

//função de RETORNAR TODAS as CLÍNICAS
clinicasRouter.get("/clinicas", verifyJWT, (req, res, next) => {
  async function AllClinicas() {
    Clinicas.find({}, (erro, dados) => {
      if (erro) {
        res.status(417).send({ message: "Nenhum registro recebido" });
      }
      res.status(200);
      res.json(dados);
    });
  }

  AllClinicas();
});

// query de medicos por clinicas
clinicasRouter.post("/search_medico_clinica", verifyJWT, (req, res, next) => {
  async function AllClinicas() {
    console.log(req.body)
    Clinicas.find(
      { "medico.medicoId": { _id: req.body.search } },
      (erro, dados) => {
        if (erro) {
          res.status(417).send({ message: "Nenhum registro recebido" });
        }
        res.status(200);
        res.json(dados);
      }
    ).select('nome _id');
  }

  AllClinicas();
});

//funcao que retorna tres ultimas clinicas
clinicasRouter.get("/clinicaLastThree", verifyJWT, async (req, res, next) => {
  try {
    const clinicas = await Clinicas.find().sort({ _id: -1 }).limit(3);

    return res.send({ clinicas });
  } catch (erro) {
    return res.status(417).send({ erro: "Erro ao carregar clinicas" });
  }
});

//função para RETORNAR UMA ÚNICA CLÍNICA
clinicasRouter.get("/clinica/:id", verifyJWT, (req, res, next) => {
  async function findClinicas() {
    Clinicas.findById(req.params.id)
      .populate("medico.medicoId")
      .populate("exame_consulta.exame_consulta_id")
      .then((clinicas) => {
        res.status(200);
        res.json(clinicas);
      })
      .catch((erro) => {
        if (erro) {
          res.status(417).send({ message: "Nenhuma clinica encontrada" });
          throw erro;
        }
      });
  }

  findClinicas();
});

//Eu quero queijo
clinicasRouter.get("/clinicasAll", verifyJWT, (req, res, next) => {
  async function AllClinicas() {
    Clinicas.find({}, (erro, dados) => {
      if (erro) {
        res.status(417).send({ message: "Nenhum registro recebido" });
      }
      res.status(200);
      res.json(dados);
    })
      .populate("medico.medicoId")
      .populate("exame_consulta.exame_consulta_id");
  }

  AllClinicas();
});

//função de INSERIR dados no banco
clinicasRouter.post("/clinicas", verifyJWT, (req, res, next) => {
  const date = new Date();
  time_stamp = date.getTime();

  const url_imagem = time_stamp + "_" + req.files.caminho_foto.originalFilename;

  const path_origem = req.files.caminho_foto.path;
  const path_destino = "./images/clinicas_img/" + url_imagem;

  fs.rename(path_origem, path_destino, function (err) {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }

    async function salvaClinicas() {
      const clinicas = new Clinicas({
        nome: req.body.nome,
        email: req.body.email,
        razao_social: req.body.razao_social,
        site: req.body.site,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        cidade: req.body.cidade,
        bairro: req.body.bairro,
        uf: req.body.uf,
        fone_1: req.body.fone_1,
        fone_2: req.body.fone_2,
        cnpj: req.body.cnpj,
        descricao: req.body.descricao,
        // caminho_foto: url_imagem,
      });

      try {
        const result = await clinicas.save();
        console.log("Operação realizada com sucesso");
        res.status(201).send({ message: "Cadastrado com sucesso!" });
      } catch (erro) {
        console.log(erro.message);
        res.status(406).send({ message: "Cadastro falhou" });
      }
    }

    salvaClinicas();
  });
});

//funcao de atualizar imagem da clinica
clinicasRouter.put("/clinica_image/:id", verifyJWT, (req, res) => {
  cloudinary.config(cloud);

  const { id } = req.params;

  Clinicas.findById(id)
    .then(async (clinica) => {
      const { secure_url } = await cloudinary.uploader.upload(
        req.files.caminho_foto.path,
        {
          folder: `images/clinicas/${id}/`,
          public_id: id,
          invalidate: true,
          overwrite: true,
          allowed_formats: ["jpg", "png"],
          height: 320,
          width: 640,
          crop: "fit",
        }
      );
      const clinicaImg = await Clinicas.findByIdAndUpdate(
        { _id: req.params.id },
        { caminho_foto: secure_url.trim() }
      );

      return res.status(200).send("Enviado com sucesso");
    })
    .catch((err) => {
      return res.status(404).json(err.message);
    });
});

//TODO função de LOGIN
clinicasRouter.post("/loginClinica", (req, res, next) => {
  async function Login() {
    try {
      var user = await Clinicas.findOne({ email: req.body.email }).exec();
      if (!user) {
        return res.status(400).send({ message: "Email inválido/inexistente" });
      }
      if (!bcrypt.compareSync(req.body.senha, user.senha)) {
        return res.status(400).send({ message: "Senha Incorreta" });
      }

      //tudo ok
      return res.status(201).send({ message: "Logado com sucesso!" });
    } catch (erro) {
      res.status(416).send({ message: "Algo de errado aconteceu" });
    }
  }
  Login();
});

//função de DELETAR uma CLÍNICA
clinicasRouter.delete("/clinicas/:id", verifyJWT, (req, res, next) => {
  async function deletarClinicas() {
    Clinicas.findByIdAndDelete(req.params.id)
      .then((clinicas) => {
        if (clinicas) {
          res.status(200).send({ message: "Deletado com sucesso" });
        } else {
          res.status(404).send({ message: "Registro não encontrado" });
        }
      })
      .catch((erro) => {
        if (erro) {
          res.status(417).send({ message: "Falha ao deletar registro" });
          throw erro;
        }
      });
  }

  deletarClinicas();
});

//função de ATUALIZAR clinicas
clinicasRouter.put("/clinicas/:id", verifyJWT, (req, res, next) => {
  async function atualizarClinicas() {
    try {
      Clinicas.findByIdAndUpdate(req.params.id, req.body, function (erro) {
        if (erro) {
          res.send(erro);
        }
        res.status(201).send("Atualizado com sucesso!");
      });
    } catch {
      res.status(417).send("Algo deu errado");
    }
  }

  atualizarClinicas();
});

module.exports = clinicasRouter;
