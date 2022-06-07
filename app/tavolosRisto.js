const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model
const Piatto = require('./models/piatto');


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
    let tavolo= await Tavolo.findById(req.params.id).exec(); 
   
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
    res.location("/api/v1/tavoliRisto/aggiungiTavolo" + tavoloId).status(201).send();
});

/*
router.post('/aggiungiTavolo', async (req, res) => {
    let ristorante = await Ristorante.findOne({mail:loggedUser.mail});
    let pM = req.body.managerpwd; 
    let name = req.body.nome; 

    console.log("1234333 PasswordMANAGER= "+ pM + " nome= "+ name)
    if(!ristorante){
        res.status(404).json(ristorante);  
        console.log("ristorante non trovato"); 
        return; 
    }
   
    if(name===''){
        res.status(404).json(name);  
        console.log("nome non trovato"); 
        return; 
    }
    //posso usare il metodo solo se inserisco la password del manager
    if(stringToHash(pM)!=ristorante.passwordManagerHash)
    {
        //accesso negato
        res.location("/api/v1/tavoliRisto/").status(403).send();
        return;
    }else{
    

  let tavolo = new Tavolo({
        nome: name,
        chiamato:false
    });
    
  tavolo = await tavolo.save();
    ristorante.tavoli.push(tavolo);
    await ristorante.save(); 
    let tavoloId = tavolo.nome;
    console.log('Tavolo salvato');
    res.location("/api/v1/tavoliRisto/" + tavoloId).status(201).send();
}
});*/

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