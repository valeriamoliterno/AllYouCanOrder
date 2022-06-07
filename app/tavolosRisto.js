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




/*************************************************************
 * Questa get serve per mostrare tutti gli elementi nell'array
 * ristorante.tavoli e viene chiamata in scriprC.js
 *************************************************************/
router.get('', async (req, res) => {
    let ristorante = await Ristorante.findOne({mail:loggedUser.mail});
    //Controllo che esista il ristorante
    if(!ristorante){
        res.status(404).json(ristorante);  
        console.log("ristorante non trovato"); 
        return; 
    }
    //Controllo che esistano i tavoli
    if(!ristorante.tavoli){
        res.status(404).json(ristorante.tavoli);  
        console.log("tavoli non trovati"); 
        return; 
    }
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

router.delete('/eliminaTavolo/:id/:managerpwd', async (req, res) => {
    const  id  = req.params.id;
    let ristorante = await Ristorante.findOne({mail:loggedUser.mail}).exec(); 
   
    //posso usare il metodo solo se inserisco la password del manager
    if(stringToHash(req.params.managerpwd)!=ristorante.passwordManagerHash){
        //accesso negato
        res.location("/api/v1/tavoliRisto/inserisciTavolo/" + id +'/'+ req.params.managerpwd).status(403).send();
        return;
    }
    let tavolo= await Tavolo.findById(req.params.id).exec(); 
    if(!tavolo){
        res.status(404).send();
        //stampa di controllo
        console.log('Tavolo non trovato')
        return; 
    }
    ristorante.tavoli.pull(req.params.id); 
    await Tavolo.deleteOne(tavolo).exec()
    await ristorante.save(); 

    res.location("/api/v1/tavoliRisto/eliminaTavolo/" + id).status(204).send();
});

router.post('/aggiungiTavolo/:nome/:managerpwd', async (req, res) => {
    let ristorante = await Ristorante.findOne({mail:loggedUser.mail});
    if(!ristorante){
        res.status(404).json(ristorante);  
        console.log("ristorante non trovato"); 
        return; 
    }
    
    let name = req.params.nome; 
    console.log("AVV NAME POST: "+name); 
    if(name===''){
        res.status(404).json(name);  
        console.log("nome non trovato"); 
        return; 
    }
    let pM= req.params.managerpwd;


    console.log("||||||" +pM+" =Password manager")
    console.log("||||||" +stringToHash(pM)+" =Password manager HASH")
    console.log("||||||" +ristorante.passwordManagerHash+" =Password manager HASH nel DB")
    if(stringToHash(pM)!=ristorante.passwordManagerHash)
    {
        //accesso negato
        res.location("/api/v1/tavoliRisto/").status(403).send();
        return;
    }
  let tavolo = new Tavolo({
        nome: name,
        chiamato:false
    });
    
  tavolo = await tavolo.save();
    ristorante.tavoli.push(tavolo);
    await ristorante.save(); 
    let tavoloId = tavolo.nome;
    console.log('Tavolo salvato');
    res.location("/api/v1/tavoliRisto/aggiungiTavolo/" + tavoloId).status(201).send();
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

module.exports = router;
