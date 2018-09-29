const assert = require('assert');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');

const dbPath = path.join(__dirname, 'book-db');


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
    
    it('saves a file that has an id property', done => {
        const store = new Store(dbPath);
        store.save({ title: 'Moby Dick' }, (err, book) => {
            if(err) return done(err);

            assert.ok(book.id);
            done();
        });
    });

    it('saves file to disk', done => {
        const store = new Store(dbPath);
        store.save({ title: 'Moby Dick' }, (err, book) => {
            if(err) return done(err);

            const readFile = path.join(dbPath, `${book.id}.json`);
            const destContents = fs.readFileSync(readFile, 'utf8');
            assert.equal(JSON.parse(destContents).title, 'Moby Dick');
            done();
        });
    });
    
    it('gets file when passed an id', done => {
        const store = new Store(dbPath);
        
        store.save({ title: 'Moby Dick' }, (err, book) => {
            if(err) return done(err);
            
            store.get(book.id, (err, existingBook) => {
                if(err) return done(err);
                assert.deepEqual(existingBook, book);
                done();
            });

        });
    });

    it('gets null when incorrect id is passed', done => {
        const store = new Store(dbPath);
        
        store.get('iAmNotARealFile', (err, existingBook) => {
            if(err) return done(err);
            assert.equal(existingBook, null);
            done();
        });

    });
    
    it('removes file when passed a valid id', done => {
        const store = new Store(dbPath);

        store.save({ title: 'Moby Dick' }, (err, book) => {
            if(err) return done(err);

            store.remove(book.id, (err, removeObj) => {
                if(err) return done(err);
                assert.equal(removeObj.removed, true);
                done();
            });

        });
    });

    it.only('gets all objects in database', done => {
        const store = new Store(dbPath);       
        
        store.save({ title: 'Moby Dick' }, (err, book1) => {
            if(err) return done(err);

            store.save({ title: 'Hunger Games' }, (err, book2) => {
                if(err) return done(err);

                store.getAll((err, arrOfObjs) => {
                    if(err) done(err);
                    assert.equal(arrOfObjs, [book1, book2]);
                });
            });
        });
    });
});

