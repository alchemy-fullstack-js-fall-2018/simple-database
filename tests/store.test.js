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
            else {
                mkdirp(dbPath, err => {
                    if(err) return done(err);
                    done();
                });
            }
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
        store.save({ sandwich: 'Reuben' }, (err, sandwich) => {
            if(err) return done(err);
            
            const fileToGet = JSON.parse(fs.readFileSync(path.join(dbPath, `${sandwich._id}.json`)), 'utf8');
            store.get(fileToGet._id, (err, sandwich) => {
                if(err) return done(err);
                assert.deepEqual(sandwich.sandwich, 'Reuben');
                done();
            });
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
            const fileToRemove = JSON.parse(fs.readFileSync(path.join(dbPath, `${sandwich._id}.json`)), 'utf8');
            store.remove(fileToRemove._id, (err, removedStatus) => {
                if(err) return done(err);
                assert.equal(removedStatus.removed, true);
                done();       
            });
        });
    });

    it.skip('remove should return {removed: false} if passed a bad id', done => {
        let store = new Store(dbPath);
        store.remove('someBadID', (err, removedStatus) => {
            if(err) {
                assert.equal(removedStatus.removed, false);
                done();
            }
        });
    });

    it('getAll should return an array of the objects in the directory', done => {
        let store = new Store(dbPath);
        store.save({ sandwich: 'Cucumber' }, (err, Cucumber) => {
            if(err) return done(err);
            store.save({ sandwich: 'Porchetta' }, (err, Porchetta) => {
                if(err) return done(err);
                store.getAll((err, sandwiches) => {
                    if(err) return done(err);
                    const expected = [Cucumber, Porchetta].sort((a, b) => {
                        if(a._id > b._id) return 1;
                        if(a._id < b._id) return -1;
                        return 0;
                    });
                    assert.deepEqual(sandwiches, expected);
                    done();
                });
            });
        });
    });
});