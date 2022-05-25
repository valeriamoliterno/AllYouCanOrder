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

module.exports = Ristorante;