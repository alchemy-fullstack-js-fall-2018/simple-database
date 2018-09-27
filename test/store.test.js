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
                if(err) return done(err);
                assert.ok(item._id);
                assert.deepEqual(item, { '_id': item._id, 'test':'sloth' });
                done();
            }); 
        });
    });

    it('returns null if file does not exist', done => {
        const store = new Store(databasePath);
        store.get('badId', (err, item) => {
            if(err && err.code !== 'ENOENT') return done(err);
            assert.equal(item, null);
            done();
        });
    });

    it('returns true if the file is removed', done => {
        const store = new Store(databasePath);
        store.save({ 'test':'sloth' }, (err, itemSaved) => {
            if(err) return done(err);
            store.remove(itemSaved._id, (err, item) => {
                if(err) return done(err);
                assert.equal(item.removed, true);
                done();
            }); 
        });
    });

    it('returns false if file does not exist', done => {
        const store = new Store(databasePath);
        store.remove('badId', (err, item) => {
            if(err && err.code !== 'ENOENT') return done(err);
            assert.equal(item.removed, false);
            done();
        });
    });

    it('proves file is actually removed by the get method', done => {
        const store = new Store(databasePath);
        store.save({ 'test':'sloth' }, (err, itemSaved) => {
            if(err) return done(err);
            store.remove(itemSaved._id, (err) => {
                if(err) return done(err);
                store.get(itemSaved._id, (err, item) => {
                    if(err && err.code !== 'ENOENT') return done(err);
                    console.log(item);
                    assert.equal(item, null);
                    done();
                });
            }); 
        });
    });

    it('returns an array of objects if the files exist', done => {
        const store = new Store(databasePath);
        const items = [        
            { test: 'sloth' }, 
            { test: 'cheetah' }
        ];
        items.forEach(item => {
            store.save(item, (err) => {
                if(err) return done(err);
            });
        });
        store.getAll((err, itemArr) => {
            if(err) return done(err);
            assert.equal(itemArr.length, items.length);
            done();
        });
    });

    it('returns an empty array if files do not exist', done => {
        const store = new Store(databasePath);
        store.getAll((err, itemArr) => {
            if(err) return done(err);
            assert.equal(itemArr.length, 0);
            done();
        });
        

    }); 
    
});
