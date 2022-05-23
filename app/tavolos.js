const express = require('express');
const router = express.Router();
const Tavolo = require('./models/tavolo'); //prendo il modello mongoose



router.post('', async (req, res) => {

	let tavolo = new Tavolo({
        nome: req.body.nome,
        chiamato:false
    });
    
	tavolo = await tavolo.save();
    
    let tavoloId = tavolo.nome;

    console.log('Tavolo salvato');


    res.location("/api/v1/tavolos" + tavoloId).status(201).send();
});


module.exports = router;
