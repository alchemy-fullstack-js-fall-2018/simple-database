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
            assert.equal(whale.species, JSON.parse(file).species);
            done();
        });
    });

    it('gets a whale??', done => {
        const store = new Store(path.join(dbPath));
        store.get('_0bzJV7lsB', (error, whale) => {
            if(error) return done(error);
            const file = fs.readFileSync(path.join(dbPath, '_0bzJV7lsB.json'), 'utf8');
            assert.deepEqual(whale, JSON.parse(file));
            done();
        });
    });

    it('removes a whale', done => {
        const store = new Store(path.join(dbPath));
        store.save({ species: 'Blue Whale' }, (error, whale) => {
            if(error) return done(error);

            store.remove(whale._id, (error, statusObj) => {
                if(error) return done(error);
                assert.deepEqual(statusObj, { removed: true });
            });
            done();
        });
    });

    // it('returns an array of all whales', done => {
    //     const store = new Store(path.join(dbPath));
    //     store.save({ species: 'Green Whale' }, (error, greenWhale) => {
    //         if(error) return done(error);
    //     });
    //     store.save({ species: 'Purple Whale' }, (error, purpleWhale) => {
    //         if(error) return done(error);
    //     });
    //     store.getAll((err, whales) => {
    //         if(err) return done(err);
    //         assert.deepEqual(whales, [{ species: 'Green Whale' }, { species: 'Purple Whale' }])
    //     });
    // });





});