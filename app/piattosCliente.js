/**************************************************************************
 * In questo file, gestisco tutto ciò che ha a che fare con piatto nella  *
 * sezione clienti.                                                       *
 * In particolare,                                                        *
 *                                                                        *
 * router.get mi serve per mostrare gli elementi                          *
 * presenti in piattos nel db, e quindi la uso per mostrare il menu       *
***************************************************************************/


const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante'); // prendo il modello mongoose. 
const Piatto = require('./models/piatto');
const Tavolo = require('./models/tavolo');

/**
 * Questo metodo GET richiama l'elenco di tutti i piatti 
 * presenti nell'array menu nella sezione ristorante. 
 */
router.get('', async(req,res)=> {
    let ristorantes = await Ristorante.findOne({ _id: ilMioRistoranteID}); 
    let menu = await ristorantes.menu; 
    menu.forEach(piatto => {
        return{
            self: '/api/v1/piattosCliente/'+ piatto.id,
            nome: piatto.nome, 
            prezzo: piatto.prezzo,
            descrizione: piatto.descrizione,
            foto: piatto.foto,
            stato: piatto.stato,
        };
    }); 
    res.status(200).json(menu);  
})


module.exports = router;