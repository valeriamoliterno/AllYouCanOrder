/**
 *   In questa pagina è presente lo script richiamato dal file gestisciPiatti.html
 * 
 * 
 *  Le funzioni qui riportate gestiscono la stampa a video del menu e l'eliminazione
 *  dei piatti tramite apposito pulsante
 */


/**
 * Funzione per mostrare a video i piatti presenti nel menu, che richiama le API del metodo GET 
 * per il modello Piatto 
 */

//variabile in cui salviamo i dati dell'utente loggato (se lo è)
 var loggedUser={}
 salvaToken();
 
 //Con questa funzione prendiamo i dati dell'utente loggato, 
 //tra cui il token che ci serve per avere accesso alle risorse protette
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
         function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }
        delay(500).then(() => mostraMenu())
    })//dopo aver preso i dati dell'utente, chiama la funzione per stampare il menu sullo schermo
    .catch( error => console.error(error) );
}

/**
 * Questa funzione stampa il menu del ristorante
 */
async function mostraMenu() {
     
    const ul = document.getElementById('piatti'); 
    ul.textContent = '';
    var stato;
    fetch('../api/v1/piattosRisto/', {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' , 'x-access-token': loggedUser.token}})  //facciamo il controllo del token
    .then((resp) => {
        stato=resp.status;//salviamo lo stato della reponse per un controllo successivo
        return resp.json()
    }) 
    .then(function(data) { 
        //console.log(loggedUser.mail)
        if (stato===403 || stato===401){ //in caso ci sia un errore in autenticazione, si verrà riportati alla pagina d login
            window.open('/unlogged.html', '_self');
            return data;
        }  

        console.log("data: " + data); //controllo
       
        let titolo = document.getElementById('titolo');
        titolo.textContent="All You Can Order";
        let div = document.getElementById('div');
        let aggiungi = document.createElement('a');
        aggiungi.href="./aggiungiPiatto.html";
        aggiungi.textContent="Aggiungi un Piatto al menu";
        div.append(aggiungi);
        let labelMenu = document.getElementById('labelMenu');
        labelMenu.textContent="Menu:";

        return data.map(function(piatto) { 
            //Stampa di controllo
            console.log(piatto.nome);
            console.log(piatto._id);

            let li = document.createElement('li');
            let span = document.createElement('span');
            
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
           
            let elimina = document.createElement('button');
            elimina.onclick = function elimina(){ 
                //stampa di controllo
                console.log("Sto eliminando + " + piatto._id);

                deletePiatto(piatto._id);

                function delay(time) {
                    return new Promise(resolve => setTimeout(resolve, time));
                }
                delay(500).then(() => location.reload());            
            }
            elimina.textContent = 'Elimina'; 
            
            // Aggiungiamo tutti gli elementi
            span.append(img); 
            span.appendChild(nome);   
            span.appendChild(desc);
            span.appendChild(pr);  
           
            span.appendChild(elimina); 
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
   .then(()=>{
        function delay(time) {
           return new Promise(resolve => setTimeout(resolve, time));
       }
       delay(500).then(() => mostraMenu())
   })//dopo aver preso i dati dell'utente, chiama la funzione per stampare il menu sullo schermo
   .catch( error => console.error(error) );
}

/**
* Questa funzione stampa il menu del ristorante
*/
async function mostraMenu() {
    
   const ul = document.getElementById('piatti'); 
   ul.textContent = '';
   var stato;
   fetch('../api/v1/piattosRisto/', {
       method: 'GET', 
       headers: { 'Content-Type': 'application/json' , 'x-access-token': loggedUser.token}})  //facciamo il controllo del token
   .then((resp) => {
       stato=resp.status;//salviamo lo stato della reponse per un controllo successivo
       return resp.json()
   }) 
   .then(function(data) { 
       //console.log(loggedUser.mail)
       if (stato===403 || stato===401){ //in caso ci sia un errore in autenticazione, si verrà riportati alla pagina d login
           window.open('/unlogged.html', '_self');
           return data;
       }  

       console.log("data: " + data); //controllo
      
       let titolo = document.getElementById('titolo');
       titolo.textContent="All You Can Order";
       let div = document.getElementById('div');
       let aggiungi = document.createElement('a');
       aggiungi.href="./aggiungiPiatto.html";
       aggiungi.textContent="Aggiungi un Piatto al menu";
       div.append(aggiungi);
       let labelMenu = document.getElementById('labelMenu');
       labelMenu.textContent="Menu:";

       return data.map(function(piatto) { 
           //Stampa di controllo
           console.log(piatto.nome);
           console.log(piatto._id);

           let li = document.createElement('li');
           let span = document.createElement('span');
           
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
          
           let elimina = document.createElement('button');
           elimina.onclick = function elimina(){ 
               //stampa di controllo
               console.log("Sto eliminando + " + piatto._id);

               deletePiatto(piatto._id);

               function delay(time) {
                   return new Promise(resolve => setTimeout(resolve, time));
               }
               delay(500).then(() => location.reload());            
           }
           elimina.textContent = 'Elimina'; 
           
           // Aggiungiamo tutti gli elementi
           span.append(img); 
           span.appendChild(nome);   
           span.appendChild(desc);
           span.appendChild(pr);  
           span.appendChild(elimina); 
           li.appendChild(span);
           ul.appendChild(li);
       })
   })
   .catch( error => console.error(error) );
   
}


/**
* Funzione per eliminare il piatto selezionato, che richiama le API del metodo DELETE 
* per il modello Piatto 
*/
async function deletePiatto(idPiatto){
   console.log("deletePiatto ID")
   console.log(idPiatto); 
   var pwmanager=VerificaPwd();
   var uriAPI = '../api/v1/piattosRisto/eliminaPiatto/' + idPiatto
   fetch(uriAPI, {
       method: 'DELETE',
       headers: { 'Content-Type': 'application/json', 'x-access-token': loggedUser.token},//passiamo il token al metodo
       body: JSON.stringify( { managerpwd: pwmanager } ),
    })
   .then((resp) => {
       //stampa di controllo
       console.log(resp);
       return;
   })
   .catch( error => console.error(error) );
}