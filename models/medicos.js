const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicoSchema = new Schema({
  //cod_medico:{type:Integer},
  nome:{
    type: String,
    required: true,
    maxlength: 80  
  },
  formacao:{
    type: String, 
    //required: true,
    maxlength: 200
  },
  crm:{
    type: String, 
    //required: true,
    maxlength: 10
  },
  caminho_foto:{
    type: String,
    //required: true,
    maxlength: 100
  },
  cidade:{
    type: String,
    maxlength: 100
  },
  sexo:{
    type: String,
    maxlength: 1,
    required: true,
  },
  temFoto:{
    type: String, 
    maxlength: 1
  },
  especialidade:{
    type: String,
    maxlength: 50
  },
},
    //timestamps fornece a data de cadastro e atualização
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('medicos', MedicoSchema);
