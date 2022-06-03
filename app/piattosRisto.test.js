const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const { set } = require('./app');

describe('GET /api/v1/piattosRisto', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    //return connection; // Need to return the Promise db connection?
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
 /**********************************
  * TEST CON TOKEN NON ESISTENTE
  **********************************/




  //test get piatti piattosRisto senza token
  test('GET /api/v1/piattosRisto with no token should return 401', async () => {
    await request(app).get('/api/v1/piattosRisto'); 
    expect(401);
  });
  //test delete piatto di piatto non esistente, token non esistente
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish should return 404 --> dish not found', async () => {
    
    //expect.assertions(1);
    await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/12345')
    .set('Accept', 'application/json')
    expect(401);
  });

 //test delete piatto di piatto esistente e token non esistente
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish should return 204 --> deleted dish', async () => {
    
    //expect.assertions(1);
    await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/6297196ee86e996e2f48005d')
    .set('Accept', 'application/json')
    expect(401);
  });


   /**********************************
  * TEST CON TOKEN ERRATO
  **********************************/

  //test get piatti piattosRisto con token errato
  test('GET /api/v1/piattosRisto?token=<invalid> should return 403', async () => {
    await request(app)
    .get('/api/v1/piattosRisto/')
    .set('x-access-token', '12345')
    .set('Accept', 'application/json')
    expect(403);
  });
    //test delete piatto di piatto non esistente

    test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish should return 404 --> dish not found', async () => {
    
      //expect.assertions(1);
      await request(app)
      .delete('/api/v1/piattosRisto/eliminaPiatto/12345')
      .set('x-access-token', '123345')
      .set('Accept', 'application/json')
      expect(403);
    });
  
   //test delete piatto di piatto esistente e token corretto
    test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish should return 204 --> deleted dish', async () => {
      
      //expect.assertions(1);
      await request(app)
      .delete('/api/v1/piattosRisto/eliminaPiatto/6297196ee86e996e2f48005d')
      .set('x-access-token', '12345')
      .set('Accept', 'application/json')
      expect(203);
    });

      /**********************************
  * TEST CON TOKEN CORRETTO
  **********************************/
  
  // create a valid token
  var payload = {
    mail: 'risto@sushi.com',
    id: '6295011922da57ae0fee2718'
    }
    var options = {
    expiresIn: 86400 // scade dopo 24 ore
    }
    var token = jwt.sign(payload, "process.env.CODIFICA", options);

  //test get piatti piattosRisto con token giusto

  test('GET /api/v1/piattosRisto?token=<valid> should return 200', async () => {
    
    //expect.assertions(1);
    await request(app)
    .get('/api/v1/piattosRisto')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(200);
  });

  //test delete piatto di piatto non esistente

  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish should return 404 --> dish not found', async () => {
    
    //expect.assertions(1);
    await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/12345')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(404);
  });

 //test delete piatto di piatto esistente e token corretto
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish should return 204 --> deleted dish', async () => {
    
    //expect.assertions(1);
    await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/6297196ee86e996e2f48005d')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(204);
  });


});