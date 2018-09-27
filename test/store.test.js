const assert = require('assert');
const Store = require('../lib/store');
const path = require('path');
const fs = require('fs');

describe('save', () => {

    const dbPath = path.join(__dirname, 'whales');
    
    it('whale exists and has an id', done => {
        const store = new Store(path.join(dbPath));
        store.save({ species: 'Blue Whale' }, (error, whale) => {
            if(error) return done(error);
            assert.ok(whale._id);
            done();
        });
    });
    
    it('saves the whale to a file', done => {
        const store = new Store(path.join(dbPath));
        store.save({ species: 'Blue Whale' }, (error, whale) => {
            if(error) return done(error);
            const file = fs.readFileSync(path.join(dbPath, `${whale._id}.json`), 'utf8');
            console.log('file', file);
            assert.equal(JSON.parse(file).species, 'Blue Whale');
            done();
        });
    });

});