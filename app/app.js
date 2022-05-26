//Chiama il framework EXPRESS
const express = require('express');
const app = express();



//Consentono di leggere il body delle response
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//Gestisce i casi di errore
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
