const request  = require('supertest');
const app      = require('./app');
const mongoose = require('mongoose');
const Ristorante = require('./models/ristorante');

describe('test delle api: /api/v1/ristoranti', () => {

    let connection;

    beforeAll( async () => {
        jest.setTimeout(50000000000);
        jest.unmock('mongoose');
        connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority');
        console.log('Database connected!');
        var bool = true;
        var ristorante= Ristorante.findOne({mail: 'risto@mail.it'});
        if(!ristorante){
            console.log('il ristorante non è presente')
        } else {
            await Ristorante.deleteOne(ristorante).exec();
        }
               
    });

    afterAll( () => {
        mongoose.connection.close(true);
        console.log("Database connection closed");
    });

    /**
    *       User Story 19:"Registrazione"
    */ 

    // Test 19.1: registrazione con email in formato sbagliato
    test('Tenta di creare un nuovo account ma con email in formato errato => error 400', async()=>{
        const response = await request(app)
        .post('/api/v1/ristoranti/')
        .send({ mail: 'mail.it', password: 'password', passwordManager: 'passwordManager'})
        .set('Accept', 'application/json')
        expect(response.statusCode).toBe(400, { error: 'La mail non ha un formato valido. Inserirla del tipo a@b.c' });
        });

    // Test 19.2: registrazione con campo email vuoto
    test('Tenta di creare un nuovo account ma con campo email vuoto => error 400', async()=>{
        const response = await request(app)
        .post('/api/v1/ristoranti/')
        .send({  mail: '', password: 'password', passwordManager: 'passwordManager'})
        .set('Accept', 'application/json')
        expect(response.statusCode).toBe(400, { error: 'Il campo mail non può essere vuoto' });
        });

    // Test 19.3: registrazione con email già esistente nel database
    test('Tenta di creare un nuovo account ma con email già registrata => error 400', async()=>{
        const response = await request(app)
        .post('/api/v1/ristoranti/')
        .send({ mail: 'abc@def.it', password: 'password', passwordManager: 'passwordManager'})
        .set('Accept', 'application/json')
        expect(response.statusCode).toBe(400, { error: 'Esiste già un ristorante con questa mail' });
        });

    // Test 19.4: registrazione con campo password vuoto
    test('Tenta di creare un nuovo account ma con campo password vuoto => error 400', async()=>{
        const response = await request(app)
        .post('/api/v1/ristoranti/')
        .send({ mail: 'risto@mail.it', password: '', passwordManager: 'passwordManager'})
        .set('Accept', 'application/json')
        expect(response.statusCode).toBe(400, { error: 'La password non può essere vuota' });
        });

    // Test 19.5: registrazione con campo password manager vuoto
    test('Tenta di creare un nuovo account ma con campo password Manager vuoto => error 400', async()=>{
        const response = await request(app)
        .post('/api/v1/ristoranti/')
        .send({ mail: 'risto@mail.it', password: 'password', passwordManager: ''})
        .set('Accept', 'application/json')
        expect(response.statusCode).toBe(400, { error: 'La password manager non può essere vuota' });
        });

    // Test 19.6: registrazione con email in formato corretto e tutti i campi compilati
    test('Creare un nuovo account con tutti i campi compilati correttamente => status 201', async()=>{
        const response = await request(app)
        .post('/api/v1/ristoranti/')
        .send({ mail: 'risto@mail.it', password: 'password', passwordManager: 'passwordManager'})
        .set('Accept', 'application/json')
        expect(response.statusCode).toBe(201);
        });
});