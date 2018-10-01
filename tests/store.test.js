const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');

const dbPath = path.join(__dirname, 'sandwiches');

describe('store', () => {

    beforeEach(done => {

        rimraf(dbPath, err => {
            if(err && err.code !== 'ENOENT') return done(err);

            mkdirp(dbPath, err => {
                if(err) return done(err);
                done();
            });
        });

    });

    it('save should add an id to a sandwich', done => {
        let store = new Store(dbPath);
        store.save({ sandwich: 'Reuben' }, (err, sandwich) => {
            if(err) return done(err);
            assert.ok(sandwich._id);
            done();
        });        
    });

    it('save should write the object to a file', done => {
        let store = new Store(dbPath);
        store.save({ sandwich: 'Hoagie' }, (err, sandwich) => {
            if(err) return done(err);
            const fileToSave = fs.readFileSync(path.join(dbPath, `${sandwich._id}.json`), 'utf8');            
            assert.equal(JSON.parse(fileToSave).sandwich, 'Hoagie');
            done();
        });
    });    
    
    it('get should return an object whose path is a given id', done => {
        let store = new Store(dbPath);
        store.get('bnU_Ef6N7', (err, sandwich) => {
            if(err) return done(err);
            const fileToGet = fs.readFileSync(path.join(dbPath, 'bnU_Ef6N7.json'), 'utf8');
            assert.deepEqual(sandwich, JSON.parse(fileToGet));
            done();
        });
    });

    it('get should return null if passed a bad id', done => {
        let store = new Store(dbPath);
        let badId = 'some bad id';
        store.get(badId, (err, sandwich) => {
            if(err && err.code !== 'ENOENT') done(err);
            assert.equal(sandwich, null);
            done();
        });
    });
    

    it('remove should remove an item with the corresponding id', done => {
        let store = new Store(dbPath);
        store.save({ sandwich: 'Tuna' }, (err, sandwich) => {
            if(err) return done(err);
            store.remove(sandwich._id, (err, removedSuccess) => {
                if(err) return done(err);
                assert.equal(removedSuccess.removed, true);
                done();       
            });
        });
    });

});