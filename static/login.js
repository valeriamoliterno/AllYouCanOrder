/**
  * Questa funzione richiama il metodo POST in authentication.js 
  * e genera un token per l'utente. Inoltre stampa a video il messaggio
  * inviato da metodo POST. Se l'operazione di login avviene con
  * successo, si verrà reindirizzati nella pagina principale della
  * sezione ristorante
*/
function login(){
    //salvo la mail e password presi in input dall'utente
    var mail = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    let msg=document.getElementById("messaggio");
    msg.style.color="black";
     
    fetch('../api/v1/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { mail: mail, password: stringToHash(password) } ), //salviamo la password in hash per maggiore sicurezza
    })
    .then((resp) => resp.json()).then((data) => {
        if(data.successo === true){  //controllo che l'operazione sia riuscita con successo
            console.log("login() andato a buon fine");
            msg.style.color="black";
            function delay(time) {
                return new Promise(resolve => setTimeout(resolve, time));
            }
            delay(1800).then(() => window.open("./index.html", "_self"));
        
        } else { //gestisco il caso in cui le credenziali fossero sbagliate o assenti
            //per il messaggio di errore, cambio il colore in rosso per renderlo più evidente
            msg.style.color="red";
            console.log("login() non andato a buon fine")
        }
        msg.textContent=data.messaggio;    
        //stampa di controllo
        console.log("login() fine")
        return;
    })
    .catch( error => console.error("errorino: "+ error) ); //Stampo il messaggio di errore per capire meglio dove si verifica
};


/**
 * Ritorna il valore hash della stringa passata
 */
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