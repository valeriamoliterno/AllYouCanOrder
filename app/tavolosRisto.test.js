const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo');

var idTavolo;
var token;
let pwM= 'admin';
  let pwE='nimda';
  let nomeTavolo='nome';

describe('', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(50000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    loggedUser.mail='sushi@risto.it';
    var ristorante= await Ristorante.findOne({mail: 'sushi@risto.it'});
    var tavolo = await Tavolo.findOne({nome: 'tavolo1'});
    if(!tavolo){
      let tavol = new Tavolo({nome: 'tavolo1'});
      tavol = await tavol.save();
      ristorante.tavoli.push(tavol);
      await ristorante.save(); 
      idTavolo=tavol._id;
    } else {
      idTavolo= tavolo._id;
    }
    // crea un token ben formato
    var payload = {
    mail: loggedUser.mail,
    id: '629e0ca56233e1cd00c0d57f'
    }
    var options = {
    expiresIn: 86400 // scade dopo 24 ore
    }
    token = jwt.sign(payload, "ChiaveDiCodifica", options);
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  

  /**
  *       User Story 13: Rimuovi Tavoli
  */

  //Test 13.1: Elimina tavolo senza mandare token
  test('Tentativo di eliminare tavolo senza mandare token => Error 401', async () => {
    const response= await request(app)
    .delete('/api/v1/tavoliRisto/eliminaTavolo/'+idTavolo+'/admin')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(401);
  });
  
  //Test 13.2: Elimina tavolo mandando token errato
  test('Tentativo di eliminare tavolo mandando token errato => Error 403', async () => {
    const response= await request(app)
    .delete('/api/v1/tavoliRisto/eliminaTavolo/'+idTavolo+ '/admin')
    .set('x-access-token', '12345')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);
  });

  //Test 13.3: Elimina tavolo mandando token corretto ma id errato
  test('Tentativo di eliminare tavolo mandando token corretto ma id errato => Error 404', async () => {
    const response= await request(app)
    .delete('/api/v1/tavoliRisto/eliminaTavolo/'+ '629ddeba6f68d612bc7b26dd/admin')
    .set('x-access-token', token)                                   
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(404);
  });

  //Test 13.4: Elimina tavolo mandando token corretto e id corretto
  test('Tavolo eliminato, token e id corretti => Stato 204', async () => {
    const response= await request(app)
    .delete('/api/v1/tavoliRisto/eliminaTavolo/'+idTavolo+'/admin')
    .set('x-access-token', token)
    .set('Content-Type', 'application/json')
    expect(response.statusCode).toBe(204);
  });

  //Test 13.5: Elimina tavolo mandando token corretto e id corretto ma password manager errata
  test('Tavolo eliminato, token e id corretti ma password manager errata => Stato 403', async () => {
    const response= await request(app)
    .delete('/api/v1/tavoliRisto/eliminaTavolo/'+idTavolo+'/admi')
    .set('x-access-token', token)
    .set('Content-Type', 'application/json')
    expect(response.statusCode).toBe(403);
  });

});