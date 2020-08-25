const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EspecialidadeSchema = new Schema({
    especialidade: {
    	type: String,
    	required: true,
    	maxlength: 100,
    },
},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('especialidades', EspecialidadeSchema);
