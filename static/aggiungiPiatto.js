function aggiungiPiatto()
{
    const btn = document.getElementById("aggiungi");
    
    var nomePiatto= document.getElementById('nomePiatto').value;
    var idPiatto= document.getElementById('idPiatto').value;
    var prezzo= document.getElementById('prezzo').value;
    var descrizione= document.getElementById('descrizione').value;
    var foto= document.getElementById('foto').value;
    
    console.log(nomePiatto);
    console.log(idPiatto);
    console.log(prezzo);
    console.log(descrizione);
    console.log(foto);

    fetch('../api/v1/piattos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nomePiatto, idPiatto: idPiatto, prezzo: prezzo, descrizione: descrizione, foto: foto } ),
    })
    .then((resp) => {
        console.log(resp);
        
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};