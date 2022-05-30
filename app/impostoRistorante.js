const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model
const Piatto = require('./models/piatto');

router.get('', async (req, res) => {
    let ristorante = await Ristorante.find({});

    ristorante=ristorante.map((ristorante)=>{
            return { // Ritorna l'id e la mail per ogni ristorante
            self: '/api/v1/impostaRistorante/'+ ristorante._id,
            id: ristorante._id,
            mail: ristorante.mail,
        };   }); 
        res.status(200).json(ristorante); 
});
//post che mi serve per modificare l'id del ristorante nella fase di testing
    router.post('', async (req, res) => { 
        ilMioRistoranteID=req.body.id; 
        console.log("Id ristorante post= "+ req.body.id); //prendo l'id dal body (me lo passo in stampaRistoranti.js)
       res.location("/api/v1/impostaRistorante").status(201).send();

    });

module.exports = router;
