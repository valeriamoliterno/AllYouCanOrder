const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); 
const Piatto = require('./models/piatto');


/*************************************************************
 * Questa delete serve per eliminare tutti gli elementi nell'array
 * tavolo.carrello e viene chiamata in carrello.js nel metodo 
 * "svuotaCarrello";  
 *************************************************************/
router.delete('/svuotaCarrello', async (req, res) => { 
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
     //Controllo che esista il ristorante
     if(!ristorante){
        res.status(404).json();  
        console.log("ristorante non trovato"); 
        return; 
    }
    let tavolo= Tavolo.updateMany({_id:ilMioTavoloID}, { $set: { carrello: [] }}, function(err /*affected*/){ //cerco il tavolo in questione ed elimino tutti gli elementi in carrello 
        //console.log('affected: ', affected);
    });
    res.location("/api/v1/tavoliCliente/svuotaCarrello/").status(201).send();
    await ristorante.save(); 
})


/*************************************************************
 * Questa get serve per mostrare tutti gli elementi nell'array
 * tavolo.ordine e viene chiamata in ordinde.js nel metodo "mostraOrdine()"
 *************************************************************/

router.get('/ordine', async(req,res)=> {  
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec(); //cercoil tavolo che mi serve
          //Controllo che esista il tavolo
     if(!tavolo){
        res.status(404).json();  
        console.log("tavolo non trovato"); 
        return; 
    }
        tavolo.ordine.forEach(element => {
        return{
            self: '/api/v1/tavoliCliente/ordine/'+ element._id, 
            ordine: element,
        };    
       });
        res.status(200).json(tavolo);  
    })
    
/*************************************************************
 * Questa post serve per inserire tutti gli elementi in
 * tavolo.carrello nell'array tavolo.ordine e viene chiamata in carrello.js nel metodo 
 * "svuotaCarrello";  
 *************************************************************/
router.post('/ordine', async (req, res) => {
        let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); //per il ristorante che mi serve
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec(); //per il tavolo che mi serve
       //Controllo che esista il ristorante
     if(!ristorante){
        res.status(404).json(ristorante);  
        console.log("ristorante non trovato"); 
        return; 
    }
        //Controllo che esista il tavolo
        if(!tavolo){
            res.status(404).json();  
            console.log("tavolo non trovato"); 
            return; 
        }
        //salvo nella variabile piatto gli elementi  passati
        let piatto = new Piatto({
            nome: req.body.nome,
            prezzo: req.body.prezzo,
            descrizione: req.body.descrizione, 
            foto: req.body.foto,    
            stato: 'in preparazione'
        });
        tavolo.ordine.push(piatto); //aggiungo il piatto all'array tavolo.ordine
        await tavolo.save();
        await ristorante.save(); 
        res.location("/api/v1/tavoliCliente/ordine/" + piatto._id).status(201).send();
    });
    
    
