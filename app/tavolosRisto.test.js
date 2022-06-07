const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const app     = require('./app');


describe('GET e POST /api/v1/tavoliCliente', () => {
    
    let connection;
    
    beforeAll( async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await  mongoose.connect('mongodb+srv://AllYouCanOrder:AliValeGiuMa@cluster0.dxwja.mongodb.net/AllYouCanOrder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Database connected!');
        
        ilMioRistoranteID= '6295011922da57ae0fee2718'
        ilMioTavoloID= '629715ffe86e996e2f47ff5c'
    });
    
    afterAll( () => {
        mongoose.connection.close(true);
        console.log("Database connection closed");
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
/*
    test('17: POST /api/v1/tavoliCliente/ordine', () => {
        return request(app)
        .post('/api/v1/tavoliCliente/ordine')
        .set('Accept', "application/json")
        .send({ nome: 'Onigiri tonno', descrizione: "Palline di riso con dentro tonno e maionese, 2pz", prezzo: 0, foto: "https://shop.itticabrianza.com/media/Foto_Prodotti/700701-3051-2_onigiri_cotto_tonno_e_salmone_4.jpg" })
        .expect(201);
    });
*/
    test('17: DELETE /api/v1/tavoliCliente/svuotaCarrello', () => {
        return request(app)
        .delete('/api/v1/tavoliCliente/svuotaCarrello')
        .set('Accept', "application/json")
        .expect(201);
    })
    
})
