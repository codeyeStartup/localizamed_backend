const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nome: {
    type: String,
    required: true,
    maxlength: 50
  }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('plano_de_saude', UserSchema);
