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

/**
 * Chiamata API in POST che dato nel body l'id del tavolo e del piatto e lo stato cambia lo stato del piatto in quello desiderato
 */
router.post('/cambiaStato', async (req, res) =>{
    let idP= req.body.idP; // Recupero dal body l'id del Piatto
    let idT=req.body.idT; // Recupero dal body l'id del Tavolo
    let stato = req.body.stato; // Recupero dal body lo stato in cui cambiare
    let tavolo = await Tavolo.findOne({_id: idT}); // Trovo il tavolo 
    let ordine = await tavolo.ordine; // Trovo l'ordine
    ordine = ordine.map( (piatto) => {
        if(idP.localeCompare(piatto._id) == 0){ // Se l'id del piatto è uguale
            piatto.stato=stato; // Cambio lo stato
        }
    });
    tavolo.save(); // Salvo il tavolo

    res.location("/api/v1/piatti/cambiaStato" + idP).status(201).send();
});

module.exports = router;