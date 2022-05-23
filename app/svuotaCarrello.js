const express = require('express');

const router = express.Router();
const Tavolo = require('./models/tavolo'); // prendo il modello mongoose. 
const Ristorante = require('./models/ristorante')

/**
 * In questo file, gestisco i piatti e mi creo una base per poi riuscire a mostrarli nel menu. 
 */

//utile stampa piatto
router.get('', async(req,res)=> {
    let tavolos = await Tavolo.find({_id: ilMioTavoloID}); 
   tavolos = tavolos.map( (tavolo)=>{
        return{
            self: '/api/v1/svuotaCarrello/'+ tavolo.id,
            ordine: tavolo.ordine,// dopo aver inviato ordine;  
            chiamato: tavolo.chiamato,  
            carrello: tavolo.carrello, //prima di inviare ordine          
        };
    }); 
    res.status(200).json(tavolos);  
})


router.delete('', async (req, res) => { 
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
  let tavolo= Tavolo.update({_id:ilMioTavoloID}, { $set: { carrello: [] }}, function(err, affected){
        console.log('affected: ', affected);
    });
    res.location("/api/v1/svuotaCarrello/").status(201).send();
    await ristorante.save(); 
})
module.exports = router;
