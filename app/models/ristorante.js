var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const piatto= require('./piatto'); 
const tavolo= require('./tavolo'); 


const ristorante= new Schema({ 
    mail: String, 
    passwordHash: String, 
    tavoli: [tavolo.schema], 
    menu: [piatto.schema], 
    passwordManagerHash: String, 

});


const Ristorante = mongoose.model('Ristorante', ristorante);



ristorante.path('_id'); 
//const nuovoTav= new Tavolo({nome: 'Tavolo 1'}); 
//nuovoTav.save().then(()=> console.log('Ho inserito', nuovoTav.nome)); 

module.exports = Ristorante;