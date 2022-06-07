const request  = require('supertest');
const app      = require('./app');
const mongoose = require('mongoose');
const Ristorante = require('./models/ristorante');
const Tavolo = require('./models/tavolo');
const Piatto = require('./models/tavolo');

var tavolo;
var piatto;

describe('Test delle api: /api/v1/tavoliCliente', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(50000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    var ristorante= await Ristorante.findOne({mail: 'ristorante@email.com'});
    ilMioRistoranteID = ristorante._id;
    ilMioTavoloID = '629c942235d25884204e0938'
    tavolo = await Tavolo.findById(ilMioTavoloID);
    if(tavolo.chiamato){
      tavolo.chiamato=false;
      await tavolo.save();
    }
    piatto = tavolo.ordine[0];
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });



  /**
  *      User Story 6: Assistenza
  */

  // Test 6.1: Chiamata di cameriere da Tavolo
  test('Chiama un cameriere => tavolo.chiamato = true', async()=>{
    const response= await request(app)
    .post('/api/v1/tavoliCliente/chiamaCameriere/')
    .set('Accept', 'application/json')
    expect(tavolo.chiamato).toBeTruthy;
  });



  /**
  *      User Story 15: Aggiunta al Carrello
  */

  // Test 15.1: Aggiunta di un piatto al acarrello
  test('Aggiungi un piatto al Carrello => Stato 201', async()=>{
    const response= await request(app)
    .post('/api/v1/tavoliCliente/mostraCarrello/')
    .send({ nome: 'Carbonara', prezzo: 7.55 , descrizione: 'Pasta con guanciale, uovo, pepe, pecorino', foto: 'linkallafoto'})
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);
  });




  /**
  *      User Story 16: Rimozione dal Carrello
  */

  //Test 16.1: Rimozione di un piatto dal carrello
  test('Rimuovi un piatto dal Carrello => Stato 201', async () => {
    const response= await request(app)
    .delete('/api/v1/tavoliCliente/mostraCarrello/'+piatto._id)
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(201);
  });


});