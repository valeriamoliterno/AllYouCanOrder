/*codice CHE SERVE PER STAMPARE L'ELENCO DEI TAVOLI DEL RISTORANTE PER LA SEZIONE DI TESTING */

function mostraRisto(){
    
    const ul = document.getElementById('tavoli'); 
    ul.textContent = '';
  
    fetch('../api/v1/impostaRistorante') 
    .then((resp) => resp.json()) 
    .then(function(dat) { 
        console.log("sono in risto")
    console.log(dat); 
    return dat.forEach(ristorante => {
   
        console.log(ristorante);
            let li = document.createElement('li');
            li.className='tavolo'; 
            let risto= document.createElement('a');
            risto.className='tavolo';
            risto.textContent = ristorante.mail; 
            risto.onclick= ()=>vaiAlRistorante(ristorante); 
  
            li.appendChild(risto);
            ul.appendChild(li);
            
        })
    })
    .catch( error => console.error(error) );
}
mostraRisto(); 


//funzione che ti porta alla pagina del tavolo desiderato
function vaiAlRistorante(ristorante){
    
 fetch('../api/v1/impostaRistorante', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( {id: ristorante.id} ),
})
.then((resp) => {
    console.log(resp);       
    return;
    
})
.catch( error => console.error(error) ); 

window.location.href='stampaTavoli.html'
}