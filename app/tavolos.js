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
