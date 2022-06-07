/*const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const { set } = require('./app');
const Ristorante=require('./models/ristorante')
const Piatto=require('./models/piatto')

describe('Parte test per aggiunta piatto', () => {

  let connection;
  let idPiatto;
  beforeAll( async () => {
    jest.setTimeout(50000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    loggedUser.mail='sushi@risto.it';
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
 /**********************************
  * TEST CON TOKEN NON ESISTENTE
  **********************************/

        //test post per aggiungere tavolo senza token del test case 12.2 
 /*       test('POST /api/v1/tavoliRisto/ add table, not existing token, should return 401 ', async()=>{
          const response= await request(app)
          .post('/api/v1/tavoliRisto/aggiungiTavolo')
          .send({ name: 'TavoloTesting'})
      
          .set('Accept', 'application/json')
          expect(response.statusCode).toBe(401);
      
        });


   /**********************************
  * TEST CON TOKEN ERRATO
  **********************************/


      //test post per aggiungere tavolo con token errato del test case 12.3 
 /* test('POST /api/v1/tavoliRisto/ add table, invalid token, should return 403 ', async()=>{
    const response= await request(app)
    .post('/api/v1/tavoliRisto/aggiungiTavolo')
    .send({ name: 'TavoloTesting'})
    .set('x-access-token', 1234)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);

  });
      /**********************************
  * TEST CON TOKEN CORRETTO
  **********************************/
  
  // create a valid token
 /* var payload = {
    mail: loggedUser.mail,
    id: '629e0ca56233e1cd00c0d57f'
    }
    var options = {
    expiresIn: 86400 // scade dopo 24 ore
    }
    var token = jwt.sign(payload, "ChiaveDiCodifica", options);


  //test post per aggiungere tavolo con nome non inserito con token del test case 12.1 e password manager corretta
  test('POST /api/v1/tavoliRisto/ add table, should return 201', async()=>{
    const response = await request(app)
      .post('/api/v1/tavoliRisto/aggiungiTavolo')
      .send({pM: 'admin', name: 'TavoloTesting'})
      .set('x-access-token', token)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);

  });

      //test post per aggiungere tavolo con nome inserito con token del test case 12.4 e password managare errata
      test('POST /api/v1/tavoliRisto/ add table, should return 403', async()=>{
        const response = await request(app)
        .post('/api/v1/tavoliRisto/aggiungiTavolo')
        .send({pM: 'admin', name: 'TavoloTesting'})
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        expect(response.statusCode).toBe(403);
    
      });

    //test post per aggiungere tavolo con nome inserito con token del test case 12.4 e password manager corretta
    test('POST /api/v1/tavoliRisto/ add table, should return 201', async()=>{
      const response = await request(app)
      .post('/api/v1/tavoliRisto/aggiungiTavolo')
      .send({pM: 'admin', name: 'TavoloTesting'})
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(201);
    
      });
});*/



const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const { set } = require('./app');
const Ristorante=require('./models/ristorante')
const Piatto=require('./models/piatto')

describe('Parte test per aggiunta piatto', () => {

  let connection;
  let idPiatto;
  beforeAll( async () => {
    jest.setTimeout(50000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    loggedUser.mail='sushi@risto.it';
  });
  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
 /**********************************
  * TEST CON TOKEN NON ESISTENTE
  **********************************/

        //test post per aggiungere tavolo senza token del test case 12.2 
        test('POST /api/v1/tavoliRisto/ add table, not existing token, should return 401 ', async()=>{
          const response= await request(app)
          .post('/api/v1/tavoliRisto/aggiungiTavolo/nome/admin')
          .set('Accept', 'application/json')
          expect(response.statusCode).toBe(401);
      
        });


   /**********************************
  * TEST CON TOKEN ERRATO
  **********************************/


      //test post per aggiungere tavolo con token errato del test case 12.3 
  test('POST /api/v1/tavoliRisto/ add table, invalid token, should return 403 ', async()=>{
    const response= await request(app)
    .post('/api/v1/tavoliRisto/aggiungiTavolo/nome/admin')
    
    .set('x-access-token', 1234)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);

  });
      /**********************************
  * TEST CON TOKEN CORRETTO
  **********************************/
  
  // create a valid token
  var payload = {
    mail: loggedUser.mail,
    id: '629e0ca56233e1cd00c0d57f'
    }
    var options = {
    expiresIn: 86400 // scade dopo 24 ore
    }
    var token = jwt.sign(payload, "ChiaveDiCodifica", options);


  //test post per aggiungere tavolo con nome non inserito con token del test case 12.1
  test('POST /api/v1/tavoliRisto/ add table, should return 201', async()=>{
    const response = await request(app)
    .post('/api/v1/tavoliRisto/aggiungiTavolo//admin')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(404);

  });

            //test post per aggiungere tavolo con nome inserito con token del test case 12.4 e con password manager errata
            test('POST /api/v1/tavoliRisto/ add table, wrong password manager should return 403', async()=>{
              const response = await request(app)
              .post('/api/v1/tavoliRisto/aggiungiTavolo/TavoloTesting/nimda')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              expect(response.statusCode).toBe(403);
          
            });
    //test post per aggiungere tavolo con nome inserito con token del test case 12.4 e con password manager corretta
    test('POST /api/v1/tavoliRisto/ add table, should return 201', async()=>{
        const response = await request(app)
        .post('/api/v1/tavoliRisto/aggiungiTavolo/TavoloTesting/admin')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
   
        expect(response.statusCode).toBe(201);
    
      });

});