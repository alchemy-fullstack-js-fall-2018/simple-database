const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Store = require('../lib/store');
// const rimraf = require('rimraf');


describe('save file', () => {

    const dbPath = path.join(__dirname, 'book-dir-dest');
    
    it('book has an id property', done => {
        const store = new Store(dbPath);
        store.save({ title: 'Moby Dick' }, (err, newBook) => {
            if(err) return done(err);
            assert.ok(newBook.id);
            done();
        });
    });

    it('saves file to disk', done => {
        const store = new Store(dbPath);
        store.save({ title: 'Moby Dick' }, (err, newBook) => {
            if(err) return done(err);
            const readFile = path.join(dbPath, `${newBook.id}.json`);
            const destContents = fs.readFileSync(readFile, 'utf8');
            assert.equal(JSON.parse(destContents).title, 'Moby Dick');
            done();
        });
    });
    
});
