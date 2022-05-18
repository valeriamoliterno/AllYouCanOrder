const express = require('express');

const router = express.Router();
const Piatto = require('./models/piatto'); // prendo il modello mongoose. 

router.post('', async (req, res) => {

	let piatto = new Piatto({
        nome: req.body.nome,
        idPiatto: req.body.idPiatto, 
        prezzo: req.body.prezzo,
        descrizione: req.body.descrizione, 
        foto: req.body.foto, //percorso  
        stato: '',
    });
    
	piatto = await piatto.save();

    console.log('Piatto Salvato');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/piattos/" + req.body.idPiatto).status(201).send();
});


module.exports = router;