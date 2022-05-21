/**************************************************************************
 * In questo file, gestisco tutto ciò che ha a che fare con piatto.       *
 * In particolare,                                                        *
 *                                                                        *
 * router.get mi serve per mostrare gli elementi                          *
 * presenti in piattos nel db, e quindi la uso per mostrare il menu       *
 *                                                                        *
 * router.get mi servirà in un secondo momento per cercare i piatti       *
 * nel database e quindi per creare la funzione cercapiatto nella sezione *
 * cliente                                                                *
 *                                                                        *
 * router.post, invece, viene usata per aggiungere gli elementi           *
 * nell'array piatto e verrà usata nella sezione "manager" per aggiungere *
 * un piatto.                                                             *
 *                                                                        *
 * router.delete mi serve per cancellare i piatti e verrà usata anch'essa *
 * per eliminare i piatti.                                                *
 *                                                                        *
 *  NOTA:                                                                 *
 * In questo primo sprint, le cose funzionano solo con il tavolo          *
 * il cui nome è tav1 (abbiamo ovviamente cercato di non inserire         *
 *  altri tavoli con questo stesso nome nel DB). Il mio obiettivo         *
 * per il secondo sprint è cercare in qualche modo di fare funzionare     *
 * il codice per tutti i tavoli                                           *
 * A.                                                                     *
 *                                                                        *
***************************************************************************/


const express = require('express');
const router = express.Router();
const Piatto = require('./models/piatto'); // prendo il modello mongoose. 

router.get('', async(req,res)=> {
    let piattos = await Piatto.find({}); 
    piattos = piattos.map( (piatto)=>{ 
        return{
            self: '/api/v1/piattos/'+ piatto.id,
            nome: piatto.nome, 
            prezzo: piatto.prezzo,
            descrizione: piatto.descrizione,
            foto: piatto.foto,
            stato: piatto.stato,
            quantita: piatto.quantita,
        };
    }); 
    res.status(200).json(piattos);  
})

//utile quando ricerca piatto con id
router.get('/:id', async (req, res) => {
    let piatto= await Piatto.findById(req.params.id); 
    res.status(200).json({
        self: '/api/v1/piattos/'+ piatto.id,
        nome: piatto.nome,
        prezzo: piatto.prezzo,
        descrizione: piatto.descrizione,
        foto: piatto.foto,
        stato: piatto.stato,
        quantita: piatto.quantita
    }); 
}); 
   
//utile quando sarà necessario eliminare un piatto da parte di un manager
router.delete('/:id', async (req, res) => {
    let piatto= await Piatto.findById(req.params.id).exec(); 
    if(!piatto){
        res.status(404).send()
        console.log('piatto non trovato')
        return; 
    }
    
    await piatto.deleteOne(); 
    
    console.log('piatto eliminato'); 
    res.status(204).send()
});

router.post('', async (req, res) => {

	let piatto = new Piatto({
        nome: req.body.nome,
        prezzo: req.body.prezzo,
        descrizione: req.body.descrizione, 
        foto: req.body.foto, //percorso  
        stato: '',
    });
  
	piatto = await piatto.save();
    let piattoId = piatto.id;
    console.log('Piatto Salvato');
    res.location("/api/v1/piattos/" + piattoId).status(201).send();
});




module.exports = router;