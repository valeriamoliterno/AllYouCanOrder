

/************************************************
 *   FUNZIONE PER VEDERE I PIATTI NELL'ORDINE   *
 ************************************************/

 function mostraOrdine(){
  //i piatti vengono divisi in base al loro stato, qui prendo gli elementi dall'HTML
  const piattiConsegna = document.getElementById('inConsegna');
  const piattiPreparazione = document.getElementById('inPreparazione'); 
  const piattiConsegnati = document.getElementById('consegnato');
  const chiama= document.getElementById('chiamaCameriere');
  //la frase per il cameriere viene mostrata solo se tavolo.chiamato==true
  var x = document.getElementById("fraseCameriere");
  //controllo se tavolo.chiamato==true, se è così, mostro la frase e disabilito il pulsante.
  fetch('../api/v1/tavoliCliente/ilMioTavolo') 
  .then((resp) => resp.json()) 
  .then(function(dataC) {
          if(dataC.chiamato==true){
          chiama.disabled='true'; 
          x.style.display = "block";
      }else{
          chiama.enable='true';
          x.style.display = "none";
      }

  })
     fetch('../api/v1/tavoliCliente/ordine')
     .then((resp) => resp.json()) 
     .then(function(data) {
     var ordine= data.ordine;       
     const tvNum= document.getElementById('tvNum');
     tvNum.textContent=data.nome;
     
     //per ogni elemento in carrello eseguo la seguente funzione, che è simile a quella di mostraMenu(). 
     
      return ordine.forEach(piatto => {
      
              //CREO LA TABELLA IN CUI SALVARE DA UNA PARTE L'IMMAGINE DEL PIATTO E DALL'ALTRA LE SUE CARATTERISTICHE
              let li = document.createElement('li');
              let tabella = document.createElement('table');
              tabella.className='piattiOrdine'; 
              let tblBody = document.createElement("tbody")
              var row = document.createElement("tr");
              var cellsx = document.createElement("td");
              var celldx = document.createElement("td");
              cellsx.className='sinistraOrdine'; 
              celldx.className='destraOrdine'; 
              let contenutoTab = document.createElement('span'); //contenuto cella dx
  
              //CARATTERISTICHE DEL PIATTO
              let nome = document.createElement('nome');
              nome.href = piatto.self;
              nome.textContent = piatto.nome; 
              let img = document.createElement('img'); 
              img.className='piattoOrdine'
              img.src=piatto.foto;
            //  let desc = document.createElement('descrizione'); 
             // desc.herf = piatto.self; 
             // desc.textContent= piatto.descrizione; 
              let pr=document.createElement('prezzo'); 
               pr.herf=piatto.self; 
               pr.textContent= piatto.prezzo + ' €'; 

              //CREO PLATE, CHE SOSTANZIALMENTE RACCHIUDE TUTTI GLI ELEMENTI DI PIATTO, INCLUSO STATO E LA TABELLA SOPRASTANTE
              let plate= document.createElement('div');
              plate.className ='piattoOrdine'; 
              if(piatto.stato=='consegnato'){
                plate.className='piattoConsegnato';
              }else {
                plate.className='piattoOrdine'; 
              }

              cellsx.appendChild(img);
              contenutoTab.appendChild(nome);
           //   contenutoTab.appendChild(desc);
              contenutoTab.appendChild(pr); 
              celldx.appendChild(contenutoTab);
              row.appendChild(cellsx);
              row.appendChild(celldx); 
              tblBody.appendChild(row); 
              tabella.appendChild(tblBody); 
              plate.appendChild(tabella);
              //PER MENU E CARRELLO, ELIMINO STATO E FACCIO PLATE.APPENDCHILD(BOTTONE)
              li.appendChild(plate);
           
             if(piatto.stato=='in consegna'){
              piattiConsegna.appendChild(li)
            }else if(piatto.stato == 'in preparazione'){
              piattiPreparazione.appendChild(li);
            }else if(piatto.stato=='consegnato'){
              piattiConsegnati.appendChild(li);
            }
             
      });  
      
     
    })

    .catch( error => console.error(error) );// If there is any error you will catch them here
}


//mi serve per il secondo sprint per dividere ordine in base a stato 
mostraOrdine();









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

