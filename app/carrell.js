/**************************************************************************
 * In questo file, gestisco tutto ciò che ha a che fare con carrello.     *
 * In particolare,                                                        *
 *                                                                        *
 * router.get mi serve per mostrare gli elementi                          *
 * attualmente presenti nel mio carrello.                                 *
 *                                                                        *
 * router.post, invece, viene usata per aggiungere gli elementi           *
 * all'interno dell'array carrello: di tavolo.                            *
 *                                                                        *
 * router.delete mi serve per cancellare i piatti dal carrello se un      *
 * cliente non vuole più ordinarli                                        *
 *                                                                        *
 *  NOTA:                                                                 *
 * In questo primo sprint, le cose funzionano solo con il tavolo          *
 * il cui nome è tav1 (abbiamo ovviamente cercato di non inserire         *
 *  altri tavoli con questo stesso nome nel DB). Il mio obiettivo         *
 * per il secondo sprint è cercare in qualche modo di fare funzionare     *
 * il codice per tutti i tavoli                                           *
 * A.                                                                     *
 *                                                                        *
***************************************************************************/


const express = require('express');
const router = express.Router();
const Tavolo = require('./models/tavolo');
const Piatto = require('./models/piatto');


router.get('', async(req,res)=> {  
//per non impicciarmi in questo primo sprint, mostro soltanto le cose di tav1, in un secondo momento probabilmente dovrò fare findById o qualcosa del genere
    let tavolo= await Tavolo.findOne({nome: 'tav1'}).exec();
    tavolo.carrello.forEach(element => {
    return{
        self: '/api/v1/mostraCarrello/',
        carrello: element,
    };    
   });
    res.status(200).json(tavolo);  
})


router.post('', async (req, res) => { //prima era post
    let tavolo= await Tavolo.findOne({nome: 'tav1'}).exec(); ///tav1/i
    //salvo nella variabile piatto gli elementi 
    let piatto = new Piatto({
        nome: req.body.nome,
        prezzo: req.body.prezzo,
        descrizione: req.body.descrizione, 
        foto: req.body.foto,
        stato: '',
    });
    tavolo.carrello.push(piatto); 
    await tavolo.save();
   res.location("/api/v1/mostraCarrello/aggiungiPiatto" + piatto._id).status(201).send();
});


router.delete('', async (req, res) => {
    let tavolo= await Tavolo.findOne({nome: 'tav1'}).exec();    
    tavolo.carrello.pull(req.body.id); 
    await tavolo.save();  
    res.location("/api/v1/mostraCarrello/eliminaPiatto" + req.body.id).status(201).send();
})




module.exports = router;