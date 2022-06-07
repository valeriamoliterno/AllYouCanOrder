const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const Ristorante=require('./models/ristorante')
const Piatto=require('./models/piatto')

var idTavolo='629e0d4b6233e1cd00c0d5ab'; //corretto
var token;

describe('Test di piattosRisto', () => {

  let connection;
  let idPiatto;

  beforeAll( async () => {
    jest.setTimeout(500000);
    jest.unmock('mongoose');
    connection = await mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    loggedUser.mail='sushi@risto.it';
    var ristorante= await Ristorante.findOne({mail: loggedUser.mail});
    ilMioRistoranteID = ristorante._id;
    var piatto = await Piatto.findOne({nome: 'Mozzarella'});
    if(!piatto){
      let piatt = new Piatto({
        nome: 'Mozzarella',
        prezzo: '0.00',
    });
    piatt = await piatt.save();
    ristorante.menu.push(piatt);
    await ristorante.save(); 
    idPiatto=piatt._id;
    } else {
      idPiatto= piatto._id;
    }
    
    // Creo un token
    var payload = {
      mail: loggedUser.mail,
      id: '629e0ca56233e1cd00c0d57f'
    }
    var options = {
    expiresIn: 86400 // scade dopo 24 ore
    }
    token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  });

  afterAll( () => {
    mongoose.connection.close(true);
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
    .send({ mailRisto: 'sushi@risto.it'})
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
      .send({ idP: '629f0b35ced5bd770fae199e', idT: idTavolo, stato: 'consegnato'})
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401);
  });

  // Test 11.2: con token errato
  test('Tentitativo di segnalare un piatto come "consegnato", ma passato token errato => Error 403', async()=>{
    const response= await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629f0b35ced5bd770fae199e', idT: idTavolo, stato: 'consegnato'})
    .set('x-access-token', '1234')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);

  });

  // Test 11.2: con token corretto
  test('Stato del piatto diventa "Consegnato", token passato correttamente => Stato 201', async()=>{
    const response = await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629f0b35ced5bd770fae199e', idT: idTavolo, stato: 'consegnato'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);
  });


  /**********************************
  * TEST CON TOKEN NON ESISTENTE
  **********************************/


  //test get piatti piattosRisto senza token 
  test('GET /api/v1/piattosRisto senza token dovrebbe ritornare 401', async () => {
    const response= await request(app)
    .get('/api/v1/piattosRisto'); 
    expect(response.statusCode).toBe(401);
  });


 //test delete piatto di piatto esistente e token non esistente user story 9.1
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish, not existing token should return 401 ', async () => {
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/'+idPiatto)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(401);
  });


  //test post per cambiare stato con token del test case 10.3 
  test('POST /api/v1/piattosRisto/cambiaStato change plate state, not existing token, should return 401 ', async()=>{
    const response= await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629efc45ebe5ff552cf4c109', idT: '629e0d476233e1cd00c0d5a4' ,stato: 'in consegna'})

    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(401);

  });


   /**********************************
  * TEST CON TOKEN ERRATO
  **********************************/

  //test get piatti piattosRisto con token non valido 
  test('GET /api/v1/piattosRisto should return 403', async () => {
   const response= await request(app)
    .get('/api/v1/piattosRisto/')
    .set('x-access-token', '12345')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);
  });
  
   //test delete piatto di piatto esistente e token non valido User story 9.2
    test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish, invalid token', async () => {
      
      //expect.assertions(1);
      const response= await request(app)
      .delete('/api/v1/piattosRisto/eliminaPiatto/6297196ee86e996e2f48005d')
      .set('x-access-token', '12345')
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(403);
    });
    
 //test post per cambiare stato con token errato del test case 10.3 
  test('POST /api/v1/piattosRisto/cambiaStato change plate state, invalid token, should return 403 ', async()=>{
    const response= await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629efc45ebe5ff552cf4c109', idT: '629e0d476233e1cd00c0d5a4' ,stato: 'in consegna'})
    .set('x-access-token', 1234)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);

  });
      /**********************************
  * TEST CON TOKEN CORRETTO
  **********************************/
  //test get piatti piattosRisto con token giusto
  test('GET /api/v1/piattosRisto should return 200', async () => {
   const response= await request(app)
    .get('/api/v1/piattosRisto')
    .send({ mailRisto: 'vivaLaPasta@carbonara.com'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
  });



  //test delete piatto di piatto non esistente
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id not existing dish should return 405 --> dish not found', async () => {
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/734b14f975dcac56c4243f5b/admin')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(404);
  });

  //test delete piatto di piatto esistente e token corretto e password errata
  test('DELETE /api/v1/piattosRisto/eliminaPiatto existing dish  but wrong password manager should return 403--> NOT deleted dish', async () => {
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/'+ idPiatto +'/nimda')
    .set('x-access-token', token)
    .set('Content-Type', 'application/json')
    expect(response.statusCode).toBe(403);
  });

 //test delete piatto di piatto esistente e token corretto e password corretta
  test('DELETE /api/v1/piattosRisto/eliminaPiatto existing dish should return 204 --> deleted dish', async () => {
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/'+idPiatto+'/admin')
    .set('x-access-token', token)
    .set('Content-Type', 'application/json')
    expect(response.statusCode).toBe(204);
  });





    //test post per cambiare stato con token del test case 10.3 
    test('POST /api/v1/piattosRisto/cambiaStato change plate state, not existing table, should return 405 ', async()=>{
      const response = await request(app)
      .post('/api/v1/piattosRisto/cambiaStato/')
      .send({ idP: '629efc45ebe5ff552cf4c109', idT: '629e0d476233e1cd00c0d5a5' ,stato: 'in consegna'})
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(405);
  
    });


  //test post per cambiare stato con token del test case 10.3 
  test('POST /api/v1/piattosRisto/cambiaStato change plate state, should return 201 ', async()=>{
    const response = await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629efc45ebe5ff552cf4c109', idT: '629e0d476233e1cd00c0d5a4' ,stato: 'in consegna'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);

  });
});

