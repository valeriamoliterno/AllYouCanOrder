/*codice CHE SERVE PER STAMPARE L'ELENCO DEI TAVOLI DEL RISTORANTE PER LA SEZIONE DI TESTING */

function mostraTavoli(){
    
    const ul = document.getElementById('tavoli'); 
    ul.textContent = '';
    fetch('../api/v1/tavoliCliente/listaTavoli') 
    .then((resp) => resp.json()) 
    .then(function(dat) { 
   
        const tavolo=dat.tavoli; 

    return tavolo.forEach(tavolo => {
   
        console.log(tavolo);
            let li = document.createElement('li');
            li.className='tavolo'; 
            let table= document.createElement('a');
            table.className='tavolo';
            table.textContent = tavolo.nome; 
            table.onclick= ()=>vaiAlTavolo(tavolo); 
  
            li.appendChild(table);
            ul.appendChild(li);
            
        })
    })
    .catch( error => console.error(error) );
}
mostraTavoli(); 


//funzione che ti porta alla pagina del tavolo desiderato
function vaiAlTavolo(tavolo){
 fetch('../api/v1/impostaTavolo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( {id:tavolo._id} ),
})
.then((resp) => {
    console.log(resp);       
    return;
    
})
.catch( error => console.error(error) ); 

window.location.href='menu.html'
}