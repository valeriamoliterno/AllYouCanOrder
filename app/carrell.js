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
const Ristorante = require ('./models/ristorante'); 

/********************************************************************
 * NOTA PER CHI VEDE IL CODICE: 
 * 
 * Ho inserito una variabile locale chiamata ilMioTavolo all'interno della quale
 * ho salvato il tavolo di cui voglio vedere il menu ecc!
 */
router.get('', async(req,res)=> {  

   console.log("Sono in carrel. Nome tavolo = "+ilMioTavolo); 
    let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();
    tavolo.carrello.forEach(element => {
    return{
        self: '/api/v1/mostraCarrello/',
        carrello: element,
    };    
   });
    res.status(200).json(tavolo);  
})


router.post('', async (req, res) => { //prima era post
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
    let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec(); ///tav1/i
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
    await ristorante.save(); 
   res.location("/api/v1/mostraCarrello/aggiungiPiatto" + piatto._id).status(201).send();
});


router.delete('', async (req, res) => {
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
    let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();    
    tavolo.carrello.pull(req.body.id); 
    await tavolo.save();  
    await ristorante.save(); 
    res.location("/api/v1/mostraCarrello/eliminaPiatto" + req.body.id).status(201).send();
})




module.exports = router;

