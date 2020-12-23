const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../src/app');

describe('Server running', () => {
    it('Checks the servers base /get endpoint to make sure the server runs', () => {
        return supertest(app)
            .get('/')
            .expect(200)
    })
})