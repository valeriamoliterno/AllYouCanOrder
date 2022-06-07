const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const jwt = require('jsonwebtoken');


/**
 * Questa funzione serve per ottenere i dati relativi all'utente loggato,
 * tra cui il token. Il token verrà poi utilizzato per garantire accesso alle risorse protette.
 * I dati sono presi dalla variabile globale loggedUser dichiarata in app.js
 */
router.get('', async(req,res)=> { 
	console.log('get Token: '+ loggedUser.token)
	console.log("*************************************"+loggedUser.self)
	console.log("*************************************"+loggedUser.id)
    res.status(200).json({
		self: '/api/v1/token/',
		token: loggedUser.token,
		ristoMail: loggedUser.mail,
		ristoId: loggedUser.id,
		ristoSelf: loggedUser.self,
	});  
})


/**
 * Questa funzione serve per generare un token nel caso in cui le credenziali passatele siano corrette,
 * opppure mandare un messaggio di errore nel caso non lo siano
 */
router.post('', async function(req, res) {
	
	// cerca il ristorante con la mail passata dall'utente
	let ristorante = await Ristorante.findOne({
		mail: req.body.mail
	}).exec();
	//stampa di controllo
	//console.log("Ristorante: " + ristorante)

	// caso in cui il ristorante non esiste nel database
	if (ristorante===null) {
		res.status(404).json({ successo: false, messaggio: "L'email che hai inserito non è corretta" }); //404 perchè il ristorane cercato non esiste
	} else { //caso in cui la mail inserita è presente nel database

		//controllo che la password sia corretta
		if (ristorante.passwordHash != req.body.password) { //se la password è errata, manda un messaggio di errore

		//200 nonostante il fallimento del login perchè la richiesta è andata a buon fine anche se le credenziali erano errate
		res.status(200).json({ successo: false, messaggio: 'La password che hai inserito non è corretta' }); 
		} else { //se la password è corretta  genera un token
			var payload = {
			mail: ristorante.mail,
			id: ristorante._id
			}
			var options = {
			expiresIn: 86400 // scade dopo 24 ore
			}
			var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

			//salvo nella variabile locale logggedUser i dati associati al ristorante
			loggedUser.mail= ristorante.mail;
			loggedUser.token = token;
			loggedUser.id = ristorante._id;
        	loggedUser.self = "api/v1/auth/" + ristorante._id

			//stampe di controllo del token
			console.log('Dalla post auth: '+token)
			console.log(ristorante._id);
			res.location('/api/v1/auth/' + ristorante._id).status(201).json({
				successo: true,
				messaggio: 'Log in effettuato con successo!',
				self: "api/v1/auth" + ristorante._id
			});
		}
	}	
});


module.exports = router;