const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const app     = require('./app');


describe('POST /api/v1/auth', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  

    test('4.1: POST /api/v1/auth con password errata', () => {
        return request(app)
            .post('/api/v1/auth')
            .set('Accept', "application/json")
            .send({ mail: "risto@sushi.com", password: stringToHash("password errata") })
            .expect(200, { successo: false, messaggio: 'La password che hai inserito non è corretta' });
    });

    test('4.2: POST /api/v1/auth senza mail', () => {
        return request(app)
            .post('/api/v1/auth')
            .set('Accept', "application/json")
            .send({ password: stringToHash("password") })
            .expect(404, { successo: false, messaggio: "L'email che hai inserito non è corretta" });
    });

    test('4.3: POST /api/v1/auth utente registrato', () => {
        return request(app)
            .post('/api/v1/auth')
            .set('Accept', "application/json")
            .send({ mail: "risto@sushi.com", password: stringToHash("password") })
            .expect(201, {
				successo: true,
				messaggio: 'Log in effettuato con successo!',
				self: "api/v1/auth6295011922da57ae0fee2718"
			});
    });

    test('4.4: POST /api/v1/auth utente non registrato', () => {
        return request(app)
            .post('/api/v1/auth')
            .set('Accept', "application/json")
            .send({ mail: "utente@nonregistrato.com", password: stringToHash("password non registrata") })
            .expect(404, { successo: false, messaggio: "L'email che hai inserito non è corretta" });
    });
})


/**
 * Ritorna il valore hash della stringa passata
 */
 function stringToHash(string) {
                  
    var hash = 0;
      
    if (string.length == 0) return hash;
      
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
      
    return hash;
}