/**
 *  Per chiamare il framework EXPRESS
 */
const express = require('express');
const app = express();

/**
 * Importa il file piattos.js, in cui sono caricare le api "piattos"
 */
const piattos= require('./piattos.js');

/**
 * Servono per poter leggere il body delle response
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Carica la pagina index.html all'apertura
 */
app.use('/', express.static('static'));

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

/**
 *  le API utilizzate
 */
app.use('/api/v1/piattos/', piattos);


/**
 * gestisce i casi di errore
 */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;