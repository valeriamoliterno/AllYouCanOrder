const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante'); // get our mongoose model



router.post('', async (req, res) => {
    var mail= req.body.mail;
    var password =req.body.password;
    var passwordManager = req.body.passwordManager;
    let ristoranteEsistente= await Ristorante.findOne({mail : mail});
    console.log(ristoranteEsistente + '1234567890123456789012345678901234567890');
    if(!ristoranteEsistente){

        if (mail==='') {
            console.log('|||||||||| Mail Error |||||||||');
            res.status(400).json({ error: 'Il campo mail non può essere vuoto' });
            return;
        }
        if (!validateEmail(mail)) {
            console.log('|||||||||| Mail Error |||||||||');
            res.status(400).json({ error: 'La mail non ha un formato valido. Inserirla del tipo a@b.c' });
            return;
        }
        if (password==='') {
            console.log('|||||||||| Password Error |||||||||');
            res.status(400).json({ error: 'La password non può essere vuota' });
            return;
        }
        if (passwordManager === '') {
            console.log('|||||||||| Password manager Error |||||||||');
            res.status(400).json({ error: 'La password manager non può essere vuota' });
            return;
        }

        let ristorante = new Ristorante({
            mail: mail,
            passwordHash: stringToHash(password),
            passwordManagerHash: stringToHash(passwordManager),
            tavoli: []
        });

        console.log('------ API POST Ristorante ------');
        console.log(ristorante);
	    ristorante = await ristorante.save();
    
        let ristoId = ristorante.id;

        res.location("/api/v1/ristoranti/" + ristoId).status(201).send();
    } else {
        console.log('|||||||||| Risto esiste |||||||||');
        res.status(400).json({ error: 'Esiste già un ristorante con questa mail' });
    }
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