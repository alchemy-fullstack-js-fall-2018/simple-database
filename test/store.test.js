const assert = require('assert');
const Store = require('../lib/store');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const fs = require('fs');

describe('store', () => {
    const dbPath = path.join(__dirname, 'dinosaurs');

    beforeEach(done => {
        rimraf(dbPath, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else {
                mkdirp(dbPath, err => {
                    if(err && err.code !== 'ENOENT') done(err);
                    else done();
                });
            }
        });
    });

    it('adds id to object', done => {
        const store = new Store(path.join(dbPath));
        store.save({ name: 'little foot' }, (err, dinosaur) => {
            if(err) return done(err);
            assert.ok(dinosaur._id);
            done();
        });
    });

    it('saves object to a file', done => {
        const store = new Store(path.join(dbPath));

        store.save({ name: 'little foot' }, (err, dinosaur) => {
            if(err) return done(err);
            const file = fs.readFileSync(path.join(dbPath, `${dinosaur._id}.json`), 'utf8');
            assert.equal(dinosaur.name, JSON.parse(file).name);

            store.get(dinosaur._id, (err, getDinosaur) => {
                if(err) return done(err);
                assert.deepEqual(getDinosaur, JSON.parse(file));
                done();
            }); 
        });
    });

});
