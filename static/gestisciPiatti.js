/**
 *   In questa pagina è presente lo script richiamato dal file gestisciPiatti.html
 * 
 *  Le funzioni qui riportate gestiscono la stampa a video del menu e l'eliminazione
 *  dei piatti tramite apposito pulsante
 */


/**
 * Funzione per mostrare a video i piatti presenti nel menu, che richiama le API del metodo GET 
 * per il modello Piatto 
 */
 mostraMenu();
 function mostraMenu() {
     
    const ul = document.getElementById('piatti'); 

    ul.textContent = '';

    fetch('../api/v1/piattos/')
    .then((resp) => resp.json()) 
    .then(function(data) { 
        
    console.log(data); //controllo
        
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
             let PiattoId = piatto._id; 
            
                                //piatto.self.substring(piatto.self.lastIndexOf('/') + 1);

                //stampa di controllo
                console.log("Sto eliminando + " + piatto._id);

                deletePiatto(piatto._id);

                function delay(time) {
                    return new Promise(resolve => setTimeout(resolve, time));
                }
                delay(500).then(() => mostraMenu());            
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
    var uriAPI = '../api/v1/piattos/'
    fetch(uriAPI, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id : idPiatto } ),
    })
    .then((resp) => {
        //stampa di controllo
        console.log(resp);
        return;
    })
    .catch( error => console.error(error) );
}