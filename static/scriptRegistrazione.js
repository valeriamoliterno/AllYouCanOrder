/**
 * Script richiamato dal file ristorante.html
 * 
 * Questa funzione gestisce l'input ricevuto dal form e richiama le 
 * API del metodo POST per il modello Ristorante, passando i valori ricevuti 
 * come body della response
 */

 function aggiungiRistorante()
 { 
     var email= document.getElementById('email').value;
     var password= document.getElementById('password').value;
     var passwordManager= document.getElementById('passwordManager').value;
     
 
     //Stampe di controllo di correttezza dei dati

     console.log('Dati della form per la Registrazione : ');
     console.log(email);
     console.log(password);
     console.log(passwordManager);
 
     fetch('../api/v1/ristoranti/', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify( { mail: email, password: password, passwordManager: passwordManager } ),
     })
     .then((resp) => {
        //stampa di controllo della response

        console.log('------------- Response ----------------');
        console.log(resp);
        

         if(resp.status===400){
             document.getElementById('error').innerHTML=resp.json().error;
             return false;
         }
         else{
            fetch('../api/v1/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { mail: email, password: stringToHash(password) } ), //salviamo la password in hash per maggiore sicurezza
            })
            window.open('index.html', '_self');
            return true;
         }
     })
     .catch( error => console.error(error) );
 
 };

 function stringToHash(string) {
                  
    var hash = 0;
      
    if (string.length == 0) return hash;
      
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
      
    return hash;
}