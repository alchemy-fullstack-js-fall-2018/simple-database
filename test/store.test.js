const assert = require('assert');
const Store = require('../lib/store');
const path = require('path');
const fs = require('fs');

describe('store', () => {
    const dbPath = path.join(__dirname, 'dinosaurs');

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
            done();
        });
    });

    it('takes an error and deserialize', done => {
        const store = new Store(path.join(dbPath));
        store.get('_-LlzgkyC', (err, dinosaur) => {
            if(err) return done(err);
            const file = fs.readFileSync(path.join(dbPath, '_-LlzgkyC.json'), 'utf8');
            assert.deepEqual(dinosaur, JSON.parse(file));

        });


    });
});
