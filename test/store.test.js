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

    it('returning null on bad id', done => {
        const store = new Store(path.join(dbPath));

        store.get('fake._id', (err, getDinosaur) => {
            if(err) return done(err);
            assert.deepEqual(getDinosaur, null);
            done();
        });
    });

    it('saves an object and then deletes it', done => {
        const store = new Store(path.join(dbPath));

        store.save({ name: 'little foot' }, (err, dinosaur) => {
            if(err) return done(err);
            
            store.delete(dinosaur._id, (err, removed) => {
                if(err) return done(err);
                assert.deepEqual(removed, { removed: true });
                done();
            });
            
        
        });
    });

    it('returns false on a bad id', done => {
        const store = new Store(path.join(dbPath));
    
        store.delete('fake._id', (err, removed) => {
            if(err) return done(err);
            assert.deepEqual(removed, { removed: false });
            done();
        }); 
        
    });
    it('this will get all my files', (done) => { 
        const store = new Store(path.join(dbPath));

        store.save({ dinosaurs: 'little foot' }, (err) => { 
            if(err) done(err); 
            store.getAll((err, array) => { 
                if(err) return done(err); 
                assert.equal(array.length, 1); 
                done(); 
            }); 
        }); 
    });

    it('returns empty array if files do not exist', (done) => {
        const store = new Store(path.join(dbPath));
        
        store.getAll((err, objects) => {
            if(err) return done(err);
            assert.deepEqual(objects, []);
            done();
        });
    });

});
