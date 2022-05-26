const express = require('express');
const router = express.Router();
const Tavolo = require('./models/tavolo'); //prendo il modello mongoose

/**
 * In questo file sono presenti i metodi REST per l'utilizzo delle API 
 */


/**
 * Questo metodo POST inserisce nel database un tavolo
 */
router.post('', async (req, res) => {

	let tavolo = new Tavolo({
        nome: req.body.nome,
        chiamato:false
    });
    
	tavolo = await tavolo.save();
    
    let tavoloId = tavolo.nome;

//Stampa di controllo dopo il salvataggio del tavolo
    console.log('Tavolo salvato');


    res.location("/api/v1/tavolos" + tavoloId).status(201).send();
});


module.exports = router;
