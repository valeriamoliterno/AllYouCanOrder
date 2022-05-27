const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model

/**
 * Chiamata API in GET che restituisce la lista dei tavoli del ristorante mostrando id e nome per ogni tavolo
 */
router.get('', async (req, res) => {
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID});
    let tavoli = await ristorante.tavoli;
   await Promise.all(tavoli.map( async (t) => {
        var tavolo = await Tavolo.findOne({_id: t._id});
        return { // Ritorna l'id e il nome per ogni tavolo
            self: '/api/v1/tavoli/'+ tavolo._id,
            id: tavolo._id,
            nome: tavolo.nome
        };
    }))
    .then(function(tavol) {
        res.status(200).json(tavol);
    })
});



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
