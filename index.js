const app = require('./app/app.js');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT|| 3000;

console.log(process.env.DB_URL);
//mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority')
mongoose.connect(process.env.DB_URL)
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});
