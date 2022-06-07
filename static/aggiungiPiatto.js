/**
 * Script richiamato dal file aggiungiPiatto.html
 * 
 * Questa funzione gestisce l'input ricevuto dal form e richiama le 
 * API del metodo POST per il modello Piatto, passando i valori ricevuti 
 * come body della response
 */

//variabile in cui salviamo i dati dell'utente loggato (se lo è)
 var loggedUser={}
 salvaToken();
 
 //Con questa funzione prendiamo i dati dell'utente loggato, tra cui il token che ci serve per avere accesso alle risorse protette
 function salvaToken(){
     fetch('../api/v1/token/')
     .then((resp) => resp.json()) // trasformo i dati in json
     .then(function(user){
         loggedUser.token=user.token;
         loggedUser.mail=user.mail;
         loggedUser.id= user.id;
         loggedUser.self=user.self;  
         //stampe di controllo 
         console.log('Chiamata salvaToken() ***********************');
         console.log('Token: '+ loggedUser.token);
         
     })
     .catch( error => console.error(error) );
 }


function aggiungi()
{ 
   var nomePiatto= document.getElementById('nomePiatto').value;
   var prezzo= document.getElementById('prezzo').value;
   var descrizione= document.getElementById('descrizione').value;
   var foto= document.getElementById('foto').value;
   var pwmanager=VerificaPwd();
   

   //Stampe di controllo di correttezza dei dati
   console.log(nomePiatto);
   console.log(prezzo);
   console.log(descrizione);
   console.log(foto);

   if (nomePiatto === "" || prezzo === ""){
       document.getElementById('messaggio').textContent='Nome e Prezzo sono campi obbligatori. Inseriscili e riprova'
   } else if (prezzo < 0){
       document.getElementById('messaggio').textContent='Il prezzo non può essere negativo'
   } else if (isNaN(prezzo)){
       document.getElementById('messaggio').textContent='Il prezzo deve avere valore numerico'
   } else {   
       fetch('../api/v1/piattosRisto/aggiungiPiatto/', {
          method: 'POST',
           headers: { 'Content-Type': 'application/json', 'x-access-token': loggedUser.token}, //facciamo il controllo del token
           body: JSON.stringify({ 
               nome: nomePiatto, 
               prezzo: prezzo, 
               descrizione: descrizione, 
               foto: foto,
               managerpwd: pwmanager,
          }),
       })
       .then((resp) => {
           const stato=resp.status; //salviamo lo stato della reponse per un controllo successivo
           if (stato===401 || stato===403){ //in caso ci sia un errore in autenticazione, si verrà riportati alla pagina di login
               window.open('/unlogged.html', '_self');
           }
           console.log(resp);
           window.open('/gestisciPiatti.html', '_self');
           return;
       })
       .catch( error => console.error(error) );
   }
};