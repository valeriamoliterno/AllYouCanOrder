var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const piatto= require('./models/piatto.js'); 

module.exports = mongoose.model('Tavolo', new Schema({ 
    idTavolo: Number,
    ordine: [piatto], // dopo aver inviato ordine;  
    chiamato: Boolean,  
    carrello: [piatto], //prima di inviare ordine 
}));
