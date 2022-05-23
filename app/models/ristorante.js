var mongoose = require('mongoose');
const Piatto = require('./piatto');
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
    ordine: [{
        nome: 'Nigiri sal',
        foto: '../img/nigirisalmone.png',
        stato: 'in consegna' 
    },
    {
        nome: 'Nigiri gam',
        stato: 'in preparazione'
    }]
}); 
const nuovoRistorante = new Ristorante({
    tavoli: nuovoTav
});
nuovoTav.save();
nuovoRistorante.save().then(() => console.log(nuovoRistorante + nuovoRistorante.tavoli[0].ordine));
*/
module.exports = Ristorante;