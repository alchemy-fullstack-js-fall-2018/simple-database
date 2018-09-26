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
    

    it('save a file to animals with id', done => {
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
});
