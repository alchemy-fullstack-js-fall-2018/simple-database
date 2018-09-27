const assert = require('assert');
//const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store.js');

describe('Store Database', () => {

    const rootDirectory = path.join(__dirname, 'database');
    const store = new Store(rootDirectory);

    beforeEach(done => {
        return rimraf(rootDirectory, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });

    beforeEach(() => {
        return mkdirp(rootDirectory);
    });

    it('saves a file to the database with a shortid', done => {
        store.save({ file: 'file contents' }, (err, object) => {
            if(err) return done(err);
            assert.ok(object._id);
            done();

        });

    });
});
