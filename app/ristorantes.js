const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante'); // get our mongoose model



router.post('', async (req, res) => {
    
	let ristorante = new Ristorante({
        mail: req.body.mail,
        passwordHash: req.body.password,
        passwordManagerHash: req.body.passwordManager
    });

    console.log('------ API POST Ristorante ------');
    console.log(ristorante);
    if (!ristorante.mail || typeof ristorante.mail != 'string' || !validateEmail(ristorante.mail)) {
        console.log('|||||||||| Mail Error |||||||||');
        res.status(400).json({ error: 'The field "mail" must be a non-empty string, in mail format' });
        return;
    }
    
	ristorante = await ristorante.save();
    
    let ristoId = ristorante.id;

    res.location("/api/v1/ristoranti/" + ristoId).status(201).send();
});


function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }


module.exports = router;