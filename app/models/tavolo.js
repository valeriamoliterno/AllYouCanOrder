var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Piatto= require('./piatto'); 

const tavolo= new Schema({ 
    nome: String, 
    ordine: [Piatto.schema],// dopo aver inviato ordine;  
    chiamato: Boolean,  
    carrello: [Piatto.schema], //prima di inviare ordine 

});


const Tavolo = mongoose.model('Tavolo', tavolo);



tavolo.path('_id'); 

/*
const nuovoTav= new Tavolo({nome: 'Tavolo 1'}); 
nuovoTav.save().then(()=> console.log('Ho inserito', nuovoTav.nome)); */

module.exports = Tavolo;

