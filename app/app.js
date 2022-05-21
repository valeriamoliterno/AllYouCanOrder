const express = require('express');
const app = express();
const piattos= require('./piattos.js');
const tavoli=require('./models/tavolo'); 
const ristorante = require ('./models/ristorante'); 
const tavolos= require('./tavolos'); 
const carrell= require('./carrell'); 
const ordine = require('./ordine');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', express.static('static')); // expose also this folder


app.use('/api/v1/piattos', piattos);
app.use('/api/v1/tavolos', tavolos); 
app.use('/api/v1/mostraCarrello', carrell);
app.use('/api/v1/mostraOrdine', ordine);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;