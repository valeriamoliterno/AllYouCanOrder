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
const nuovoTav= new Tavolo({nome: 'Tavolo 1', carrello:[{

    nome: 'Nigiri Salmone', 
    prezzo: 0.00,
    descrizione: 'Descrizone nigiri salmone',
    foto: 'https://infra-recipesepi-prod-cdn.azureedge.net/497ea6/contentassets/6addcd66a67940ffb7677961e40e103b/full_nigiri-sushi-con-salmone-norvegese.jpg?width=1112&height=1112&transform=DownFill&hash=fb8782debfc3100536e9c3709732d582', //percorso 
    stato: '', 
},
{
    nome: 'Temaki Tonno', 
    prezzo: 0.00,
    descrizione: 'desc tonno temaki',
    foto: 'https://www.shinto.it/wp-content/uploads/2017/02/handrolls-tonno-temaki.jpg', //percorso 
    stato: '', 

}]} ); 
nuovoTav.save().then(()=> console.log('Ho inserito', nuovoTav.nome));
 
*/
module.exports = Tavolo;

