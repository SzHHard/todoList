const assert = require('assert');
const express = require('express');
const request = require('supertest');

const db = require('../server/db');
const app = express();
const routerApi = require('../server/api');

app.use('/', routerApi);

describe('todoList api v1', function () {
    before((done) => {
        db.clearTable(() => {
            db.createTable(done)
        })
    })

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
                            assert.strictEqual(res.body[0].content, "hello, world")
                            assert.strictEqual(res.body[0].id, 1)
                        })
                        .end(done)
                })

        });

        it('on PUT with query passed should update task content', (done) => {
            request(app)
                .post('/tasks')
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
                        .put(`/tasks/${id}?content=after`)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .end((err) => {
                            // db.getAllTasks( (err,rows) => {
                            //     console.log(rows);
                            // })
                            if (err) return done(err)
                            request(app)
                                .get(`/tasks/${id}`)
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
                .post('/tasks')
                .send({ text: "hello, world" })
                .set('Accept', 'application.json')
                .end(() => {
                    let id = -1;

                    db.getMaxIdFromTable((err, row) => {
                        id = row['MAX(id)'];
                    
                    request(app)
                        .get(`/tasks/${id}`)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(done)
                })
            })
        })

        it('on DELETE should remove a task', (done) => {
            request(app)
                .post('/tasks')
                .send({ text: "DELETE test" })
                .end(() => {
                    let lengthAfterAdd = -1;
                    db.countRows((err, row) => {
                        if (err) {
                            console.log(err);
                        } else {

                            lengthAfterAdd = row['COUNT(*)'];
                        }
                    });
                    let id = -1;

                    db.getMaxIdFromTable((err, row) => {
                        id = row['MAX(id)'];
                
                    request(app)
                        .delete(`/tasks/${id}`)
                        .expect(204)
                        .end(() => {
                            let newLength = -1;
                            db.countRows((err, row) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    newLength = row['COUNT(*)'];
                                    console.log(newLength);
                                }
                            });
                            request(app)
                                .get('/tasks')
                                .expect(200)
                                .expect((res) => {
                                    assert.strictEqual(newLength + 1, lengthAfterAdd);
                                })
                                .end(done)
                        })
                    })

                })
        })
        it('on PUT should update the task to completed', (done) => {
            request(app)
                .post('/tasks')
                .send({ text: "putTest" })
                .end(() => {
                    let id = -1;

                    db.getMaxIdFromTable((err, row) => {
                        id = row['MAX(id)'];
                    request(app)
                        .put(`/tasks/${id}?active=false`)
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
                .post('/tasks')
                .send({ text: "hello, world" })
                .end(() => {
                    let id = -1;

                    db.getMaxIdFromTable((err, row) => {
                        id = row['MAX(id)'];

                    request(app)
                        .put(`/tasks/${id}?active=true`)
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
                .expect(400)
                .end(done)
        })
    })
});


// });
