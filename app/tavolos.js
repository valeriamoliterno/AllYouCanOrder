const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model

router.get('/', async (req, res) => {
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID});
    let tavol = await ristorante.tavoli;
    tavol.forEach(tavolo => {
        return {
            self: '/api/v1/tavoli/'+ tavolo.id,
            id: tavolo._id,
            nome: tavolo.nome
        };
    });
   
    res.status(200).json(tavol);
});
module.exports = router;