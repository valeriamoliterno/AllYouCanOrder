/**
 *  Per chiamare il framework EXPRESS
 */
const express = require('express');
const app = express();

<<<<<<< HEAD
/**
 * Importa il file piattos.js, in cui sono caricare le api "piattos"
 */
global.ilMioRistoranteID= '628a612bbe71304869cfb0fc'
global.ilMioTavoloID= '628a612bbe71304869cfb0fb'
const piattos= require('./piattos.js');
const carrelli= require('./svuotaCarrello'); 
const carrell= require('./carrell'); 
const ordine = require('./ordine');
const tavol = require ('./tavolos.js');
/**
 * Servono per poter leggere il body delle response
 */
=======
const tavoli = require('./tavolos');
const piatti = require('./piattos');



>>>>>>> feature-camerieri-cuochi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Carica la pagina index.html all'apertura
 */
app.use('/', express.static('static'));

<<<<<<< HEAD
=======
app.use('/',express.static('static'));
app.use('/',express.static('img'));


>>>>>>> feature-camerieri-cuochi
app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})
<<<<<<< HEAD
=======

app.use('/api/v1/tavoli', tavoli);
app.use('/api/v1/piatti', piatti);

>>>>>>> feature-camerieri-cuochi

/**
 *  le API utilizzate
 */
app.use('/api/v1/piattos/', piattos);
app.use('/api/v1/svuotaCarrello',carrelli); 
app.use('/api/v1/mostraCarrello', carrell);
app.use('/api/v1/mostraOrdine', ordine);
app.use('/api/v1/tavoli', tavol)

/**
 * gestisce i casi di errore
 */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
    console.log('404 not found');
});




module.exports = app;