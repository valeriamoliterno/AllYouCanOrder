const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');

var idTavolo='6293a6f9271b1efce4efbe82';
var token;

describe('Test delle api: /api/v1/piattosRisto', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(50000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    loggedUser.mail='vivaLaPasta@carbonara.com';
    // Creo un token
    var payload = {
      mail: loggedUser.mail,
      id: '62971bf5f6d21ae1a617eecd'
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
  *      User Story 1:"Consegna"
  */

  // Test 1.1: Stampa della pagina 'Camerieri' senza token
  test('Tenta la stampa della pagina dei Camerieri senza token => Errore 401', async () => {
    const response= await request(app)
    .get('/api/v1/piattosRisto/ordineTavolo/'+ idTavolo)
    expect(response.statusCode).toBe(401);
  });

  // Test 1.2: Stampa della pagina 'Camerieri' con token errato
  test('Tenta la stampa della pagina dei Camerieri con token errato => Errore 403', async () => {
    const response= await request(app)
    .get('/api/v1/piattosRisto/ordineTavolo/'+ idTavolo)
    .set('x-access-token', '12345')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);
  });
  
  // Test 1.3: Stampa della pagina 'Camerieri' con token corretto
  test('Stampa la pagina dei Camerieri con token corretto => Stato 200', async () => {
    const response= await request(app)
    .get('/api/v1/piattosRisto/ordineTavolo/'+ idTavolo)
    .send({ mailRisto: 'vivaLaPasta@carbonara.com'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
  });



  
  /**
  *      User Story 11:"Ricezione Pietanze"
  */

  // Test 11.1: senza token
  test('Tentitativo di segnalare un piatto come "consegnato", ma non viene passato token => Error 401', async()=>{
      const response= await request(app)
      .post('/api/v1/piattosRisto/cambiaStato/')
      .send({ idP: '629a07f975dcac56c4243a4e', idT: idTavolo, stato: 'consegnato'})
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401);
  });

  // Test 11.2: con token errato
  test('Tentitativo di segnalare un piatto come "consegnato", ma passato token errato => Error 403', async()=>{
    const response= await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629a07f975dcac56c4243a4e', idT: idTavolo, stato: 'consegnato'})
    .set('x-access-token', '1234')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);

  });

  // Test 11.2: con token corretto
  test('Stato del piatto diventa "Consegnato", token passato correttamente => Stato 201', async()=>{
    const response = await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629a07f875dcac56c4243a46', idT: idTavolo, stato: 'consegnato'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);
  });

});