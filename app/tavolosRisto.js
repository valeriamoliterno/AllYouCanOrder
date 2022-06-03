const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model


router.get('', async (req, res) => {
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID});
    let tavoli = await ristorante.tavoli;
   await Promise.all(tavoli.map( async (t) => {
        var tavolo = await Tavolo.findOne({_id: t._id});
        return { // Ritorna l'id e il nome per ogni tavolo
            self: '/api/v1/tavoliRisto/'+ tavolo._id,
            id: tavolo._id,
            nome: tavolo.nome
        };
    }))
    .then(function(tavol) {
        res.status(200).json(tavol);
    })
});

router.delete('/eliminaTavolo', async (req, res) => {
    const  id  = req.body.id;
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
    let tavolo= await Tavolo.findById(req.body.id).exec(); 
   
    ristorante.tavoli.pull(req.body.id); 
    await Tavolo.deleteOne(tavolo).exec()
    await ristorante.save(); 

    res.location("/api/v1/tavoliRisto/eliminaTavolo/" + id).status(204).send();
});

router.post('/inserisciTavolo', async (req, res) => {
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID});
  let tavolo = new Tavolo({
        nome: req.body.nome,
        chiamato:false
    });
    
  tavolo = await tavolo.save();
    ristorante.tavoli.push(tavolo);
    await ristorante.save(); 
    let tavoloId = tavolo.nome;
    console.log('Tavolo salvato');
    res.location("/api/v1/tavoliRisto/" + tavoloId).status(201).send();
});




module.exports = router;