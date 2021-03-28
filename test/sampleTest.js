const assert = require('assert');
const express = require('express');
const request = require('supertest');

const db = require('../server/db');
const app = express();
const routerApi = require('../server/api');

app.use('/', routerApi);

describe('todoList api v1', function () {
    before(db.createTable)
    describe('/tasks', function () {

        it('on GET should return tasks', function (done) {
            request(app)
                .get('/tasks')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(done);
        });

        it('on POST should create a task', (done) => {
            request(app)
                .post('/tasks')
                .send({ text: "hello, world" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(() => {
                    request(app)
                        .get('/tasks')
                        .expect((res) => {
                            assert.strictEqual(res.body[0], "hello, world")
                        })
                        .end(done)
                })

        });

        it('on DELETE should remove a task', (done) => {
            request(app)
                .post('/tasks')
                .send({ test: "hello, world" })
                .end(() => {
                    request(app)
                        .delete('/tasks/1')
                        .expect(204)
                        .end(done)
                })
        })
        it('on PUT should update the task to completed', (done) => {
            request(app)
                .post('/tasks')
                .send({ test: "hello, world" })
                .end(() => {
                    request(app)
                        .put('/tasks/1?completed=true')
                        .expect(200)
                        .end(done)
                });
        });
        it('on PUT should update the task to active', (done) => {
            request(app)
                .post('/tasks')
                .send({ test: "hello, world" })
                .end(() => {
                    request(app)
                        .put('/tasks/1?completed=false')
                        .expect(200)
                        .end(done)
                })
        });

        describe("Sad paths", function () {
            it('on GET should fail if passed an invalid task id', (done) => {
                request(app)
                    .get('/tasks/1999922949')
                    .expect(400)
                    .end(done)
            })
            it('on DELETE should return 400 if invalid task id', (done) => {
                request(app)
                    .delete('/tasks/1938427')
                    .expect(400)
                    .end(done)
            })
            it('on PUT should return 400 if invalid task id', (done) => {
                request(app)
                    .put('/tasks/1938427?completed=true')
                    expect(400)
                    .end(done)
            })
        })
    });


});
