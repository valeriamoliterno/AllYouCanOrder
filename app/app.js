/*  Per chiamare il framework EXPRESS
 */
const express = require('express');
const app = express();

/* Importa il file piattos.js, in cui sono caricare le api "piattos"
 */
global.ilMioRistoranteID= '6295011922da57ae0fee2718'
global.ilMioTavoloID= '629715ffe86e996e2f47ff5c'

//variabile globale in cui salviamo i dati dell'utente che ha fatto login con successo
global.loggedUser = {
    token: String,
    mail: String,
 };

const piattosRisto= require('./piattosRisto.js');
const piattosCliente= require('./piattosCliente.js');
const tavolosCliente = require ('./tavolosCliente.js');
const tavolosRisto = require ('./tavolosRisto.js');
const rist = require('./ristorantes')
const auth = require ('./authentication.js');
const tokenChecker = require ('./tokenChecker.js');
const idTav=require('./impostoTavolo');
const impostaRistorante = require('./impostoRistorante')
/**
 * Servono per poter leggere il body delle response
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Carica la pagina index.html all'apertura
 */
app.use('/', express.static('static'));
app.use('/',express.static('img'));


app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

/*  le API utilizzate
 */

//queste API sono libere da vincolo di login
app.use('/api/v1/auth', auth);
app.use('/api/v1/token', auth);
app.use('/api/v1/tavoliCliente/', tavolosCliente);
app.use('/api/v1/piattosCliente/', piattosCliente);
app.use('/api/v1/ristoranti', rist);
app.use('/api/v1/impostaRistorante', impostaRistorante);
app.use('/api/v1/impostaTavolo', idTav);

//tutte le API dichiarate sotto questa riga avranno bisogno di un login effettuato con successo per poter essere chiamate
app.use('', tokenChecker);

app.use('/api/v1/piattosRisto/', piattosRisto);
app.use('/api/v1/tavoliRisto', tavolosRisto);

/**
 * gestisce i casi di errore
 */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
    console.log('404 not found');
});



module.exports = app;