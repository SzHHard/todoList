const assert = require('assert');
const express = require('express');
const request = require('supertest');

const db = require('../server/db');
const app = express();
const routerApi = require('../server/api');
const { sequelize } = require('../server/db');

app.use('/', routerApi);

describe('todoList api v1', function () {
    before(() => {
        return db.sequelize.sync({ force: true })
    })

    describe('/tasks', function () {

        it('on GET should return tasks', function (done) {
            request(app)
                .get('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(done);
        });

        it('on POST should create a task', (done) => {
            request(app)
                .post('/')
                .send({ text: "hello, world" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(() => {
                    request(app)
                        .get('/')
                        .expect((res) => {
                            assert.strictEqual(res.body[0].content, "hello, world")
                            assert.strictEqual(res.body[0].id, 1)
                        })
                        .end(done)
                })

        });

        it('on PUT with content passed should update task content', (done) => {
            request(app)
                .post('/')
                .send({ text: "before" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    let id = res.body.id
                    request(app)
                        .put(`/${id}?content=after`)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .end((err) => {
                            if (err) return done(err)
                            request(app)
                                .get(`/${id}`)
                                .set('Accept', 'application/json')
                                .expect(200)
                                .expect((res) => {
                                    assert.strictEqual(res.body.content, 'after');
                                })
                                .end(done)
                        })
                })

        })
    })

    describe("/tasks/:id", function () {
        it('on GET should return the requested task', (done) => {
            request(app)
                .post('/')
                .send({ text: "hello, world" })
                .set('Accept', 'application.json')
                .end((err, res) => {
                    let id = res.body.id;
                    request(app)
                        .get(`/${id}`)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(done)
                })
        })
        it('on DELETE should remove a task', (done) => {
            request(app)
                .post('/')
                .send({ text: "DELETE test" })
                .end((err, res) => {
                    let id = res.body.id;
                    request(app)
                        .delete(`/${id}`)
                        .expect(204)
                        .end(() => {
                            request(app)
                                .get(`/${id}`)
                                .expect(404)
                                .end(done)
                        });
                })
        })
        it('on PUT should update the task to completed', (done) => {
            request(app)
                .post('/')
                .send({ text: "putTest" })
                .end((err, res) => {
                    let id = res.body.id;
                    request(app)
                        .put(`/${id}?active=false`)
                        .expect(200)
                        .end(() => {
                            request(app)
                                .get(`/${id}`)
                                .expect((res) => {
                                    assert.strictEqual(res.body.active, false)
                                })
                                .end(done)
                        })
                });
        })

        it('on PUT should update the task to active', (done) => {
            request(app)
                .post('/')
                .send({ text: "hello, world" })
                .end((err, res) => {
                    let id = res.body.id;
                    request(app)
                        .put(`/${id}?active=true`)
                        .expect(200)
                        .end(() => {
                            request(app)
                                .get(`/${id}`)
                                .expect((res) => {
                                    assert.strictEqual(res.body.active, true)
                                })
                                .end(done)
                        })
                });
        })

        it('on DELETE without stated id should delete all tasks', (done) => {
            request(app)
                .post('/')
                .send({ text: 'deleteAll test' })
                .end(() => {
                    request(app)
                        .delete('/')
                        .expect(204)
                        .end(() => {
                            request(app)
                                .get('/')
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .expect((res) => {
                                    console.log(res.body)
                                    assert.strictEqual(res.body.length, 0)
                                })
                                .end(done);
                        })
                })

        })

        it('on GET should fail if passed an invalid task id', (done) => {
            request(app)
                .get('/1999922949')
                .expect(404)
                .end(done)
        })
        it('on DELETE should return 404 if invalid task id', (done) => {
            request(app)
                .delete('/1938427')
                .expect(404)
                .end(done)
        })
        it('on PUT should return 400 if invalid task id', (done) => {
            request(app)
                .put('/1938427?active=true')
                .expect(400)
                .end(done)
        })
    });

})


