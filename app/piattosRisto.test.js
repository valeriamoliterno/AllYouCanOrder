const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const Ristorante=require('./models/ristorante')

var idTavolo='6293a6f9271b1efce4efbe82';
var token;


describe('Test di piattosRisto', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(500000);
    jest.unmock('mongoose');
    connection = await mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    loggedUser.mail='sushi@risto.it';
    var ristorante= await Ristorante.findOne({mail: loggedUser.mail});
    ilMioRistoranteID = ristorante._id;
    
    // Creo un token
    var payload = {
      mail: loggedUser.mail,
      id: '629e0ca56233e1cd00c0d57f'
    }
    var options = {
    expiresIn: 86400 // scade dopo 24 ore
    }
    token = jwt.sign(payload, "ChiaveDiCodifica", options);
  });

  afterAll( async() => {
    await mongoose.connection.close(true);
    console.log("Database connection closed");
  });


/**
  *      User Story 8:"Aggiunta piatti"
  */

  //test 8.1
test('Tentativo di aggiungere un piatto con campo nome vuoto => Error 400', async() =>{
    const response=await request(app)
    .post('/api/v1/piattosRisto/aggiungiPiatto/')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({managerpwd
: 'admin'})
    .send({
      nome: '',
      prezzo:0,
      descrizione: 'xy', 
      foto: 'xy', //percorso  
      stato: '',})
    expect(response.statusCode).toBe(400);
});


//test 8.2
test('Tentativo di aggiungere un piatto con campo prezzo vuoto => Error 400', async() =>{
  const response=await request(app)
  .post('/api/v1/piattosRisto/aggiungiPiatto/')
  .set('x-access-token', token)
  .set('Accept', 'application/json')
  .send({managerpwd: 'admin'})
  .send({
      nome: 'xy',
      prezzo:'',
      descrizione: 'xy', 
      foto: 'xy', //percorso  
      stato: '',
  })
  expect(response.statusCode).toBe(400);
});


//test 8.3
test('Tentativo di aggiungere un piatto con prezzo non numerico => Error 400', async() =>{
  const response=await request(app)
  .post('/api/v1/piattosRisto/aggiungiPiatto/')
  .set('x-access-token', token)
  .set('Accept', 'application/json')
  .send({managerpwd: 'admin'})
  .send({
      nome: 'xy',
      prezzo: 'xy',
      descrizione: 'xy', 
      foto: 'xy', //percorso  
      stato: '',
  })
  expect(response.statusCode).toBe(400);
});


//Test 8.4
test('Piatto aggiunto, token e campi corretti => Stato 201', async () => {
  const response= await request(app)
  .post('/api/v1/piattosRisto/aggiungiPiatto/')
  .set('x-access-token', token)
  .set('Content-Type', 'application/json')
  .send({managerpwd: 'admin'})
  .send({
    nome: 'xy',
    prezzo: '0',
    descrizione: 'xy', 
    foto: 'xy', //percorso  
    stato: '',
})
  expect(response.statusCode).toBe(201);
});


//Test 8.5
test('Tentativo di aggiungere piatto senza mandare token => Error 401', async () => {
  const response= await request(app)
  .post('/api/v1/piattosRisto/aggiungiPiatto/')
  .set('Accept', 'application/json')
  .send({managerpwd: 'admin'})
  .send({
    nome: 'xy',
    prezzo: '0',
    descrizione: 'xy', 
    foto: 'xy', //percorso  
    stato: '',
})
  expect(response.statusCode).toBe(401);
});


//Test 8.6
test('Tentativo di aggiungere piatto con token errato => Error 403', async () => {
  const response= await request(app)
  .post('/api/v1/piattosRisto/aggiungiPiatto/')
  .set('x-access-token', '12345')
  .set('Accept', 'application/json')
  .send({managerpwd: 'admin'})
  .send({
    nome: 'xy',
    prezzo: '0',
    descrizione: 'xy', 
    foto: 'xy', //percorso  
    stato: '',
})
  expect(response.statusCode).toBe(403);
});

/**
  *      User Story 5:"Sicurezza"
  */


//Test 
test('Tentativo di aggiungere piatti con password manager errata" => Stato 403', async () => {
  const response= await request(app)
  .post('/api/v1/piattosRisto/aggiungiPiatto/')
  .set('x-access-token', token)
  .set('Content-Type', 'application/json')
  .send({managerpwd: 'admi'})
  .send({
    nome: 'xy',
    prezzo: '0',
    descrizione: 'xy', 
    foto: 'xy', //percorso  
    stato: '',
})
  expect(response.statusCode).toBe(403);
});





  /**
  *      User Story 2:"Cucina"
  */

  // Test 2.1
  test('Tenta apertura della pagina dei Cuochi senza token => Errore 401', async () => {
    const response= await request(app)
    .get('/api/v1/piattosRisto/ordineTavolo/'+ idTavolo)
    expect(response.statusCode).toBe(401);
  });

  // Test 2.2
  test('Tenta apertura della pagina dei Cuochi con token errato => Errore 403', async () => {
    const response= await request(app)
    .get('/api/v1/piattosRisto/ordineTavolo/'+ idTavolo)
    .set('x-access-token', '12345')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);
  });
  
  // Test 2.3
  test('Apertura della pagina Cuochi con token corretto => Stato 200', async () => {
    const response= await request(app)
    .get('/api/v1/piattosRisto/ordineTavolo/'+ idTavolo)
    .send({ mailRisto: 'vivaLaPasta@carbonara.com'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
  });


});