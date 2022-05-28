const express = require('express');
const router = express.Router();
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo'); // get our mongoose model
const Piatto = require('./models/piatto');


router.get('', async (req, res) => {
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID});
    let tavol = await ristorante.tavoli;
    tavol.forEach(tavolo => {
        return {
            self: '/api/v1/tavoli/'+ tavolo.id,
            id: tavolo._id,
            nome: tavolo.nome
        };
    });
   
    res.status(200).json(tavol);
});



router.post('', async (req, res) => {

	let tavolo = new Tavolo({
        nome: req.body.nome,
        chiamato:false
    });
    
	tavolo = await tavolo.save();
    
    let tavoloId = tavolo.nome;

    console.log('Tavolo salvato');


    res.location("/api/v1/tavoli" + tavoloId).status(201).send();
});


router.get('/tavolo', async(req,res)=> {
    let tavolos = await Tavolo.find({_id: ilMioTavoloID}); 
   tavolos = tavolos.map( (tavolo)=>{
        return{
            self: '/api/v1/tavoli/svuotaCarrello/'+ tavolo.id,
            ordine: tavolo.ordine,// dopo aver inviato ordine;  
            chiamato: tavolo.chiamato,  
            carrello: tavolo.carrello, //prima di inviare ordine          
        };
    }); 
    res.status(200).json(tavolos);  
})


router.delete('/svuotaCarrello', async (req, res) => { 
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
  let tavolo= Tavolo.update({_id:ilMioTavoloID}, { $set: { carrello: [] }}, function(err, affected){
        console.log('affected: ', affected);
    });
    res.location("/api/v1/tavoli/svuotaCarrello/").status(201).send();
    await ristorante.save(); 
})


router.get('/ordine', async(req,res)=> {  
    //per non impicciarmi in questo primo sprint, mostro soltanto le cose di tav1, in un secondo momento probabilmente dovrò fare findById o qualcosa del genere
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();
        tavolo.ordine.forEach(element => {
        return{
            self: '/api/v1/tavoli/ordine'+ element._id, //aggiunto + element.id
            ordine: element,
        };    
       });
        res.status(200).json(tavolo);  
    })
    
    router.post('/ordine', async (req, res) => {
        let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();
        //salvo nella variabile piatto gli elementi 
        let piatto = new Piatto({
            nome: req.body.nome,
            prezzo: req.body.prezzo,
            descrizione: req.body.descrizione, 
            foto: req.body.foto,    
            stato: 'in preparazione'
        });
        tavolo.ordine.push(piatto); 
        await tavolo.save();
        await ristorante.save(); 
        res.location("/api/v1/tavoli/ordine" + piatto._id).status(201).send();
    });
    
    


    router.get('/mostraCarrello', async(req,res)=> {  
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();
        tavolo.carrello.forEach(element => {
        return{
            self: '/api/v1/tavoli/mostraCarrello',
            carrello: element,
        };    
       });
        res.status(200).json(tavolo);  
    })
    
    
    router.post('/mostraCarrello', async (req, res) => { //prima era post
        let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec(); ///tav1/i
        //salvo nella variabile piatto gli elementi 
        let piatto = new Piatto({
            nome: req.body.nome,
            prezzo: req.body.prezzo,
            descrizione: req.body.descrizione, 
            foto: req.body.foto,
            stato: '',
        });
        tavolo.carrello.push(piatto); 
        await tavolo.save();
        await ristorante.save(); 
       res.location("/api/v1/tavoli/mostraCarrello/aggiungiPiatto" + piatto._id).status(201).send();
    });
    
    
    router.delete('/mostraCarrello', async (req, res) => {
        let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
        let tavolo= await Tavolo.findOne({_id: ilMioTavoloID}).exec();    
        tavolo.carrello.pull(req.body.id); 
        await tavolo.save();  
        await ristorante.save(); 
        res.location("/api/v1/tavoli/mostraCarrello/" + req.body.id).status(201).send();
    })
    
    
    

module.exports = router;
