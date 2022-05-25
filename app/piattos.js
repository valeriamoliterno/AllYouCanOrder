/**************************************************************************
 * In questo file, gestisco tutto ciò che ha a che fare con piatto.       *
 * In particolare,                                                        *
 *                                                                        *
 * router.get mi serve per mostrare gli elementi                          *
 * presenti in piattos nel db, e quindi la uso per mostrare il menu       *
 *                                                                        *
 * router.get (/id)mi servirà in un secondo momento per cercare i piatti       *
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
const Ristorante = require('./models/ristorante'); // prendo il modello mongoose. 
const Piatto = require('./models/piatto');

/**
 * Questo metodo GET richiama l'elenco di tutti i piatti 
 * presenti nel database
 */
router.get('', async(req,res)=> {
    let ristorantes = await Ristorante.findOne({ _id: ilMioRistoranteID}); 
    let menu = await ristorantes.menu; 
    menu.forEach(piatto => {
        return{
            self: '/api/v1/piattos/'+ piatto.id,
            nome: piatto.nome, 
            prezzo: piatto.prezzo,
            descrizione: piatto.descrizione,
            foto: piatto.foto,
            stato: piatto.stato,
        };
    }); 
    res.status(200).json(menu);  
})


/**
 * Questo metodo DELETE elimina dal databse il piatto con id passato
 * nel body della response
 */
router.delete('', async (req, res) => {
    const  id  = req.body.id;
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
    let piatto= await Piatto.findById(req.body.id).exec(); 
    if(!piatto){
        res.status(404).send()
        //stampa di controllo
        console.log('piatto non trovato')
        return; 
    }
    if(!ristorante){
        res.status(404).send()
        //stampa di controllo
        console.log('Ristorante non trovato')
        return; 
    }
    ristorante.menu.pull(req.body.id); 
    await Piatto.deleteOne(piatto).exec()
    await ristorante.save(); 
    //stampa di controllo correttezza dell'operazione
    console.log('CONTROLLO: piatto eliminato : ' + piatto.nome);
    res.location("/api/v1/piattos/eliminaPiatto/" + id).status(204).send();

});




/**
 * Questo metodo POST inserisce nel database un piatto le
 * cui proprietà sono passate nel body della response
 */
router.post('', async (req, res) => {
    let ristorante = await Ristorante.findOne({_id: ilMioRistoranteID}).exec(); 
	let piatto = new Piatto({
        nome: req.body.nome,
        prezzo: req.body.prezzo,
        descrizione: req.body.descrizione, 
        foto: req.body.foto, //percorso  
        stato: '',
    });
    piatto = await piatto.save();
    ristorante.menu.push(piatto);
    await ristorante.save(); 

    //Stampa di controllo per salvataggio di un nuovo piatto
    console.log('Piatto Salvato:' + piatto._id);

    res.location("/api/v1/piattos/aggiungiPiatto/" + piatto._id).status(201).json(piatto);
});

module.exports = router;