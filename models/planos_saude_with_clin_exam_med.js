const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanosSaude_with_ClinicaMedicoExameSchema = new Schema({
   clinicaMedicoExameId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'clin_exam_med'
   },
   planoDeSaudeId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'plano_de_saude'
   },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('planoSaude_ClinMedExame', PlanosSaude_with_ClinicaMedicoExameSchema);

