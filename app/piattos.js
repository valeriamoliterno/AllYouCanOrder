const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo');
const Piatto = require('./models/piatto');

router.get('/ordineTavolo', async (req, res) => {
    let idT = await Tavolo.findById(req.params.id);
    let tavolo = await Tavolo.findOne({_id: idT});
    let ordine = await tavolo.ordine;
    ordine = ordine.map( (piatto) => {
        return {
            id: piatto._id,
            nome: piatto.nome,
            foto: piatto.foto,
            stato: piatto.stato
        };
    });
    res.status(200).json(tavoli);
});