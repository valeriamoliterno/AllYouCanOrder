/*************************************************
 *   FUNZIONE PER VEDERE I PIATTI NEL CARRELLO   *
 *************************************************/
var nomeTavolo = 'tav1'; //indica il tavolo a cui modifico tutto 
 function mostraCarrello(){
    const ul = document.getElementById('carrello'); // Get the list 
    ul.textContent = '';
    let li1 = document.createElement('li');
    let span1 = document.createElement('span');
    let inviaOrdine = document.createElement('button');
    let costo = document.createElement('h3');
    inviaOrdine.type = 'button'
    inviaOrdine.value = 'inviaOrd'
    inviaOrdine.onclick = () => daMenuAOrdine();
    inviaOrdine.textContent = 'INVIA ORDINE ALLA CUCINA'; 
    inviaOrdine.style="display: inline-block";
    costo.style="margin: 0; margin-left: 10px; padding: 10px; width: auto; color: #FE554A;";
    costo.classList="box";
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
    span1.append(inviaOrdine);
    span1.append(costo);
    li1.appendChild(span1);
    ul.appendChild(li1);
    var cost=0;
    fetch('../api/v1/tavoliCliente/mostraCarrello')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please

    var carrello= data.carrello;  
    //per ogni elemento in carrello eseguo la seguente funzione, che è simile a quella di mostraMenu(). 
    
     return carrello.forEach(piatto => {
         //creo una variabile in cui salvo questo piatto
        var piattoDaRimuovere = {
            id: piatto._id,
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
         aggiungi.onclick =  ()=> rimuoviPiatto(piattoDaRimuovere);
         aggiungi.textContent = 'rimuovi dal carrello';          
        
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
 
         cost=cost+piatto.prezzo;
         costo.innerHTML="Il totale del carrello è : "+cost+" €";
     });        
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here

}
mostraCarrello(); 

/**************************************************
 *   FUNZIONE PER RIMUOVERE PIATTI DAL CARRELLO   *
 **************************************************/
 function rimuoviPiatto(piattoDaRimuovere){
    var id= piattoDaRimuovere.id; 
    fetch('../api/v1/tavoliCliente/mostraCarrello', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id: id} ),
    })
    .then((resp) => {
        mostraCarrello();
        return;  
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

/**************************************************************
 *   FUNZIONE PER SPOSTARE I PIATTI DAL CARRELLO ALL'ORDINE   *
 **************************************************************/
 function daMenuAOrdine(){
    fetch('../api/v1/tavoliCliente/mostraCarrello')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
    
    var carrello= data.carrello;  
    carrello.forEach(piatto => {
         //creo una variabile in cui salvo questo piatto
        var piattoOrdine = {
           id: piatto._id,
            nome: piatto.nome,
            prezzo: piatto.prezzo, 
            descrizione: piatto.descrizione, 
            foto: piatto.foto,    
        }; 
        aggiungiPiattoOrdine(piattoOrdine);
       // rimuoviPiatto(piattoOrdine)   
     });
     svuotaCarrello(data);  
 
    })
 
}

/**************************************************
 *   FUNZIONE PER AGGIUNGI PIATTI DAL CARRELLO   *
 **************************************************/
 function aggiungiPiattoOrdine(ilMioOrdine){ 
    var id= ilMioOrdine._id;
    var nomePiatto= ilMioOrdine.nome;
    var prezzo= ilMioOrdine.prezzo;
    var descrizione= ilMioOrdine.descrizione; 
    var foto= ilMioOrdine.foto;  
    fetch('../api/v1/tavoliCliente/ordine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nomePiatto, prezzo: prezzo, descrizione: descrizione, foto: foto , id:id} ),
    })
    .then((resp) => {
        console.log(resp);       
        return;
        
    })
    .catch( error => console.error(error) ); 
}

/**************************************************
 *   FUNZIONE PER RESET CARRELLO          *
 **************************************************/

 function svuotaCarrello(tav){

    var name= tav.name; 
    fetch('../api/v1/tavoliCliente/svuotaCarrello', {
        method: 'DELETE',   
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { name: name} ),
    })
    .then((resp) => {
     function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      
      delay(1000).then(() => mostraCarrello());
        return;  
    })
    .catch( error => console.error(error) );

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

