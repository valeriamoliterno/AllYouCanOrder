/**
 * Script richiamato dai file camerieri.html e cuochi.html
 * 
 * 
 **/



// if per controllare se ci troviamo nella pagina del cameriere o del cuoco e cambia lo stato da visualizzare
var stato;
var btnT;
var statoF;
if(document.body.id=='cameriere'){ // se è un cameriere visualizza i piatti in stato di consegna
  stato='in consegna';
  btnT='Consegnato';
  statoF='consegnato';
}
else if(document.body.id=='cuoco'){ // se è un cuoco visualizza i piatti in stato di preparazione
  stato='in preparazione';
  btnT='Pronto';
  statoF='in consegna';
}

//variabile in cui salviamo i dati dell'utente loggato (se lo è)
var loggedUser={}
 salvaToken();

//Con questa funzione prendiamo i dati dell'utente loggato, tra cui il token che ci serve per avere accesso alle risorse protette
 function salvaToken(){
     fetch('../api/v1/token/')
     .then((resp) => resp.json()) // trasformo i dati in json
     .then(function(user){
         loggedUser.token=user.token;
         loggedUser.mail=user.ristoMail;
         loggedUser.id= user.ristoId;
         loggedUser.self=user.ristoSelf; 
         //stampe di controllo 
         console.log('Chiamata salvaToken() ***********************');
         console.log('Token: '+ loggedUser.token);
         
     })
     .then(()=>{
       const interval = setInterval(loadOrders(), 30000);
      }) //dopo aver preso i dati dell'utente, chiama la funzione per stampare i tavoli e gli ordini sullo schermo
     .catch( error => console.error(error) );
}



/**
 * Questa funzione carica i piatti per tavolo nello stato desiderato
 */
function loadOrders(){
  const tableList = document.getElementById("tl"); // Trovo la parte dove verranno mostrati i tavoli
  tableList.innerHTML="";
  var html=''; // buffer per poi mostrare i piatti

  var status;
    fetch('../api/v1/tavoliRisto/', {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' , 'x-access-token': loggedUser.token}}) //facciamo il controllo del token
    .then((resp) => {
      status=resp.status; //salviamo lo stato della reponse per un controllo successivo
       return resp.json()
    }) 
  .then(function(data) {
    console.log(data);

    if (status===403 || status===401){ //in caso ci sia un errore in autenticazione, si verrà riportati alla pagina di login
      window.open('/unlogged.html', '_self');
      return data;
    }
    return data.map(function(tavolo) { 
      chiamato=''; 
      console.log(tavolo.id);
      if(stato=='in consegna' && tavolo.chiamato){
        chiamato='<button id="rispondiChiamata" class="rispondiChiamata" onclick="rispondiChiamata(this)">&#128276</button>';
      }
      tableList.innerHTML=tableList.innerHTML + '<div class="table box" id="t:'+tavolo.id+'"><h2>'+tavolo.nome+'</h2>'+chiamato+'<ul class="platelist"></ul></div>';
      var plateList = document.getElementById("t:"+tavolo.id).lastChild;// Trovo la parte dove verranno mostrati i piatti del tavolo attuale
      
    
      fetch('../api/v1/piattosRisto/ordineTavolo/'+tavolo.id, {
        method: 'GET', 
        /**Effettuo una chiamata API per trovare i piatti nell'ordine di un determinato tavolo
         * e passo il token nell'header 
         */
        headers: { 'Content-Type': 'application/json' , 'x-access-token': loggedUser.token}
      })
      .then((resp)=> resp.json())
      .then(function(datap) {
        console.log(datap);
        datap.map(function(piatto){
          if(piatto.stato.localeCompare(stato) == 0){ // se il piatto è nello stato interessato alla pagina viene mostrato
            
            var plateList = document.getElementById("t:"+tavolo.id).lastChild;// Trovo la parte dove verranno mostrati i piatti del tavolo attuale
            plateList.innerHTML=plateList.innerHTML+'<li class="plate clearfix"><img src="'+piatto.foto+'"><h4>'+piatto.nome+'</h4><a onclick="changeState(this)" id="'+piatto.id+'" class="button">'+btnT+'</a></li>';
          }
        })
        return;
      })
      .catch(error => console.error(error));
    })
  })
  .catch( error => console.error(error) );

  return;
}


/**
 * Questa funzione cambia lo stato di un piatto 
 */
function changeState(btn){
  const idP=btn.id; // Trovo l'id del piatto nell'id del bottone
  const idT=btn.parentElement.parentElement.parentElement.id.substring(2); // Trovo l'id del Tavolo dell'id del elemento UL che è il secondo parent del bottone

  fetch('../api/v1/piattosRisto/cambiaStato',{ // Effettuo una chiamata API per cambiare lo stato del piatto
    method: 'POST',
    headers:{ 'Content-Type': 'application/json' , 'x-access-token': loggedUser.token}, // passiamo il token al metodo
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

function rispondiChiamata(btn){
  let idT=btn.parentElement.id.substring(2);
  console.log('----------- rispondi chiamata id tavolo --------------');
  console.log(idT);
  fetch('../api/v1/tavoliRisto/rispondiChiamata', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' , 'x-access-token': loggedUser.token },
     body: JSON.stringify({
       id: idT
     })
  })
  .then((resp) => {
      console.log(resp);
      loadOrders();
      return;
      
  })
  .catch( error => console.error(error) ); 
 
}