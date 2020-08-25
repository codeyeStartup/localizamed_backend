const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nome:{
        type: String,
        //required: true,
        maxlength: 80
    },
    email:{
        type: String,
        //required: true,
        maxlength: 80,
        unique: true
    },
    senha:{
        type: String,
        //required: true,
        maxlength: 100
    },
    cidade:{
        type: String,
        //required: true,
        maxlength: 100
    },
    logradouro:{
        type: String,
        //required: true,
        maxlength: 50
    },
    bairro:{
        type: String,
        //required: true,
        maxlength: 50
    },
    uf:{
        type: String,
        //required: true,
        maxlength: 2
    },
    fone_1:{
        type: String,
        //required: true,
        maxlength: 16
    },
    fone_2:{
        type: String,
        maxlength: 16
    },
    cpf:{
        type: String,
        maxlength: 20
    },
    rg:{
        type: String,
        maxlength: 20
    },
    caminho_foto:{
        type: String,
        maxlength: 100
    },
    data_nascimento:{
        type: Date,
        //required: true        
    }, 
     
},
    //timestamps fornece a data de cadastro e atualização
    {
        timestamps: true
    }
);

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('usuarios', UserSchema);
