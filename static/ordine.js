

/************************************************
 *   FUNZIONE PER VEDERE I PIATTI NELL'ORDINE   *
 ************************************************/

 function mostraOrdine(){
  const ul = document.getElementById('ordine'); // Get the list 
  ul.textContent = '';
     fetch('../api/v1/mostraOrdine')
     .then((resp) => resp.json()) // Transform the data into json
     .then(function(data) { // Here you get the data to modify as you please
     var ordine= data.ordine;       
     
     //per ogni elemento in carrello eseguo la seguente funzione, che è simile a quella di mostraMenu(). 
     
      return ordine.forEach(piatto => {
          //creo una variabile in cui salvo questo piatto
            
             let li = document.createElement('li');
             let span = document.createElement('span');
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
            
             li.appendChild(span);
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







