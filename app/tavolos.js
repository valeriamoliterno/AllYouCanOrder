const express = require('express');

const router = express.Router();
const Tavolo = require('./models/tavolo'); // prendo il modello mongoose. 


/**
 * In questo file, gestisco i piatti e mi creo una base per poi riuscire a mostrarli nel menu. 
 */

//utile stampa piatto
router.get('', async(req,res)=> {
    let tavolos = await Tavolo.find({nome: /Tav1/i}); 
   tavolos = tavolos.map( (tavolo)=>{
        return{
            self: '/api/v1/tavolos/'+ tavolo.id,
            ordine: tavolo.ordine,// dopo aver inviato ordine;  
            chiamato: tavolo.chiamato,  
            carrello: tavolo.carrello, //prima di inviare ordine          
        };
    }); 
    res.status(200).json(tavolos);  
})


router.delete('', async (req, res) => { 
  let tavolo= Tavolo.update({name: 'tav1'}, { $set: { carrello: [] }}, function(err, affected){
        console.log('affected: ', affected);
    });
    res.location("/api/v1/tavolos/").status(201).send();
})
module.exports = router;