const express = require('express'); 

const router = express.Router();

const Piatto = require('./models/piatto'); // prendo il modello mongoose dello schema Piatto. 

/**
 * In questo file sono presenti i metodi REST per l'utilizzo delle API 
 */


/**
 * Questo metodo GET richiama l'elenco di tutti i piatti 
 * presenti nel database
 */
router.get('', async(req,res)=> {
    let piattos = await Piatto.find({}); 
    piattos = piattos.map( (piatto)=>{ 
        return{
            self: '/api/v1/piattos/stampaPiattos/'+ piatto.id,
            nome: piatto.nome, 
            prezzo: piatto.prezzo,
            descrizione: piatto.descrizione,
            foto: piatto.foto,
            stato: piatto.stato,
        };
    }); 
    res.status(200).json(piattos);  
})

/**
 * Questo metodo GET richiama il piatto con l'id passato nei 
 * parametri dal database
 */
router.get('/:id', async (req, res) => {
    let piatto= await Piatto.findById(req.params.id); 
    res.status(200).json({
        self: '/api/v1/piattos/stampaPiatto/'+ piatto.id,
        nome: piatto.nome,
        prezzo: piatto.prezzo,
        descrizione: piatto.descrizione,
        foto: piatto.foto,
        stato: piatto.stato,
    }); 
}); 


/**
 * Questo metodo DELETE elimina dal databse il piatto con id passato
 * nel body della response
 */
router.delete('', async (req, res) => {
    const  id  = req.body.id;
    let piatto= await Piatto.findById(req.body.id).exec(); 
    if(!piatto){
        res.status(404).send()
        //stampa di controllo
        console.log('piatto non trovato')
        return; 
    }
    await Piatto.deleteOne(piatto).exec()

    //stampa di controllo correttezza dell'operazione
    console.log('CONTROLLO: piatto eliminato : ' + piatto.nome);
    
    res.location("/api/v1/piattos/eliminaPiatto/" + id).status(204).send();
});

/**
 * Questo metodo POST inserisce nel database un piatto le
 * cui proprietà sono passate nel body della response
 */
router.post('', async (req, res) => {

	let piatto = new Piatto({
        nome: req.body.nome,
        prezzo: req.body.prezzo,
        descrizione: req.body.descrizione, 
        foto: req.body.foto, //percorso  
        stato: '',
    });
    
	piatto = await piatto.save();

    //Stampa di controllo per salvataggio di un nuovo piatto
    console.log('Piatto Salvato:' + piatto._id);

    res.location("/api/v1/piattos/aggiungiPiatto/" + piatto._id).status(201).json(piatto);
});

module.exports = router;