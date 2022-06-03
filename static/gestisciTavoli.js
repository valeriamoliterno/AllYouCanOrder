
/**
 * Questa funzione viene chiamata cliccando sul bottone "Inserisci".
 * Crea un nuovo tavolo e gli conferisce un nome
 */
 function inserisciTavolo()
 {
     var tableName = document.getElementById("tableName").value;
 
     console.log(tableName);
 
     fetch("../api/v1/tavoliRisto", {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify( { nome: tableName } ),
     })
     .then((resp) => {
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

    fetch('../api/v1/tavoliRisto/')
    .then((resp) => resp.json()) 
    .then(function(data) { 

        return data.map(function(tavolo) { 
           console.log(tavolo.id);

            let li = document.createElement('li');
            let span = document.createElement('span');
            
            let nome = document.createElement('nome');
           // nome.href = tavolo.self;
            nome.textContent = tavolo.nome; 
           
            let elimina = document.createElement('button');
            elimina.onclick = ()=>eliminaTavolo(tavolo.id);
            
            elimina.textContent = 'Elimina'; 
            
            span.appendChild(nome);    
            span.appendChild(elimina); 
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );
    
}listaTavoli();


//questa funzione mi consente di eliminare un tavolo preseente nella lista
async function eliminaTavolo(tavoloId){
    console.log("elimino tavolo "+ tavoloId)
    var uriAPI = '../api/v1/tavoliRisto/eliminaTavolo'
    fetch(uriAPI, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id : tavoloId } ),
    })
    .then((resp) => {
        console.log(resp);
        listaTavoli();
        return;
    })
    .catch( error => console.error(error) );
}