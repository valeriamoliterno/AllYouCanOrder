var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const piatto= require('./piatto'); 
const Tavolo = require('./tavolo');
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


Ristorante.deleteMany({});
/*
const nuovoTav= new Tavolo({
    nome: 'Tavolo n',
    ordine: {
        nome: 'Nigiri sal',
        foto: '../img/nigirisalmone.png',
        stato: 'in condegna' 
    }
}); 
const nuovoRistorante = new Ristorante({
    tavoli: nuovoTav
});
nuovoTav.save();
nuovoRistorante.save().then(() => console.log(nuovoRistorante + nuovoRistorante.tavoli[0].ordine));
*/
//nuovoTav.save().then(()=> console.log('Ho inserito', nuovoTav.nome)); 

module.exports = Ristorante;