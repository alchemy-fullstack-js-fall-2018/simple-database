
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/store');


describe('store tests', () => {

    const dbPath = path.join(__dirname, 'simpleDB');

    beforeEach(done => {
        rimraf(dbPath, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });

    beforeEach(done => {
        mkdirp(dbPath, err => {
            if(err) return done(err);
            else done();
        });
    });




    describe('it saves stuff', () => {


        it('returns the passed in object', done => {

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                const testObject = objSaved;
                assert.deepEqual(testObject['testing'], [1, 1, 2, 3]);
                done();
            });
        });

        it('saves the object to a file', done => {

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                const filename = objSaved._id + '.json';
                const savedPath = path.join(dbPath, filename);
                const destFile = fs.readFileSync(savedPath, 'utf8');
                const destObj = JSON.parse(destFile);
                assert.deepEqual(destObj.testing, objSaved.testing);
                done();
            });
        });

        it('gives the object an _id property', done => {

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                const idObject = objSaved._id;
                assert.equal(typeof idObject, 'string');
                done();
            });
        });

        it('saves to path with same name as _id property', done => {

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                const idObject = objSaved._id;
                const filename = idObject + '.json';
                const dirObj = fs.readdirSync(dbPath);
                assert.equal(filename, dirObj[0]);
                done();
            });
        });
    });

    describe('it gets stuff', () => {


        it('gets the object from file', done => {

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                const idObject = objSaved._id;
                store.get(idObject, (err, objFile) => {
                    if(err) return done(err);
                    assert.deepEqual(objFile.testing, obj.testing);
                    done();
                });
            });
        });

        it('returns null if object does not exist', done => {

            const store = new Store(dbPath);

            store.get('bad', (err, objFile) => {
                if(err && err.code !== 'ENOENT') return done(err);
                assert.equal(objFile, null);
                done();
            });
        });
    });

    describe('it removes stuff', () => {


        it('returns a true remove status if it removes the file', done => {

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                const idObject = objSaved._id;
                store.remove(idObject, (err, removedObj) => {
                    if(err) return done(err);
                    assert.equal(removedObj.removed, true);
                    done();
                });
            });
        });

        it('returns a false remove status if no file to remove', done => {

            const store = new Store(dbPath);

            store.remove('bad', (err, removedObj) => {
                if(err && err.code !== 'ENOENT') return done(err);
                assert.equal(removedObj.removed, false);
                done();
            });
        });

        it('actually removed the file, per the get method', done => {

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                const idObject = objSaved._id;
                store.remove(idObject, (err) => {
                    if(err) return done(err);
                });
                store.get(idObject, (err, objFile) => {
                    if(err && err.code !== 'ENOENT') return done(err);
                    assert.equal(objFile, null);
                    done();
                });
            });
        });
    });

    describe('it gets all the stuff', () => {

        it('returns an array of objects if the files exist', done => {

            const store = new Store(dbPath);
            const objs = [        
                { testing: [1, 1, 2, 3] }, 
                { testing: [9, 9, 8, 7] }
            ];

            objs.forEach(obj => {
                store.save(obj, (err) => {
                    if(err) return done(err);
                });
            });

            store.getAll((err, objArr) => {
                if(err) return done(err);
                assert.equal(objArr.length, objs.length);
                done();
            });
        });

        it('returns an empty array if the files do not exist', done => {

            const store = new Store(dbPath);
            store.getAll((err, objArr) => {
                if(err) return done(err);
                assert.equal(objArr.length, 0);
                done();
            });
        });

    });
    
    describe('it gets an array of stuff', () => {

        it('returns an array of objects if the files exist', done => {

            const store = new Store(dbPath);
            const objs = [        
                { testing: [1, 1, 2, 3] }, 
                { testing: [9, 9, 8, 7] }
            ];
            const ids = [];
            let count = objs.length;

            objs.forEach((obj) => {
                store.save(obj, (err, objSaved) => {
                    if(err) return done(err);
                    ids.push(objSaved._id);
                    count--;
                    if(count == 0) {
                        if(ids.length === objs.length) {
                            store.getList(ids, (err, objArr) => {
                                if(err && err.code !== 'ENOENT') return done(err);
                                assert.deepEqual(objArr.length, ids.length);
                                done();
                            });
                        }                    
                    }
                });
            });
        });
    });

    describe('it updates a file', () => {

        it('removes a file and adds a new one with same id', done => {

            // set up:
            // write file1

            const store = new Store(dbPath);
            const obj = { testing: [1, 1, 2, 3] };

            store.save(obj, (err, objSaved) => {
                if(err) return done(err);
                objSaved.testing.push(5);
                store.update(objSaved, (err, updatedObj) => {
                    if(err) return done(err);
                    assert.deepEqual(updatedObj, objSaved);
                    done();
                });
            });




        });
    });

});
