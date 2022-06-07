const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const Ristorante=require('./models/ristorante')
const Tavolo = require('./models/tavolo');

var idTavolo;
var token;

describe('Gestione metodi tavolos risto', () => {

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
    token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  });

  afterAll( async () => {
    var tavolo = await Tavolo.findOne({nome: 'tavoloTesting'});
    await Tavolo.deleteOne(tavolo).exec();
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
    .delete('/api/v1/tavoliRisto/eliminaTavolo/629e0ca56233e1cd00c0d57f/admin')
    .set('x-access-token', token)                                   
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(404);
  });



  //Test 13.5: Elimina tavolo mandando token corretto e id corretto ma password manager errata
  test('Tavolo eliminato, token e id corretti ma password manager errata => Stato 403', async () => {
    const response= await request(app)
    .delete('/api/v1/tavoliRisto/eliminaTavolo/'+idTavolo+'/admi')
    .set('x-access-token', token)
    .set('Content-Type', 'application/json')
    expect(response.statusCode).toBe(403);
  });


    //Test 13.4: Elimina tavolo mandando token corretto e id corretto
    test('Tavolo eliminato, token e id corretti => Stato 204', async () => {
      const response= await request(app)
      .delete('/api/v1/tavoliRisto/eliminaTavolo/'+idTavolo+'/admin')
      .set('x-access-token', token)
      .set('Content-Type', 'application/json')
      expect(response.statusCode).toBe(204);
    });

   /**********************************
  * TEST CON TOKEN NON ESISTENTE
  **********************************/

     //test post per aggiungere tavolo senza token del test case 12.2 
     test('POST /api/v1/tavoliRisto/ add table, not existing token, should return 401 ', async()=>{
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
  test('POST /api/v1/tavoliRisto/ add table, invalid token, should return 403 ', async()=>{
   const response= await request(app)
   .post('/api/v1/tavoliRisto/aggiungiTavolo/tavoloTesting/admin')
   .set('x-access-token', 1234)
   .set('Accept', 'application/json')
   expect(response.statusCode).toBe(403);

 });
     /**********************************
 * TEST CON TOKEN CORRETTO
 **********************************/

 //test post per aggiungere tavolo con nome non inserito con token del test case 12.1 e password manager corretta
 test('POST /api/v1/tavoliRisto/ add table no name, should return 404', async()=>{
   const response = await request(app)
   .post('/api/v1/tavoliRisto/aggiungiTavolo//admin')
     .set('x-access-token', token)
     .set('Accept', 'application/json')
   expect(response.statusCode).toBe(404);

 });

  //test post per aggiungere tavolo con nome inserito con token del test case 12.4 e password managare errata
  test('POST /api/v1/tavoliRisto/ add table, should return 403', async()=>{
    const response = await request(app)
    .post('/api/v1/tavoliRisto/aggiungiTavolo/tavoloTesting/nimda')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403);

  });

   //test post per aggiungere tavolo con nome inserito con token del test case 12.4 e password manager corretta
   test('POST /api/v1/tavoliRisto/ add table, should return 201', async()=>{
    const response = await request(app)
    .post('/api/v1/tavoliRisto/aggiungiTavolo/tavoloTesting/admin')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);
   
  });

  test('3: GET /api/v1/tavoliCliente/ordine', () => {
    return request(app)
    .get('/api/v1/tavoliCliente/ordine')
    .set('Accept', "application/json")
    .expect(200)
  });

  test('17: GET /api/v1/tavoliCliente/mostraCarrello', () => {
    return request(app)
    .get('/api/v1/tavoliCliente/mostraCarrello')
    .set('Accept', "application/json")
    .expect(200);
  });
  test('17: POST /api/v1/tavoliCliente/ordine', () => {
    return request(app)
    .post('/api/v1/tavoliCliente/ordine')
    .set('Accept', "application/json")
    .send({ nome: 'Onigiri tonno', descrizione: "Palline di riso con dentro tonno e maionese, 2pz", prezzo: 0, foto: "https://shop.itticabrianza.com/media/Foto_Prodotti/700701-3051-2_onigiri_cotto_tonno_e_salmone_4.jpg" })
    .expect(201);
  });
  test('17: DELETE /api/v1/tavoliCliente/svuotaCarrello', () => {
    return request(app)
    .delete('/api/v1/tavoliCliente/svuotaCarrello')
    .set('Accept', "application/json")
    .expect(201);
  })

});
