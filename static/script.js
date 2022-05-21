/***********************************************************************
 * NOTA:                                                               *
 *  per questo primo sprint, il menu, l'aggiunta di un piatto          *
 * al carrello e lo spostamento in ordine funzionano soltanto per tav1 *
 ***********************************************************************/


/*********************************************
 *   FUNZIONE PER VEDERE I PIATTI NEL MENU   *
 *********************************************/


 function creaMenu() {
    const ul = document.getElementById('piattos'); // Get the list 
    ul.textContent = '';
    fetch('../api/v1/piattos') //perndo i piatti dal db
    .then((resp) => resp.json()) // trasformo i dati in json
    .then(function(data) { //prendo tutti i dati per poterli poi modificare
        
    return data.map(function(piatto) { // creo una mappa e per ogni piatto faccio andare il codice sottostante

    //Creo una variabile all'interno della quale salvo i valori del piatto in questione. Questa variabile verrà passata alla funzione aggiungiPiatto()
            var ilMioPiatto = {
                nome: piatto.nome,
                prezzo: piatto.prezzo, 
                descrizione: piatto.descrizione, 
                foto: piatto.foto,  
            };        
            //ciò che viene mostrato
            let li = document.createElement('li');
            let span = document.createElement('span'); 
            let nome = document.createElement('nome');
            nome.href = piatto.self;
            nome.textContent = piatto.nome; 
            
            let img = document.createElement('img'); 
            img.height=50; 
            img.width=50; 
            img.src=piatto.foto;
            let desc = document.createElement('p'); 
            desc.herf = piatto.self; 
            desc.textContent= piatto.descrizione; 
            let pr=document.createElement('h5'); 
            pr.herf=piatto.self; 
            pr.textContent= 'prezzo: '+ piatto.prezzo + ' euro'; 
            //cliccando questo bottone, il piatto viene aggiunto al carrello
            let aggiungi = document.createElement('button');
            aggiungi.type = 'button'
            aggiungi.value='aggiungi'
            aggiungi.onclick =  ()=> aggiungiPiatto(ilMioPiatto);
            aggiungi.textContent = 'aggiungi al carrello';          
            // Append all our elements
            span.appendChild(img); 
            span.appendChild(nome);   
            span.appendChild(desc);
            span.appendChild(pr);  
            span.appendChild(aggiungi);
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
creaMenu();









/**************************************************
 *   FUNZIONE PER AGGIUNGERE PIATTI AL CARRELLO   *
 **************************************************/

function aggiungiPiatto(ilMioPiatto){
    var nomePiatto= ilMioPiatto.nome;
    var prezzo= ilMioPiatto.prezzo;
    var descrizione= ilMioPiatto.descrizione; 
    var foto= ilMioPiatto.foto; 
    fetch('../api/v1/mostraCarrello/', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nomePiatto, prezzo: prezzo, descrizione: descrizione, foto: foto } ),
    })
    .then((resp) => {
        console.log(resp);
        return;
        
    })
    .catch( error => console.error(error) ); 

}







