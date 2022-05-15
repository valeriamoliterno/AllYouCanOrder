const express = require('express');
const app = express();




app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;