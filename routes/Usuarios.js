const express = require("express");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuarios = require("../models/usuarios");
const { cloud } = require("../utils/consts");
const verifyJWT = require("../utils/verifyJWT");
const usuarioRouter = express.Router();

//Rota para enviar EMAIL DE RECUPERAÇÃO DE SENHA
usuarioRouter.post("/send_mail", async (req, res, next) => {
  try {
    const user = await Usuarios.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(400).send({ message: "Email inválido/inexistente" });
    }
    const url = `http://${process.env.IP_ADDRESS}update_pass_get/?email=${req.body.email}`;

    nodeoutlook.sendEmail({
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Recuperação de senha",

      html: `<html>

      <body style="
                      align-content: center;
                      font-family: 'Arial';
                      ">
          <div class="container" style="  
                          background-color: white;
                          padding: 20;
                          text-align: center;
                          font-size: 0.9em;
                          text-decoration-color: black;
                          ">
              <h3>Este é um e-mail de recuperação de senha</h3>
              <p>Clique no botão para recuperar sua conta</p>
              <a href="${url}"><button style="
                              background-color: #1B49F3;
                              color: white;
                              border: none;
                              font-size: 1.07em;
                              font-weight: bold;
                              border-radius: 0.4em;
                              margin-bottom: 20;
                              width: 180px;
                              height: 50px;">
                      Atualizar Senha
                  </button></a>
          </div>
      </body>
      
      </html>`,
      onError: (e) => res.status(401).send(e.message),
      onSuccess: (i) => res.status(201).send({ message: "Enviado" }),
    });
    // transporter.sendMail(mailOptions, (erro, info) => {
    //   if (erro) console.log(erro);
    //   console.log(info);
    //   return res.status(201).send({ message: "Enviado" });
    // });
  } catch (error) {
    res.status(500);
  }
});

//rota de atualizar a senha
usuarioRouter.put("/update_pass/:email", async (req, res, next) => {
  try {
    Usuarios.findOneAndUpdate(
      { email: req.params.email },
      { senha: bcrypt.hashSync(req.body.senha.trim(), 10) },
      (erro) => {
        if (erro) {
          res.status(417).send({ message: "Falha ao atualizar" });
          throw erro;
        }
        console.log("fui atualizado");
        res.status(201).send("Atualizado com sucesso!");
      }
    );
  } catch {
    res.status(417).send("Entrei no catch de erro");
  }
});

usuarioRouter.get("/update_pass_get", async (req, res, next) => {
  return res.sendFile(path.join(__dirname + "/../public/index.html"));
});

usuarioRouter.post("/update_pass_get/update", async (req, res, next) => {
  return res.sendFile(
    path.join(__dirname + "/../public/update_pass_confirm.html")
  );
});

//Rota de RETORNAR TODOS os usuários
usuarioRouter.get("/usuarios", verifyJWT, (req, res, next) => {
  async function AllUsuarios() {
    Usuarios.find({}, (erro, dados) => {
      if (erro) {
        res.status(417).send({ message: "Nenhum registro recebido" });
      }
      res.status(200);
      res.json(dados);
    });
  }

  AllUsuarios();
});

//Rota para RETORNAR UM ÚNICO USUÁRIO PELO ID
usuarioRouter.get("/usuario/:id", verifyJWT, (req, res, next) => {
  async function findUsuario() {
    Usuarios.findById(req.params.id)
      .then((usuario) => {
        res.status(200);
        res.json(usuario);
      })
      .catch((erro) => {
        if (erro) {
          res.status(417).send({ message: "Nenhum usuário encontrado" });
          throw erro;
        }
      });
  }

  findUsuario();
});

//Rota para RETORNAR USUÁRIO PELO RANGE
usuarioRouter.get("/usuarioFindOne/:email", verifyJWT, (req, res, next) => {
  async function GetUser() {
    Usuarios.findOne({ email: req.params.email })
      .then((usuario) => {
        res.status(200);
        res.json(usuario);
      })
      .catch((erro) => {
        if (erro) {
          res.status(417).send({ message: "Nenhum usuário encontrado" });
          throw erro;
        }
      });
  }
  GetUser();
});

//rotas das imagens
/* usuarioRouter.get('/imagensUsuario/:caminho_foto', (req, res, next) => {
    const img = req.params.caminho_foto;

    fs.readFile('./images/' + img, function (erro, content) {
        if (erro) {
            res.status(400).json(erro);
            return;
        }

        res.writeHead(200, { 'content-type': 'image/png' });
        res.end(content);
    });
}); */

