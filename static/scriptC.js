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
console.log('stato: '+stato+' stato futuro: '+statoF);

/**
 * Questa funzione carica i piatti per tavolo nello stato desiderato
 */
function loadOrders(){
  const tableList = document.getElementById("tl"); // Trovo la parte dove verranno mostrati i tavoli
  var html=''; // buffer per poi mostrare i piatti

  fetch('../api/v1/tavoli') // Effettuo una chiamata API per trovare la lista dei tavoli
  .then((resp) => resp.json()) 
  .then(function(data) {
  
    return data.map(function(tavolo) { 
      html=''; // resetto il buffer per aggiungere i piatti per ogni tavolo
      tableList.innerHTML='<div class="table"><h2>'+tavolo.nome+'</h2><ul class="platelist" id="pl:'+tavolo.id+'"></ul></div>';
      var plateList = document.getElementById("pl:"+tavolo.id);// Trovo la parte dove verranno mostrati i piatti del tavolo attuale

      fetch('../api/v1/piatti/ordineTavolo/'+tavolo.id) // Effettuo una chiamata API per trovare i piatti nell'ordine di un determinato tavolo
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
      .catch(error => console.error(error));
    })
  })
  .catch( error => console.error(error) );

  
  return;
}

loadOrders();

function changeState(btn){
  const idP=btn.id;

  fetch('../api/v1/piatti/cambiaStato',{
    method: 'POST',
    headers:{ 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: idP,
      stato: statoF
    })
  })
  .then((resp) => {
    loadOrders();
    return;
  })
  .catch( error => console.error(error) );
}