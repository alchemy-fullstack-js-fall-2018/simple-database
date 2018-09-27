const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Store = require('../lib/store');

const dbPath = path.join(__dirname, 'sandwiches')

describe('save', () => {
    it('should add an id to a sandwich', done => {
        let store = new Store(dbPath);
        store.save({ name: 'Reuben' }, (err, sandwich) => {
            if(err) return done(err);
            assert.ok(sandwich._id);
            done();
        });        
    });

    it('should write the object to a file', done => {
        let store = new Store(dbPath);
        store.save({ name: 'Hoagie' }, (err, sandwich) => {
            if(err) return done(err);
            const file = fs.readFileSync(path.join(dbPath, `${sandwich._id}.json`), 'utf8');
            
            assert.equal(sandwich, );
        });
    });
});