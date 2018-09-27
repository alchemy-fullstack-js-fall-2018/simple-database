const assert = require('assert');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require ('rimraf');
const path = require ('path');
const Store = require ('../lib/store');

describe('simple database of JSON files', () => {

    const DATABASE_NAME = 'cats';

    const store = new Store (DATABASE_NAME);

    beforeEach(done => {
        rimraf(DATABASE_NAME, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });

    it.skip('gets existing file', (done) => {
        store.get('luna.json', (err, objectFromFile) => {
            if(err) return done(err);
            assert.deepEqual(objectFromFile, { name:'Luna' });
            done();
        });
    });
    
    it.skip('saves an object as a file', (done) => {
        const objectToSave = { name: 'Ember' };
        store.save (objectToSave, (err, objectThatSaved) => {
            if(err) return done(err);
            assert.deepEqual(objectThatSaved, objectToSave);
            done();
        });
    });
    
    it.skip('removes an existing file', done => {
        const fileToRemove = 'luna.json';
        store.remove(fileToRemove, (err, statusObj) => {
            if(err) return done(err);
            assert.deepEqual(statusObj, { removed: true });
            done();
        });
    });
    
    it('gets an array of all objects in the database', (done) => {
        store.getAll((err, objects) => {
            if(err) return done(err);
            assert.deepEqual(objects, [{ name: 'Ember' }, { name: 'luna' }])
            done();
        });
    });

});

