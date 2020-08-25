const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nome: {
    type: String,
    required: true,
    maxlength: 50
  },
  razao_social: {
    type: String,
    //required: true,
    maxlength: 80
  },
  email: {
    type: String,
    required: true,
    maxlength: 80
  },
  site: {
    type: String,
    required: true,
    maxlength: 50
  },
  /* senha:{
    type: String,
    required: true,
    maxlength: 100
  }, */
  cnpj: {
    type: String,
    //required: true,
    maxlength: 14
  },
  latitude: {
    type: Number,
    required: true
    //revisa essa merda
  },
  longitude: {
    type: Number,
    required: true
    //essa aqui tambem
  },
  descricao: {
    type: String,
    //required: true,
    maxlength: 300
  },
  cidade: {
    type: String,
    required: true,
    maxlength: 50
  },
  bairro: {
    type: String,
    required: true,
    maxlength: 50
  },
  uf: {
    type: String,
    required: true,
    maxlength: 2
  },
  fone_1: {
    type: String,
    required: true,
    maxlength: 15
  },
  fone_2: {
    type: String,
    maxlength: 15
  },
  caminho_foto: {
    type: String,
    //required: true,
    maxlength: 100
  },
  medico: [{
    medicoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medicos'
    }
  }],
  exame_consulta: [{
    exame_consulta_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'exames_consultas'
    }
  }],
},
  //timestamps fornece a data de cadastro e atualização
  {
    timestamps: true
  }
);

module.exports = mongoose.model('clinicas', UserSchema);

