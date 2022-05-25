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
    inviaOrdine.type = 'button'
    inviaOrdine.value = 'inviaOrd'
    inviaOrdine.onclick = () => daMenuAOrdine();
    inviaOrdine.textContent = 'INVIA ORDINE ALLA CUCINA';   
    span1.append(inviaOrdine);
    li1.appendChild(span1);
    ul.appendChild(li1);
    fetch('../api/v1/mostraCarrello')
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
        let contenutoTab = document.createElement('span');

        //CARATTERISTICHE DEL PIATTO
        let nome = document.createElement('nome');
        nome.href = piatto.self;
        nome.textContent = piatto.nome; 
        let img = document.createElement('img'); 
        img.className='piatto'
        img.src=piatto.foto;
        let desc = document.createElement('descrizione'); 
        desc.herf = piatto.self; 
        desc.textContent= piatto.descrizione; 
        let pr=document.createElement('prezzo'); 
         pr.herf=piatto.self; 
         pr.textContent= piatto.prezzo + ' €';

          //BOTTONE PER RIMUOVERE ELEMENTI DAL CARRELLO
             let rimuovi = document.createElement('button');
             rimuovi.type = 'button'
             rimuovi.value = 'rimuovi'
             rimuovi.onclick = () => rimuoviPiatto(piattoDaRimuovere);
             rimuovi.textContent = 'elimina';           
            
               //CREO PLATE, CHE SOSTANZIALMENTE RACCHIUDE TUTTI GLI ELEMENTI DI PIATTO, INCLUSO STATO E LA TABELLA SOPRASTANTE
            let plate= document.createElement('div');
            plate.className ='piatto'; 

            cellsx.appendChild(img);
            contenutoTab.appendChild(nome);
            contenutoTab.appendChild(desc);
            contenutoTab.appendChild(pr); 
            celldx.appendChild(contenutoTab);
            row.appendChild(cellsx);
            row.appendChild(celldx); 
            tblBody.appendChild(row); 
            tabella.appendChild(tblBody); 
            plate.appendChild(tabella);
            plate.appendChild(rimuovi);
            //PER MENU E CARRELLO, ELIMINO STATO E FACCIO PLATE.APPENDCHILD(BOTTONE)
            li.appendChild(plate);
            ul.appendChild(li);
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
    fetch('../api/v1/mostraCarrello/', {
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
    fetch('../api/v1/mostraCarrello')
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
    fetch('../api/v1/mostraOrdine/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nomePiatto, prezzo: prezzo, descrizione: descrizione, foto: foto , id:id} ),
    })
    .then((resp) => {
        console.log(resp);
        console.log("Mostra ordine in aggiungiPiattoOrdine")
        
        return;
        
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

/**************************************************
 *   FUNZIONE PER RESET CARRELLO          *
 **************************************************/

 function svuotaCarrello(tav){

    var name= tav.name; 
    fetch('../api/v1/svuotaCarrello/', {
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