/*************************************************************
 * Questa get serve per mostrare tutti gli elementi nell'array
 * tavolo.carrello e viene chiamata in carrello.js nel metodo "mostraCarrello()"
 *************************************************************/


    router.get('/mostraCarrello', async(req,res)=> {  
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();
   
        //Controllo che esista il tavolo
        if(!tavolo){
            res.status(404).json(tavolo);  
            console.log("tavolo non trovato"); 
            return; 
        }
       
        tavolo.carrello.forEach(element => {
        return{
            self: '/api/v1/tavoliCliente/mostraCarrello/',
            carrello: element,
        };    
       });
        res.status(200).json(tavolo);  
    })

 /*************************************************************
 * Questa post serve per inserire l'elemento selezionato in ristorante.menu nell'array
 * tavolo.carrello  viene chiamata in menu.js 
 *************************************************************/
    
    router.post('/mostraCarrello/', async (req, res) => { //prima era post
        let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); //seleziono il mio ristorante
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec(); //seleziono il tavolo 
           //Controllo che esista il ristorante
        if(!ristorante){
            res.status(404).json(ristorante);  
            console.log("ristorante non trovato"); 
            return; 
        }
        //Controllo che esista il tavolo
        if(!tavolo){
            res.status(404).json(tavolo);  
            console.log("tavolo non trovato"); 
            return; 
        }
        var nome= req.body.nome;
        var prezzo= req.body.prezzo;
        var descrizione= req.body.descrizione; 
        var foto= req.body.foto;

        //salvo nella variabile piatto gli elementi 
        let piatto = new Piatto({
            nome: nome,
            prezzo: prezzo,
            descrizione: descrizione, 
            foto: foto,
            stato: '',
        }); //creo il nuovo piatto
        tavolo.carrello.push(piatto); //lo aggiungo in tavolo.carrello
        await tavolo.save();
        await ristorante.save(); 
       res.location("/api/v1/tavoliCliente/mostraCarrello/aggiungiPiatto/" + piatto._id).status(201).send();
    });
    
 /*************************************************************
 * Questa delete serve per eliminare l'elemento selezionato in tavolo.carrello dall'array
 * tavolo.carrello  viene chiamata in carrello.js
 *************************************************************/ 
    router.delete('/mostraCarrello/:id', async (req, res) => {
     //   let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();  
           //Controllo che esista il ristorante
   
        //Controllo che esista il tavolo
        if(!tavolo){
            res.status(404).json(tavolo);  
            console.log("tavolo non trovato"); 
            return; 
        }  
        tavolo.carrello.pull(req.params.id); //elimino il piatto il cui id è passatto
        await tavolo.save();  
        res.location("/api/v1/tavoliCliente/mostraCarrello/" + req.params.id).status(201).send();
    })
 /*************************************************************
 * Questa get serve per poter accedere al tavolo corretto e verificare in ordine.js
 * carrello.js e menu.js se tavolo.chiamato è true o false e
 * verificare quindi se il cameriereè stato chiamato o meno. 
 *************************************************************/ 

    router.get('/ilMioTavolo', async(req,res)=> {  
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();
           //Controllo che esista il ristorante
  
        //Controllo che esista il tavolo
        if(!tavolo){
            res.status(404).json(tavolo);  
            console.log("tavolo non trovato"); 
            return; 
        }
      
        self: '/api/v1/tavoliCliente/ilMioTavolo/',
            
        res.status(200).json(tavolo);  
    })
    
 /*************************************************************
 * Questa post serve per settare tavolo.chiamato=true se il cliente 
 * preme il pulsante "chiamaCameriere"
 * presente nei files ordine.js, carrello.js e menu.js 
 *************************************************************/ 

    router.post('/chiamaCameriere', async (req, res) => {
        let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
        
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();

        //Controllo che esista il ristorante
        if(!ristorante){
            res.status(404).json(ristorante);  
            console.log("ristorante non trovato"); 
            return; 
        }
        //Controllo che esista il tavolo
        if(!tavolo){
            res.status(404).json(tavolo);  
            console.log("tavolo non trovato"); 
            return; 
        }
        
        //salvo nella variabile piatto gli elementi 
        tavolo.chiamato=true; 
        await tavolo.save();
        await ristorante.save(); 
        res.location("/api/v1/tavoliCliente/chiamaCameriere/" ).status(201).send();
    });
    

/***********************************************************************************************************
 * questa get viene usata in stampaTavoli.js e serve soltanto per mostrare l'elenco dei tavoli di ristarante 
 * che viene usata per gestire la sezione di testing. 
 *************************************************************************************************************/
    router.get('/listaTavoli', async(req,res)=> {  
        let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
        console.log("Il mio ristorante id= "+ilMioRistoranteID);
        console.log(ristorante);
        if(ristorante.tavoli===null){
            console.log("NON CI SONO TAVOLI");
            res.status(404).json(); 
        }else{
       ristorante.tavoli.forEach(element => {
        return{
            self: '/api/v1/tavoliCliente/listaTavoli',
            tavolo: element,
        };    
       });}
        res.status(200).json(ristorante);  
    })
    

module.exports = router;
