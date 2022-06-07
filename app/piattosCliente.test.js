const request  = require('supertest');
const app      = require('./app');
const mongoose = require('mongoose');
const Ristorante = require('./models/ristorante');
const Piatto = require('./models/piatto');
describe('Test di piattosCliente', () => {

  let connection;
  let piatto;

  beforeAll( async()=> {
    jest.setTimeout(60000);
    jest.unmock('mongoose');
    connection = mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority');
    console.log('Database connected!');
    var ristorante= await Ristorante.findOne({mail: 'test@carrello.it'});
    ilMioRistoranteID = ristorante._id;
    piatto= new Piatto();
    ristorante.menu=[piatto];
    await ristorante.save();
  });

  afterAll( async() => {
    console.log("Database connection closed");
  });

  /**
  *      User Story 15:"Menu"
  */

  //test 14: visualizzazione del menu
  test('Visualizza il menu => ristorante.menu is not empty', async()=>{
      const response=await request(app)
      .get('/api/v1/piattosCliente')
      expect(response.statusCode).toBe(200);
  });


})