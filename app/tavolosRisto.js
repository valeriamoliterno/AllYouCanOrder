/**************************************************************************
 * In questo file, gestisco tutto ciò che ha a che fare con tavolo.       *
 * In particolare,                                                        *
 *                                                                        *
 * router.get mi serve per mostrare gli elementi presenti in tavolos nel  *
 *  db, e quindi la uso per mostrare la lista dei tavoli                  *
 *                                                                        *
 *                                                                        *
 * router.post, invece, viene usata per aggiungere gli elementi           *
 * nel database, viene usata nella sezione "manager" per aggiungere       *
 * un tavolo.                                                             *
 *                                                                        *
 * router.delete mi serve per cancellare i tavoli e viene usata anch'essa *
 * per eliminare i tavoli nella sezione manager                           *       
***************************************************************************/

const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model
const Piatto = require('./models/piatto');

/********************************************************************
*  mi serve per fare l'hash della password del manager per poterla  * 
*  confrontare con quella che ho nel db                             *
*********************************************************************/
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


router.get('', async (req, res) => {
    let ristorante = await Ristorante.findOne({mail:loggedUser.mail});
    let tavoli = await ristorante.tavoli;
   await Promise.all(tavoli.map( async (t) => {
        var tavolo = await Tavolo.findOne({_id: t._id});
        return { // Ritorna l'id e il nome per ogni tavolo
            self: '/api/v1/tavoliRisto/'+ tavolo._id,
            id: tavolo._id,
            nome: tavolo.nome,
            chiamato: tavolo.chiamato
        };
    }))
    .then(function(tavol) {
        res.status(200).json(tavol);
    })
});

router.delete('/eliminaTavolo/:id', async (req, res) => {
    const  id  = req.params.id;
    let ristorante = await Ristorante.findOne({mail:loggedUser.mail}).exec(); 
   
    //posso usare il metodo solo se inserisco la password del manager
    if(stringToHash(req.body.managerpwd)!=ristorante.passwordManagerHash)
    {
        //accesso negato
        res.location("/api/v1/tavoliRisto/eliminaTavolo/").status(403).send();
        return;
    }


    let tavolo= await Tavolo.findById(req.params.id).exec(); 
   
    ristorante.tavoli.pull(req.params.id); 
    await Tavolo.deleteOne(tavolo).exec()
    await ristorante.save(); 

    res.location("/api/v1/tavoliRisto/eliminaTavolo/" +id).status(204).send();
});

router.post('', async (req, res) => {
    let ristorante = await Ristorante.findOne({mail:loggedUser.mail});
   
    
    //posso usare il metodo solo se inserisco la password del manager
    if(stringToHash(req.body.managerpwd)!=ristorante.passwordManagerHash)
    {
        //accesso negato
        res.location("/api/v1/tavoliRisto/inserisciTavolo/").status(403).send();
        return;
    }
    

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

 /*************************************************************
 * Questa post serve per settare tavolo.chiamato=false se il cameriere 
 * preme il pulsante "rispondiChiamata"
 * presente nel file scriptC.js
 *************************************************************/ 

router.post('/rispondiChiamata', async (req, res) => {
    console.log('------------- risponsi chiamata -----------');
    console.log('//////////// id Tavolo /////////');
    console.log(req.body.id);
    let tavolo= await Tavolo.findOne({_id: req.body.id}).exec();
    console.log('//////////// Tavolo /////////');
    console.log(tavolo);
    tavolo.chiamato= false; 
    await tavolo.save();
   res.location("/api/v1/tavoliRisto/rispondiChiamata/" ).status(201).send();
});


module.exports = router;
