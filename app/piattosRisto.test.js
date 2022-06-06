const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const { set } = require('./app');
const Ristorante=require('./models/ristorante')
const Piatto=require('./models/piatto')

describe('Gestione metodi piattos risto', () => {

  let connection;
  let idPiatto;
  beforeAll( async () => {
    jest.setTimeout(50000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    loggedUser.mail='vivaLaPasta@carbonara.com';
    var ristorante= await Ristorante.findOne({mail: loggedUser.mail});
    var menu = await ristorante.menu; // Trovo l'ordine
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
    const response= await request(app)
    .get('/api/v1/piattosRisto'); 
    expect(response.statusCode).toBe(401);
  });

  //test delete piatto di piatto non esistente, token non esistente  User story 9.1
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id not exiating dish and token --> should return 401', async () => {
    
    //expect.assertions(1);
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/12345')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(401);
  });

 //test delete piatto di piatto esistente e token non esistente user story 9.1
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish, not existing token should return 401 ', async () => {
    
    //expect.assertions(1);
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/'+idPiatto)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(401);
  });


       //test post per cambiare stato con token del test case 10.3 
       test('POST /api/v1/piattosRisto/cambiaStato change plate state, not existing token, should return 401 ', async()=>{
         const response= await request(app)
          .post('/api/v1/piattosRisto/cambiaStato/')
          .send({ idP: '629a07f975dcac56c4243a4e', idT: '6293a6f9271b1efce4efbe82' ,stato: 'in consegna'})
      
          .set('Accept', 'application/json')
          expect(response.statusCode).toBe(401);
      
        });


   /**********************************
  * TEST CON TOKEN ERRATO
  **********************************/

  //test get piatti piattosRisto con token non valido 
  test('GET /api/v1/piattosRisto?token=<invalid> should return 403', async () => {
   const response= await request(app)
    .get('/api/v1/piattosRisto/')
    .set('x-access-token', '12345')
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);
  });


    //test delete piatto di piatto non esistente roken non valido User story 9.2
    test('DELETE /api/v1/piattosRisto/eliminaPiatto/id not existing dish, invalid token should return 403 ', async () => {
    
      //expect.assertions(1);
     const response=  await request(app)
      .delete('/api/v1/piattosRisto/eliminaPiatto/12345')
      .set('x-access-token', '123345')
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
    .send({ idP: '629a07f975dcac56c4243a4e', idT: '6293a6f9271b1efce4efbe82' ,stato: 'in consegna'})
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
    id: '62971bf5f6d21ae1a617eecd'
    }
    var options = {
    expiresIn: 86400 // scade dopo 24 ore
    }
    var token = jwt.sign(payload, "ChiaveDiCodifica", options);



  //test get piatti piattosRisto con token giusto
  test('GET /api/v1/piattosRisto?token=<valid> should return 200', async () => {
   const response= await request(app)
    .get('/api/v1/piattosRisto')
    .send({ mailRisto: 'vivaLaPasta@carbonara.com'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
  });



  //test delete piatto di piatto non esistente
  test('DELETE /api/v1/piattosRisto/eliminaPiatto/id existing dish should return 405 --> dish not found', async () => {
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/734b14f975dcac56c4243f5b')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(404);
  });



 //test delete piatto di piatto esistente e token corretto
  test('DELETE /api/v1/piattosRisto/eliminaPiatto existing dish should return 204 --> deleted dish', async () => {
    const response= await request(app)
    .delete('/api/v1/piattosRisto/eliminaPiatto/'+idPiatto)
    .set('x-access-token', token)
    .set('Content-Type', 'application/json')
    expect(response.statusCode).toBe(204);
  });



  //test post per cambiare stato con token del test case 10.3 
  test('POST /api/v1/piattosRisto/cambiaStato change plate state, should return 20 ', async()=>{
    const response = await request(app)
    .post('/api/v1/piattosRisto/cambiaStato/')
    .send({ idP: '629a07f875dcac56c4243a46', idT: '6293a6f9271b1efce4efbe82' ,stato: 'in consegna'})
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);

  });
});