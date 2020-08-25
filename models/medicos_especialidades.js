const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicosEspecialidadesSchema = new Schema({
    medicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medicos'
    },
    especialidades: [{
        especialidadeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'especialidades'
        }
    }],
});

module.exports = mongoose.model('medicos_especialidades', MedicosEspecialidadesSchema);