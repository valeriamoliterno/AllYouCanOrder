/**
 *   In questa pagina è presente lo script richiamato dal file gestisciTavoli.html
 * 
 *  Le funzioni qui riportate gestiscono la stampa a video del menu e l'eliminazione
 *  dei tavoli tramite apposito pulsante 
 * 
 * In questa sezione è stata aggiunta la funzione "inserisciTavolo" che inizialmente 
 * era in un file separato
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
         loggedUser.mail=user.ristoMail;
         loggedUser.id= user.ristoId;
         loggedUser.self=user.ristoSelf; 
         //stampe di controllo 
         console.log('Chiamata salvaToken() ***********************');
         console.log('Token: '+ loggedUser.token);
         
     })
     .then(()=>listaTavoli()) //dopo aver preso i dati dell'utente, chiama la funzione per stampare i tavoli e gli ordini sullo schermo
     .catch( error => console.error(error) );
}

/**
 * Questa funzione viene chiamata cliccando sul bottone "Inserisci".
 * Crea un nuovo tavolo e gli conferisce un nome
 */
 function inserisciTavolo()
 {
     var tableName = document.getElementById("tableName").value;
     var status;
     console.log(tableName);
     var pwmanager = VerificaPwd();
     let msg=document.getElementById("messaggio");
 
     fetch("../api/v1/tavoliRisto/aggiungiTavolo/" + tableName + '/' + pwmanager, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'x-access-token': loggedUser.token}, //facciamo il controllo del token
     })
     .then((resp) => {
        status=resp.status; //salviamo lo stato della reponse per un controllo successivo
        if (status===403 || status===401){ //in caso ci sia un errore in autenticazione, si verrà riportati alla pagina di login
            window.open('/unlogged.html', '_self');
            return data;
        }
        console.log(resp);
        listaTavoli();
        return;
     })
     .catch( error => {  console.error(error) } ); 
 
 };


//questa funzione mi consente di visualzzare la lista dei tavoli
function listaTavoli() {
     
    const ul = document.getElementById('tavoli'); 
    ul.textContent = '';

    var status;

    fetch('../api/v1/tavoliRisto/', {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' , 'x-access-token': loggedUser.token}}) //facciamo il controllo del token
        .then((resp) => {
      status=resp.status; //salviamo lo stato della reponse per un controllo successivo
       return resp.json()
    })
    .then(function(data) { 

        if (status===403 || status===401){ //in caso ci sia un errore in autenticazione, si verrà riportati alla pagina di login
            window.open('/unlogged.html', '_self');
            return data;
        }

        return data.map(function(tavolo) { 
           console.log(tavolo.id);

            let li = document.createElement('li');
            let span = document.createElement('span');
            
            let nome = document.createElement('nome');
           // nome.href = tavolo.self;
            nome.textContent = tavolo.nome; 
           
            let elimina = document.createElement('button');
            elimina.onclick = ()=>eliminaTavolo(tavolo.id);
            /*function elimina(){ 
             let TavoloId = tavolo._id; 
                eliminaTavolo(tavolo._id);
            }*/
            elimina.textContent = 'Elimina'; 
            
            span.appendChild(nome);  
            span.appendChild(elimina); 
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );
    
}


//questa funzione mi consente di eliminare un tavolo presente nella lista
async function eliminaTavolo(tavoloId){
    console.log("elimino tavolo"+ tavoloId)
    var pwmanager=VerificaPwd();
    var uriAPI = '../api/v1/tavoliRisto/eliminaTavolo/' + tavoloId + '/' + pwmanager;
    fetch(uriAPI, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-access-token': loggedUser.token}, //passiamo il token al metodo },
    })
    .then((resp) => {
        console.log(resp);
        listaTavoli();
        return;
    })
    .catch( error => console.error(error) );
}  