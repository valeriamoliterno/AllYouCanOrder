const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model

router.get('', async (req, res) => {
    let ristorante = await Ristorante.findOne({});
    let tavoli = await ristorante.tavoli;
    tavoli = tavoli.map( (tavolo) => {
        console.log('API get tavoli :');
        console.log(tavolo);
        return {
            id: tavolo._id,
            nome: tavolo.nome
        };
    });
    res.status(200).json(tavoli);
});

module.exports=router;