//Rota para ATUALIZAR FOTO DE PERFIL do usuario
usuarioRouter.patch("/usuario_image/:id", verifyJWT, async (req, res, next) => {
  cloudinary.config(cloud);

  async function AtualizarFotoUsuario() {
    try {
      const { id } = req.params;

      const { url, secure_url } = await cloudinary.uploader.upload(
        req.files.caminho_foto.path,
        {
          folder: `images/users/${id}/`,
          public_id: id,
          invalidate: true,
          overwrite: true,
          allowed_formats: ["jpg", "png"],
          height: 320,
          width: 640,
          crop: "fit",
        }
      );
      const usuarioImg = await Usuarios.findByIdAndUpdate(
        { _id: req.params.id },
        { caminho_foto: secure_url.trim() }
      );

      if (usuarioImg.errors) {
        return res.status(400).json(usuarioImg);
      }
      return res.status(200).send("Enviado com sucesso");
    } catch (error) {
      res.status(500).json(error);
      return console.log(error);
    }
  }

  return AtualizarFotoUsuario();
});

//Rota de INSERIR dados no banco
usuarioRouter.post("/usuarios", async (req, res, next) => {
  try {
    const {
      nome,
      email = "",
      senha = "",
      data_nascimento,
      logradouro,
      bairro,
      cidade,
      uf,
      fone_1,
    } = req.body;
    const usuarios = new Usuarios({
      nome,
      email: email.trim(),
      data_nascimento,
      senha: bcrypt.hashSync(senha.trim(), 10),
      logradouro,
      bairro,
      cidade,
      uf,
      fone_1,
      // fone_2,
      // cpf,
      // rg,
    });

    const userData = await usuarios.save();
    const { _id } = userData;
    const token = jwt.sign({ _id }, process.env.JWT_PASS, {
      expiresIn: "365 days",
    });
    const refreshToken = jwt.sign({ _id }, process.env.JWT_PASS, {
      expiresIn: "365 days",
    });

    res.status(201).json({
      message: "Cadastrado com sucesso!",
      token,
      refreshToken,
      userData: { _id, email },
    });
  } catch (erro) {
    res.status(400).send({ message: erro.message });
  }
});

//Rota de LOGIN
usuarioRouter.post("/login", (req, res, next) => {
  async function Login() {
    try {
      const user = await Usuarios.findOne({ email: req.body.email }).exec();
      if (!user) {
        return res.status(400).send({ message: "Email inválido/inexistente" });
      }
      console.log(bcrypt.compareSync(req.body.senha, user.senha));
      if (!bcrypt.compareSync(req.body.senha, user.senha)) {
        return res.status(400).send({ message: "Senha Incorreta" });
      }

      const { _id, email } = user;
      const token = jwt.sign({ _id }, process.env.JWT_PASS, {
        expiresIn: "365 days",
      });
      const refreshToken = jwt.sign({ _id }, process.env.JWT_PASS, {
        expiresIn: "365 days",
      });

      return res
        .status(201)
        .json({ token, refreshToken, userData: { _id, email } });
    } catch (erro) {
      res.status(416).send({ message: "Algo de errado aconteceu" });
    }
  }
  Login();
});

//Rota de DELETAR um usuário
usuarioRouter.delete("/usuario/:id", verifyJWT, (req, res, next) => {
  async function deletarUsuario() {
    Usuarios.findByIdAndDelete(req.params.id)
      .then((usuario) => {
        if (usuario) {
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

  deletarUsuario();
});

//Rota de UPDATE do usuario
usuarioRouter.put("/usuarioUpdate/:email", verifyJWT, (req, res, next) => {
  async function atualizarUsuario() {
    try {
      Usuarios.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        function (erro) {
          if (erro) {
            res.status(417).send({ message: "Falha ao atualizar" });
            throw erro;
          }
          console.log(req.body);
          res.status(201).send("Atualizado com sucesso!");
        }
      );
    } catch {
      res.status(417).send("Entrei no catch de erro");
    }
  }

  atualizarUsuario();
});

//Rota de login google
usuarioRouter.post("/auth_google", async (req, res) => {
  try {
    const { profileObj: { email, name, googleId, imageUrl } = {} } = req.body;

    const user = await Usuarios.findOne({ email });

    let loginUser = {};

    if (!user) {
      loginUser = await Usuarios({
        nome: name,
        email,
        senha: bcrypt.hashSync(googleId.trim(), 10),
      }).save();
    } else {
      loginUser = await Usuarios.findOneAndUpdate({ email }, { nome: name, caminho_foto: imageUrl  });
    }
    const { _id } = loginUser;

    const token = jwt.sign({ _id }, process.env.JWT_PASS, {
      expiresIn: "365 days",
    });
    
    return res.status(201).json({ token, userData: { _id, email } });
  } catch (erro) {
    res.status(401).send({ message: erro });
  }
}); 

module.exports = usuarioRouter;
