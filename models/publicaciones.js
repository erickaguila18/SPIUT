// Esquema de base


var mongoose = require('mongoose');

module.exports = mongoose.model('Publicaciones',{
	id: String,
	contenido: { type: String, require: true },
	usuario: { type: String, require: true },
	area: { type: String, require: true }, 
	fecha: {
        type: Date,
        default: Date.now
    }
});
