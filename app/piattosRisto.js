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
const Tavolo = require('./models/tavolo');

router.get('', async(req,res)=> {
    console.log('sono nella get')
    console.log(loggedUser.mail)
    let ristorantes = await Ristorante.findOne({ mail: loggedUser.mail}); 
    if(!ristorantes){
        res.status(404).send()
        //stampa di controllo
        console.log('Ristorante non trovato')
        return; 
    }
    let menu = await ristorantes.menu; 
    menu.forEach(piatto => {
        return{
            self: '/api/v1/piattosRisto/',
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
 * Chiamata API in GET che dato nei parametri l'id di un tavolo restituisce la lista dei piatti nell'ordine del tavolo
 */
 router.get('/ordineTavolo/:id', async (req, res) => {
    let idT = req.params.id; 
    let tavolo = await Tavolo.findOne({_id: idT}); // Trovo il tavolo 
    let ordine = await tavolo.ordine; // Trovo l'ordine
    ordine = ordine.map( (piatto) => {
        return { // Restituisco l'id, il nome, la foto, e lo stato di ogni piatto
            id: piatto._id,
            nome: piatto.nome,
            foto: piatto.foto,
            stato: piatto.stato
        };
    });
    res.status(200).json(ordine); // trasforma in json
});

/**
 * Chiamata API in POST che dato nel body l'id del tavolo e del piatto e lo stato cambia lo stato del piatto in quello desiderato
 */
router.post('/cambiaStato', async (req, res) =>{
    let idP= req.body.idP; // Recupero dal body l'id del Piatto
    let idT=req.body.idT; // Recupero dal body l'id del Tavolo
    let stato = req.body.stato; // Recupero dal body lo stato in cui cambiare
    console.log("!!!!!!!!!!!!!!!!!!ID P= "+idP+" !!!!!!!!!!!!!")
    console.log("!!!!!!!!!!!!!!!!!!ID T= "+idT+" !!!!!!!!!!!!!")
    console.log("!!!!!!!!!!!!!!!!!!stato= "+stato+" !!!!!!!!!!!!!")
  //  console.log("----- idP: "+idP+" ----- idT: "+idT+"------ Stato: "+stato+"---------------");
    let tavolo = await Tavolo.findOne({_id: idT}); // Trovo il tavolo 
    if(!tavolo){
        res.status(405).send()
        //stampa di controllo
        console.log('tavolo non trovato')
        return; 
    }
   // console.log("----- Tavolo --------------------------");
  //  console.log(tavolo);
    let ordine = await tavolo.ordine; // Trovo l'ordine
   // console.log("----- Ordine --------------------------");
    //console.log(ordine);
    ordine = ordine.map( (piatto) => {
       // console.log("----- Piatto --------------------------");
      //  console.log(piatto);
        if(idP.localeCompare(piatto._id) === 0){ // Se l'id del piatto è uguale
            //console.log("||||||||||||||||  SI  ||||||||||||||||||||");
            piatto.stato=stato; // Cambio lo stato
        }
    });
    tavolo.save(); // Salvo il tavolo

    res.location("/api/v1/piattosRisto/cambiaStato" + idP).status(201).send();
});

/**
 * Questo metodo DELETE elimina dal databse il piatto con id passato
 * nel body della response
 */
router.delete('/eliminaPiatto/:id', async (req, res) => {
    let ristorante = await Ristorante.findOne({mail: loggedUser.mail}).exec(); 
    let piatto= await Piatto.findById(req.params.id); 
    console.log("!!!!!!!!!!!!!!!!!!req.params.id= "+req.params.id+" !!!!!!!!!!!!!")
    if(!ristorante){
        res.status(404).send()
        //stampa di controllo
        console.log('Ristorante non trovato')
        return; 
    }
    if(!piatto){
        res.status(404).send()
        //stampa di controllo
        console.log('piatto non trovato')
        return; 
    }
    ristorante.menu.pull(req.params.id); 
    await Piatto.deleteOne(piatto).exec()
    await ristorante.save(); 
    //stampa di controllo correttezza dell'operazione
    console.log('CONTROLLO: piatto eliminato : ' + piatto.nome);
    res.location('/api/v1/piattosRisto/eliminaPiatto/'+req.params.id).status(204).send();

});




/**
 * Questo metodo POST inserisce nel database un piatto le
 * cui proprietà sono passate nel body della response
 */
router.post('/aggiungiPiatto', async (req, res) => {
    let ristorante = await Ristorante.findOne({mail: loggedUser.mail}).exec(); 
    if(!ristorante){
        res.status(404).send()
        //stampa di controllo
        console.log('Ristorante non trovato')
        return; 
    }
    if(req.body.nome===''){
        res.status(400).send();
        return;
    } else if(req.body.prezzo===''){
        res.status(400).send();
        return;
    } else {
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

        res.location("/api/v1/piattosRisto/aggiungiPiatto/" + piatto._id).status(201).json(piatto);
    }
});

module.exports = router;