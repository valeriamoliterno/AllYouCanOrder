/**
 * Script richiamato dal file aggiungiPiatto.html
 * 
 * Questa funzione gestisce l'input ricevuto dal form e richiama le 
 * API del metodo POST per il modello Piatto, passando i valori ricevuti 
 * come body della response
 */

function aggiungi()
{ 
    var nomePiatto= document.getElementById('nomePiatto').value;
    var prezzo= document.getElementById('prezzo').value;
    var descrizione= document.getElementById('descrizione').value;
    var foto= document.getElementById('foto').value;
    

    //Stampe di controllo di correttezza dei dati
    console.log(nomePiatto);
    console.log(prezzo);
    console.log(descrizione);
    console.log(foto);

    fetch('../api/v1/piattos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nomePiatto, prezzo: prezzo, descrizione: descrizione, foto: foto } ),
    })
    .then((resp) => {
        //stampa di controllo della response
        console.log(resp);
       
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};