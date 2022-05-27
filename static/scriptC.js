// if per controllare se ci troviamo nella pagina del cameriere o del cuoco e cambia lo stato da visualizzare
var stato;
var btnT;
var statoF;
if(document.body.id=='cameriere'){ // se è un cameriere visualizza i piatti in stato di consegna
  stato='in consegna';
  btnT='Consegnato';
  statoF='conseganto';
}
else if(document.body.id=='cuoco'){ // se è un cuoco visualizza i piatti in stato di preparazione
  stato='in preparazione';
  btnT='Pronto';
  statoF='in consegna';
}



/**
 * Questa funzione carica i piatti per tavolo nello stato desiderato
 */
function loadOrders(){
  const tableList = document.getElementById("tl"); // Trovo la parte dove verranno mostrati i tavoli
  var html=''; // buffer per poi mostrare i piatti

  fetch('../api/v1/tavoli') // Effettuo una chiamata API per trovare la lista dei tavoli
  .then((resp) => resp.json()) 
  .then(function(data) {
    console.log(data);
    return data.map(function(tavolo) { 
      html=''; // resetto il buffer per aggiungere i piatti per ogni tavolo
      console.log(tavolo.id);
      tableList.innerHTML='<div class="table"><h2>'+tavolo.nome+'</h2><ul class="platelist" id="pl:'+tavolo.id+'"></ul></div>';
      var plateList = document.getElementById("pl:"+tavolo.id);// Trovo la parte dove verranno mostrati i piatti del tavolo attuale
      
      function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      delay(500).then(() => 
      fetch('../api/v1/piattos/ordineTavolo/'+tavolo.id) // Effettuo una chiamata API per trovare i piatti nell'ordine di un determinato tavolo
      .then((resp)=> resp.json())
      .then(function(datap) {
        console.log(datap);

        datap.map(function(piatto){
          
          if(piatto.stato.localeCompare(stato) == 0){ // se il piatto è nello stato interessato alla pagina viene mostrato
            html=html+'<li class="plate clearfix"><img src="'+piatto.foto+'"><h4>'+piatto.nome+'</h4><a onclick="changeState(this)" id="'+piatto.id+'" class="button">'+btnT+'</a></li>';
          }
        })
        plateList.innerHTML=html; // Stampo i piatti
        return;
      })
      .catch(error => console.error(error)));
    })
  })
  .catch( error => console.error(error) );
  
  return;
}

loadOrders();

function changeState(btn){
  const idP=btn.id; // Trovo l'id del piatto nell'id del bottone
  const idT=btn.parentElement.parentElement.id.substring(3); // Trovo l'id del Tavolo dell'id del elemento UL che è il secondo parent del bottone

  fetch('../api/v1/piattos/cambiaStato',{ // Effettuo una chiamata API per cambiare lo stato del piatto
    method: 'POST',
    headers:{ 'Content-Type': 'application/json' },
    body: JSON.stringify({ // passo bel body 
      idP: idP, // id Piatto
      idT: idT, // id Tavolo
      stato: statoF // Stato in cui cambiare
    })
  })
  .then((resp) => {
    loadOrders(); // alla fine ricarico gli ordini
    return;
  })
  .catch( error => console.error(error) );
}