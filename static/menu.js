/***********************************************************************
 * NOTA:                                                               *
 *  per questo primo sprint, il menu, l'aggiunta di un piatto          *
 * al carrello e lo spostamento in ordine funzionano soltanto per tav1 *
 ***********************************************************************/

//const Tavolo = require("../app/models/tavolo");


/*********************************************
 *   FUNZIONE PER VEDERE I PIATTI NEL MENU   *
 *********************************************/


 function creaMenu() {
    
    const ul = document.getElementById('piattos'); // Get the list 
    ul.textContent = '';


    const chiama= document.getElementById('chiamaCameriere');
    var x = document.getElementById("fraseCameriere");
    fetch('../api/v1/tavoliCliente/ilMioTavolo') //perndo i piatti dal db
    .then((resp) => resp.json()) // trasformo i dati in json
    .then(function(dataC) {
    const tvNum= document.getElementById('tvNum');
    tvNum.textContent=dataC.nome;  //segno il nome del tavolo ch uso
   
        if(dataC.chiamato==true){
            chiama.disabled='true'; 
            x.style.display = "block";
     
        }else{
            chiama.enable='true';

            x.style.display = "none";
        }

    })

    chiama.onclick =  ()=> chiamaCameriere(chiama);
    // ()=> chiamaCameriere(); 
    fetch('../api/v1/piattosCliente') //perndo i piatti dal db
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
                 
            //CREO LA TABELLA IN CUI SALVARE DA UNA PARTE L'IMMAGINE DEL PIATTO E DALL'ALTRA LE SUE CARATTERISTICHE
            let li = document.createElement('li');
            let tabella = document.createElement('table');
            tabella.className='piatti'; 
            let tblBody = document.createElement("tbody")
            var row = document.createElement("tr");
            var cellsx = document.createElement("td");
            var celldx = document.createElement("td");
            var cellvalore=document.createElement('td');
            cellsx.className='sinistra'; 
            celldx.className='destra'; 
            cellvalore.className='valore';
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

             let num=document.createElement("num");
             contaTipoPiatto(ilMioPiatto,num); 

            //BOTTONE PER AGGIUNGERE ELEMENTI AL CARRELLO
            let aggiungi = document.createElement('button');
            aggiungi.type = 'button'
            aggiungi.value='aggiungi'
            aggiungi.className='aggiungi';
            aggiungi.onclick = ()=> aggiungiPiatto(ilMioPiatto, num); 
            aggiungi.textContent = 'aggiungi al carrello';     
            
            
           
            //CREO PLATE, CHE SOSTANZIALMENTE RACCHIUDE TUTTI GLI ELEMENTI DI PIATTO, INCLUSO STATO E LA TABELLA SOPRASTANTE
            let plate= document.createElement('div');
            plate.className ='piatto'; 

            cellsx.appendChild(img);
            contenutoTab.appendChild(nome);
            contenutoTab.appendChild(desc);
            contenutoTab.appendChild(pr); 
            contenutoTab.appendChild(aggiungi); 
            contenutoTab.appendChild(num); 
            celldx.appendChild(contenutoTab);
            cellvalore.appendChild(num);
            row.appendChild(cellsx);
            row.appendChild(celldx); 
            row.appendChild(cellvalore); 
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

function aggiungiPiatto(ilMioPiatto, num){
    var nomePiatto= ilMioPiatto.nome;
    var prezzo= ilMioPiatto.prezzo;
    var descrizione= ilMioPiatto.descrizione; 
    var foto= ilMioPiatto.foto;  
    fetch('../api/v1/tavoliCliente/mostraCarrello/', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nomePiatto, prezzo: prezzo, descrizione: descrizione, foto: foto} ),
    })
    .then((resp) => {
        console.log(resp);
     
        return;
        
    })
    .catch( error => console.error(error) ); 
   contaTipoPiatto(ilMioPiatto, num); 
   creaMenu(); 

}



/**************************************************
 *   FUNZIONE PER CHIAMARE IL CAMERIERE           *
 **************************************************/


function chiamaCameriere(btn){
    btn.disabled='true'; 
    var x = document.getElementById("fraseCameriere");
   
      x.style.display = "block";
   
    fetch('../api/v1/tavoliCliente/chiamaCameriere/', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
       
    })
    .then((resp) => {
        console.log(resp);
        return;
        
    })
    .catch( error => console.error(error) ); 
   
}


/**************************************************
 *   FUNZIONE PER STAMPARE IL NUMERO DI PIATTI NEL CARRELLO DIVISI PER TIPO  *
 **************************************************/


 async function  contaTipoPiatto(ilMioPiatto, num){
    console.log("STAMPE contaTipoPiatto"); 
    console.log("ilMioPiatto: "+ilMioPiatto.nome);
    fetch('../api/v1/tavoliCliente/mostraCarrello')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
    var carrello= data.carrello;  
    let porzioni=0;
    //per ogni elemento in carrello eseguo la seguente funzione, che è simile a quella di mostraMenu(). 
    carrello.forEach(piatto => { 
        
      if(ilMioPiatto.nome===piatto.nome && ilMioPiatto.descrizione===piatto.descrizione&&ilMioPiatto.prezzo===piatto.prezzo){
            porzioni+=1; 
        }
     })  
     num.textContent=porzioni; 
     })

}
