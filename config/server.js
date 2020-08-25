require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var mongodb = require("mongodb");
const fs = require("fs");
const multiparty = require("connect-multiparty");

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multiparty());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

//conexão com o banco
mongoose.connect(
  process.env.STR_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("banco conectado");
  }
);

//-->ENDPOINTS
const usuariosRouter = require("../routes/Usuarios");
const clinicaRouter = require("../routes/Clinicas");
const medicoRouter = require("../routes/Medicos");
const exames_consultasRouter = require("../routes/Exames_Consultas");
const planos_de_saudeRouter = require("../routes/Planos_de_saude");
const especialidadesRouter = require("../routes/Especialidades");
const clinMedExamRouter = require("../routes/ClinicasMedicosExames");
const medicoEspecialidadesRouter = require("../routes/MedicosEspecialidades");
const planoSaude_with_ClinMedExameRouter = require("../routes/PlanoSaude_with_ClinMedExam");
const pesquisaRouter = require("../routes/Pesquisa");

app.use(usuariosRouter);
app.use(clinicaRouter);
app.use(medicoRouter);
app.use(exames_consultasRouter);
app.use(planos_de_saudeRouter);
app.use(especialidadesRouter);
app.use(clinMedExamRouter);
app.use(medicoEspecialidadesRouter);
app.use(planoSaude_with_ClinMedExameRouter);
app.use(pesquisaRouter);

module.exports = app;
