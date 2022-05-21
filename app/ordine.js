/**************************************************************************
 * In questo file, gestisco tutto ciò che ha a che fare con ordine,       *
 * In particolare,                                                        *
 *                                                                        *
 * router.get mi serve per mostrare gli elementi                          *
 * attualmente presenti nel mio ordine                                    *
 *                                                                        *
 * router.post, invece, viene usata per spostare gli elementi da          *
 * carrello a ordine                                                      *
 *                                                                        *
 *                                                                        *
 *                                                                        *
***************************************************************************/


const express = require('express');
const router = express.Router();
const Tavolo = require('./models/tavolo');
const Piatto = require('./models/piatto');


router.get('', async(req,res)=> {  
//per non impicciarmi in questo primo sprint, mostro soltanto le cose di tav1, in un secondo momento probabilmente dovrò fare findById o qualcosa del genere
    let tavolo= await Tavolo.findOne({nome: /tav1/i}).exec();
    tavolo.ordine.forEach(element => {
    return{
        self: '/api/v1/mostraOrdine'+ element._id, //aggiunto + element.id
        ordine: element,
    };    
   });
    res.status(200).json(tavolo);  
})

router.post('', async (req, res) => {
    let tavolo= await Tavolo.findOne({nome: /tav1/i}).exec();
    //salvo nella variabile piatto gli elementi 
    let piatto = new Piatto({
        nome: req.body.nome,
        prezzo: req.body.prezzo,
        descrizione: req.body.descrizione, 
        foto: req.body.foto,    
        stato: 'in preparazione'
    });
    tavolo.ordine.push(piatto); 
    await tavolo.save();
    res.location("/api/v1/mostraOrdine/" + piatto._id).status(201).send();
});


module.exports = router;