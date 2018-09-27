const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');


describe('store', () => {

    const databasePath = path.join(__dirname, 'simpleDB');

  
    beforeEach(done => {
        rimraf(databasePath, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });

    beforeEach(done => {
        mkdirp(databasePath, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });
    

    it('saves a file to simpleDB with _id', done => {
        const store = new Store(databasePath);
        store.save({ 'test':'sloth' }, (err, item) => {
            if(err) return done(err);

            const readFile = path.join(databasePath, `${item._id}.json`);
            fs.readFileSync(readFile);

            assert.ok(item._id);
            assert.deepEqual({ '_id': item._id, 'test':'sloth' }, item);
            done();
        });
    });

    it('gets a object from file by _id', done => {
        const store = new Store(databasePath);
        store.save({ 'test':'sloth' }, (err, itemSaved) => {
            if(err) return done(err);
            store.get(itemSaved._id, (err, item) => {
                assert.ok(item._id);
                assert.deepEqual({ '_id': item._id, 'test':'sloth' }, item);
                done();
            }); 
        });
    });

    it('returns null if file does not exist', done => {
        const store = new Store(databasePath);
        store.get('badId', (err, item) => {
            if(err && err.code !== 'ENOENT') return done(err);
            assert.equal(null, item);
            done();
        });

    });
});
