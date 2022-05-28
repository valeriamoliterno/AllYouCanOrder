

/************************************************
 *   FUNZIONE PER VEDERE I PIATTI NELL'ORDINE   *
 ************************************************/

 function mostraOrdine(){
   const tvNum= document.getElementById('tvNum');
  const ul = document.getElementById('ordine'); // Get the list 
  ul.textContent = '';
     fetch('../api/v1/tavoli/ordine')
     .then((resp) => resp.json()) // Transform the data into json
     .then(function(data) { // Here you get the data to modify as you please
     var ordine= data.ordine;       
     const tvNum= document.getElementById('tvNum');
     tvNum.herf=data; 
     tvNum.textContent=data.nome;
     
     //per ogni elemento in carrello eseguo la seguente funzione, che è simile a quella di mostraMenu(). 
     
      return ordine.forEach(piatto => {
      
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
          
             //GESTISCO LO STATO, CHE è PRESENTE SOLTANTO IN ORDINE. CAMBIO IL COLORE DEL TESTO IN BASE AL TIPO DI STATO
             let stato= document.createElement('stato'); 
             stato.herf = piatto.self; 
             stato.textContent=piatto.stato;
            if(piatto.stato=='in consegna'){
               stato.className='inConsegna'; 
             }else if(piatto.stato == 'in preparazione'){
               stato.className='inPreparazione'; 
             }else if(piatto.stato=='consegnato'){
               stato.className='consegnato';
             }

            //INSERISCO TUTTI GLI ALTRI ELEMENTI NECESSARI: NOME, IMMAGINE ECC
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
             
             //CREO PLATE, CHE SOSTANZIALMENTE RACCHIUDE TUTTI GLI ELEMENTI DI PIATTO, INCLUSO STATO E LA TABELLA SOPRASTANTE
              let plate= document.createElement('div');
             if(piatto.stato=='consegnato'){
                plate.className='piatto.consegnato'; 
              } else{
                plate.className ='piatto'; 
              }
              
              //METTO INSIEME NOME, PIATTO E DESCRIZIONE
              contenutoTab.classList.add('nome'); 
              contenutoTab.classList.add('desc'); 
              contenutoTab.classList.add('pr'); 
              plate.classList.add('colonnaSx'); 
              plate.classList.add('colonnaDX'); 
              plate.classList.add('stato'); 
              
             
             cellsx.appendChild(img);
             contenutoTab.appendChild(nome);
             contenutoTab.appendChild(desc);
             contenutoTab.appendChild(pr); 
             celldx.appendChild(contenutoTab);
             row.appendChild(cellsx);
             row.appendChild(celldx); 
             tblBody.appendChild(row); 
             tabella.appendChild(tblBody); 
             plate.appendChild(stato);
             plate.appendChild(tabella);
             //PER MENU E CARRELLO, ELIMINO STATO E FACCIO PLATE.APPENDCHILD(BOTTONE)
             li.appendChild(plate);
             ul.appendChild(li);
             
      });  
      
     
    })

    .catch( error => console.error(error) );// If there is any error you will catch them here
}


//mi serve per il secondo sprint per dividere ordine in base a stato 
mostraOrdine();

function dividiOrdine(ordine){
  stampaPreparazione(ordine); 
  stampaInConsegna(ordine); 
  stampaConsegnato(ordine)
}
function stampaPreparazione(ordine){
  const ul = document.getElementById('ordine'); // Get the list 
  ul.textContent = '';
  let li = document.createElement('li');
  let span = document.createElement('span');
 let titoloStato = document.createElement('h3'); 
 titoloStato.textContent=' In preparazione: '
  ordine.forEach(piatto => {
    //creo una variabile in cui salvo questo piatto
   
      if(ordine.stato=='in preparazione'){
     
       let stato= document.createElement('stato'); 
       stato.herf = piatto.self; 
       stato.textContent=piatto.stato; 
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
        //cliccando questo bottone, il piatto viene rimosso dal carrello
     
       // Append all our elements
       
       span.append(img); 
       span.appendChild(stato); 
       span.appendChild(nome);   
       span.appendChild(desc);
      
       span.appendChild(pr); 
      
    
      }
      li.appendChild(span);
      ul.appendChild(li);
});         
}
function stampaInConsegna(ordine){

}
function stampaConsegnato(ordine){

}







