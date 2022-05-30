/*  Per chiamare il framework EXPRESS
 */
const express = require('express');
const app = express();

/* Importa il file piattos.js, in cui sono caricare le api "piattos"
 */
global.ilMioRistoranteID= '628a612bbe71304869cfb0fc'
global.ilMioTavoloID= '628a612bbe71304869cfb0fb'
const piattos= require('./piattos.js');
const tavol = require ('./tavolosRisto.js');
//const piattosCliente= require('./piattosCliente.js');
//const tavolosCliente = require ('./tavolosCliente.js');
//const idTav=require('./impostoTavolo');
/* Servono per poter leggere il body delle response
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Carica la pagina index.html all'apertura
 */
app.use('/', express.static('static'));

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

/*  le API utilizzate
 */
//app.use('/api/v1/impostaTavolo', idTav); //per passare il tavolo in cui è il cliente al posto del qr code
app.use('/api/v1/piattos/', piattos);
app.use('/api/v1/tavoliRisto', tavol);
//app.use('/api/v1/piattosCliente/', piattosCliente);
//app.use('/api/v1/tavoliCliente/', tavolosCliente);
/* gestisce i casi di errore
 */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
    console.log('404 not found');
});



module.exports = app;