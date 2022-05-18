const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model

router.get('/', async (req, res) => {
    let ristorante = await Ristorante.findOne({});
    let tavoli = await ristorante.tavoli;
    tavoli = tavoli.map( (tavolo) => {
        return {
            id: tavolo._id,
            title: tavolo.nome
        };
    });
    res.status(200).json(tavoli);
});