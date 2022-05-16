var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Piatto', new Schema({ 
    idPiatto: Number,
    nome: String,  
    prezzo: Number,
    descrizione: String, 
    foto: String, //percorso  
    stato: String,   
}));