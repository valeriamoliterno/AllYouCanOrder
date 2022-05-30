const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model
const Piatto = require('./models/piatto');

//post che mi serve per modificare l'id del tavolo nella fase di testing
    router.post('', async (req, res) => { 
        ilMioTavoloID=req.body.id;  //prendo l'id dal body (me lo passo in stampaTavoli.js)
       res.location("/api/v1/impostaTavolo").status(201).send();

    });

module.exports = router;
