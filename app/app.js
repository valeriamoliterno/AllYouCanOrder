const express = require('express');
const app = express();
global.ilMioTavolo = 'tav1'; //attualmente, il valore di questa variabile è stata modificata in carrell.js
global.ilMioRistoranteID= '628a612bbe71304869cfb0fc'
global.ilMioTavoloID= '628a612bbe71304869cfb0fb'
const piattos= require('./piattos.js');
const tavoli=require('./models/tavolo'); 
const ristorante = require ('./models/ristorante'); 
const carrelli= require('./svuotaCarrello'); 
const carrell= require('./carrell'); 
const ordine = require('./ordine');
const tavol = require ('./tavolos.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', express.static('static')); // expose also this folder


app.use('/api/v1/piattos', piattos);
app.use('/api/v1/svuotaCarrello',carrelli); 
app.use('/api/v1/mostraCarrello', carrell);
app.use('/api/v1/mostraOrdine', ordine);
app.use('/api/v1/tavoli', tavol)
/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;