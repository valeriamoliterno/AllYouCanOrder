var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Piatto', new Schema({ 
	stato: String,   
    nome: String,  
    foto: String, //percorso  
    descrizione: String, 
}));