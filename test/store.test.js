
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/store');



describe('it saves stuff', () => {

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

    it('saves the file', done => {

        const store = new Store(dbPath);
        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            
            const savedPath = path.join(dbPath, 'test');
            const destFile = fs.readFileSync(savedPath, 'utf8');

            assert.equal(objSaved, destFile);
            done();
        });
    });

});
