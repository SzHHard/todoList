const assert = require('assert');
const express = require('express');
const request = require('supertest');

const app = express();
const routerApi = require('../server/api');

app.use('/', routerApi);

describe('todoList api v1', function () {
    describe('/tasks', function () {
        it('on GET should return tasks', function(done) {
             request(app)
                .get('/tasks')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(done);
        });
    });
});