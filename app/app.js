const express = require('express');
const app = express();

const tavoli = require('./tavolos');
const piatti = require('./piattos');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

app.use('/',express.static(process.env.FRONTEND || 'static'));
app.use('/',express.static('static'));

app.use('/api/v1/tavoli', tavoli);
app.use('/api/v1/piatti', piatti);



module.exports = app;