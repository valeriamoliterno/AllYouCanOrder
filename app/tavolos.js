const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model

/**
 * Chiamata API in GET che restituisce la lista dei tavoli del ristorante mostrando id e nome per ogni tavolo
 */
router.get('', async (req, res) => {
    let ristorante = await Ristorante.findOne({}); // momentaneamente trova un ristorante a caso finche non verrà effettuato il login
    let tavoli = await ristorante.tavoli; // trova la lista dei tavoli del ristiorante 
    tavoli = tavoli.map( (tavolo) => {
        console.log('API get tavoli :');
        console.log(tavolo);
        return { // Ritorna l'id e il nome per ogni tavolo
            id: tavolo._id,
            nome: tavolo.nome
        };
    });
    res.status(200).json(tavoli); // trasforma in json
});

module.exports=router;