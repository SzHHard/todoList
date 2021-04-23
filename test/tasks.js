const assert = require('assert');
const express = require('express');
const request = require('supertest');

const db = require('../server/db');
const app = express();
const routerApi = require('../server/api');
const { sequelize } = require('../server/db');

app.use('/', routerApi);

describe('todoList api v1', function () {
    before((done) => {
        
       db.sequelize.sync({force: true}).then(() => {
           console.log('Drop and re-sync db.');
       })
        
        done();
        
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
                         //   console.log(res);
                            assert.strictEqual(res.body[0].content, "hello, world")
                            assert.strictEqual(res.body[0].id, 1)
                        })
                        .end(done)
                })

        });

        it('on PUT with query passed should update task content', (done) => {
            request(app)
                .post('/')
                .send({ text: "before" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err)
                    let id = -1;

                    db.getMaxIdFromTable((err, row) => {
                        id = row['MAX(id)'];
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
                                        JSON.stringify(res);
                                        assert.strictEqual(res.body.content, 'after');
                                    })
                                    .end(done)
                            })
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
                .end(() => {
                    let id = -1;

                    db.getMaxIdFromTable((err, row) => {
                        id = row['MAX(id)'];

                        request(app)
                            .get(`/${id}`)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(done)
                    })
                })
        })

        it('on DELETE should remove a task', (done) => {
            request(app)
                .post('/')
                .send({ text: "DELETE test" })
                .end(() => {
                    db.countRows((err, row) => {
                        let lengthAfterAdd = row['COUNT(*)'];
                        db.getMaxIdFromTable((err, row) => {
                            let id = row['MAX(id)'];
                            request(app)
                                .delete(`/${id}`)
                                .expect(204)
                                .end(() => {
                                    db.countRows((err, row) => {
                                        let newLength = row['COUNT(*)'];
                                        request(app)
                                            .get('/')
                                            .expect(200)
                                            .expect((res) => {
                                                assert.strictEqual(newLength + 1, lengthAfterAdd);
                                            })
                                            .end(done)
                                    });
                                })
                        })
                    });

                })
        })
        it('on PUT should update the task to completed', (done) => {
            request(app)
                .post('/')
                .send({ text: "putTest" })
                .end(() => {
                    db.getMaxIdFromTable((err, row) => {
                        let id = row['MAX(id)'];
                        request(app)
                            .put(`/${id}?active=false`)
                            .expect(200)
                            .expect(() => {
                                db.getTask(id, (err, row) => {
                                    assert.strictEqual(row.active, 0);
                                });
                            })
                            .end(done)
                    });
                })
        });

        it('on PUT should update the task to active', (done) => {
            request(app)
                .post('/')
                .send({ text: "hello, world" })
                .end(() => {
                    db.getMaxIdFromTable((err, row) => {
                        let id = row['MAX(id)'];
                        request(app)
                            .put(`/${id}?active=true`)
                            .expect(200)
                            .expect(() => {
                                db.getTask(id, (err, row) => {
                                    assert.strictEqual(row.active, 1);
                                });
                            })
                            .end(done)
                    });
                })
        });



        it('on GET should fail if passed an invalid task id', (done) => {
            request(app)
                .get('/1999922949')
                .expect(400)
                .end(done)
        })
        it('on DELETE should return 400 if invalid task id', (done) => {
            request(app)
                .delete('/1938427')
                .expect(400)
                .end(done)
        })
        it('on PUT should return 400 if invalid task id', (done) => {
            request(app)
                .put('/1938427?completed=true')
                .expect(400)
                .end(done)
        })
    })
});

