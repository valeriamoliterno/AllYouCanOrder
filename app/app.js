const express = require('express');
const app = express();

const tavoli = require('./tavolos');
const piatti = require('./piattos');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/',express.static(process.env.FRONTEND || 'static'));
app.use('/',express.static('static'));

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use('/api/v1/tavoli', tavoli);
app.use('/api/v1/piatti', piatti);


/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
    console.log('404 not found');
});




module.exports = app;