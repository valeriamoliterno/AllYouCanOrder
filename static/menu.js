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
    const chiamaCameriere= document.getElementById('chiamaCameriere');
    chiamaCameriere.onclick= ()=> chiamaCameriere(); 
    fetch('../api/v1/piattos') //perndo i piatti dal db
    .then((resp) => resp.json()) // trasformo i dati in json
    .then(function(data) { //prendo tutti i dati per poterli poi modificare
    
     console.log(data);    
    return data.map(function(piatto) { // creo una mappa e per ogni piatto faccio andare il codice sottostante

    //Creo una variabile all'interno della quale salvo i valori del piatto in questione. Questa variabile verrà passata alla funzione aggiungiPiatto()
            var ilMioPiatto = {
                nome: piatto.nome,
                prezzo: piatto.prezzo, 
                descrizione: piatto.descrizione, 
                foto: piatto.foto,  
            };        
            //CREO LA TABELLA IN CUI SALVARE DA UNA PARTE L'IMMAGINE DEL PIATTO E DALL'ALTRA LE SUE CARATTERISTICHE
            let li = document.createElement('li');
            let tabella = document.createElement('table');
            tabella.className='piatti'; 
            let tblBody = document.createElement("tbody")
            var row = document.createElement("tr");
            var cellsx = document.createElement("td");
            var celldx = document.createElement("td");
            cellsx.className='sinistra'; 
            celldx.className='destra'; 
            let contenutoTab = document.createElement('span'); //contenuto cella dx

            //CARATTERISTICHE DEL PIATTO
            let nome = document.createElement('nome');
            nome.href = piatto.self;
            nome.textContent = piatto.nome; 
            let img = document.createElement('img'); 
            img.className='piattoMenu'
            img.src=piatto.foto;
            let desc = document.createElement('descrizione'); 
            desc.herf = piatto.self; 
            desc.textContent= piatto.descrizione; 
            let pr=document.createElement('prezzo'); 
             pr.herf=piatto.self; 
             pr.textContent= piatto.prezzo + ' €'; 

            //BOTTONE PER AGGIUNGERE ELEMENTI AL CARRELLO
            let aggiungi = document.createElement('button');
            aggiungi.type = 'button'
            aggiungi.value='aggiungi'
            aggiungi.className='aggiungi';
            aggiungi.onclick =  ()=> aggiungiPiatto(ilMioPiatto);
            aggiungi.textContent = 'aggiungi al carrello';          
           
            //CREO PLATE, CHE SOSTANZIALMENTE RACCHIUDE TUTTI GLI ELEMENTI DI PIATTO, INCLUSO STATO E LA TABELLA SOPRASTANTE
            let plate= document.createElement('div');
            plate.className ='piatto'; 

            cellsx.appendChild(img);
            contenutoTab.appendChild(nome);
            contenutoTab.appendChild(desc);
            contenutoTab.appendChild(pr); 
            contenutoTab.appendChild(aggiungi); 
            celldx.appendChild(contenutoTab);
            row.appendChild(cellsx);
            row.appendChild(celldx); 
            tblBody.appendChild(row); 
            tabella.appendChild(tblBody); 
            plate.appendChild(tabella);
            //PER MENU E CARRELLO, ELIMINO STATO E FACCIO PLATE.APPENDCHILD(BOTTONE)
            li.appendChild(plate);
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
   // console.log("Nome del tavolo: "+ nomeTavolo); 
    fetch('../api/v1/mostraCarrello/', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nomePiatto, prezzo: prezzo, descrizione: descrizione, foto: foto} ),
    })
    .then((resp) => {
        console.log(resp);
        return;
        
    })
    .catch( error => console.error(error) ); 

}





function chiamaCameriere(){

}