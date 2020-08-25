const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClinicaMedicoExameSchema = new Schema({
	clinicaId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'clinicas'
	},
	medico: [{
		medicoId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'medicos'
		}
	}],
	exame_consulta: [{
		exameConsultaId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'exames_consultas'
		}
	}],
},

	{
		timestamps: true
	}

);

module.exports = mongoose.model('clin_exam_med', ClinicaMedicoExameSchema);