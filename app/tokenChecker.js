const jwt = require('jsonwebtoken'); // usato per creare e controllare token


const tokenChecker = function(req, res, next) {

	// controlla gli header delle funzioni per ottenere il token
	var token = req.headers['x-access-token'];

	// se non è presente un token mandiamo uno stato 401 con messaggio di errore
	if (!token) {
		return res.status(401).send({ 
			successo: false,
			messaggio: 'Non è stato mandato un token'
		});
	} else {
		
		jwt.verify(token, "process.env.CODIFICA", function(err, decoded) {			
			if (err) { // se il token è presente ma errato, mandiamo uno stato 403 con messaggio di errore
				return res.status(403).send({
					successo: false,
					messaggio: 'Token non valido'
				});		
			} else {
				// se il token è presente e corretto, diamo l'autorizzazione all'utente di accedere alle risorse
				req.loggedUser = decoded;
				next();
			}
		});
	}	
};

module.exports = tokenChecker;