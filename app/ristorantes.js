const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante'); // get our mongoose model



router.post('', async (req, res) => {
    
	let ristorante = new Ristorante({
        mail: req.body.mail,
        passwordHash: stringToHash(req.body.password),
        passwordManagerHash: stringToHash(req.body.passwordManager),
        tavoli: []
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

function stringToHash(string) {
                  
    var hash = 0;
      
    if (string.length == 0) return hash;
      
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
      
    return hash;
}
module.exports = router;