const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo');
const Piatto = require('./models/piatto');
/**
 * Chiamata API in GET che dato nei parametri l'id di un tavolo restituisce la lista dei piatti nell'ordine del tavolo
 */
router.get('/ordineTavolo/:id', async (req, res) => {
    let idT = req.params.id; 
    let tavolo = await Tavolo.findOne({_id: idT}); // Trovo il tavolo 
    let ordine = await tavolo.ordine; // Trovo l'ordine
    ordine = ordine.map( (piatto) => {
        return { // Restituisco l'id, il nome, la foto, e lo stato di ogni piatto
            id: piatto._id,
            nome: piatto.nome,
            foto: piatto.foto,
            stato: piatto.stato
        };
    });
    res.status(200).json(ordine); // trasforma in json
});

module.exports = router;