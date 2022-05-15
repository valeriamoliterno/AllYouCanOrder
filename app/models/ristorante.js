var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const piatto= require('./models/piatto.js'); 
const tavolo= require('./models/tavolo.js'); 

module.exports = mongoose.model('Ristorante', new Schema({ 
    mail: String, 
    passwordHash: String, 
    tavoli: [tavolo], 
    menu: [piatto], 
    passwordManagerHash: String, 
}));
