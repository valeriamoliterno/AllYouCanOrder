/***********************************************************************
 * Questo è lo schema di Piatto.                                       *
 * In un futuro, si potrebbe pensare di aggiungere anche una categoria *
 * per raggruppare il menu                                             *
 **********************************************************************/

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 
 
 
 const piatto= new Schema ({ 
     
     nome: String, 
     prezzo: Number,
     descrizione: String,
     foto: String, //percorso 
     stato: String, 
 });
 
 
 const Piatto = mongoose.model('Piatto', piatto);
 
 module.exports = Piatto; 
 
 
 piatto.path('_id'); 
 /*
 POPOLA PIATTO DA COD
 const inspiatto = new Piatto({ nome: 'Temaki Salmone', prezzo: 0.00, descrizione: 'Cono con salmone e avocado, 1 pezzo  ', foto: 'https://www.kikkosushisalerno.it/images/temaki.png', stato: ''});
 inspiatto.save().then(() => console.log('inserito ', inspiatto.nome));
 */
 
 
 