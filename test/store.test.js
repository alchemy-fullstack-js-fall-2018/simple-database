const assert = require('assert');
const Store = require('../lib/store');
const path = require('path');
// const fs = require('fs');

describe('save', () => {
    
    it('whale exists and has an id', done => {
        const store = new Store(path.join(__dirname, 'whales'));
        store.save({ species: 'Blue Whale' }, (error, whale) => {
            if(error) return done(error);
            assert.ok(whale._id);
            done();
        });
    });
    
    // it('saves the whale to a file', done => {
    //     const store = new Store(path.join(__dirname, 'whales'));
    //     store.save({ species: 'Blue Whale' }, (error, animal) => {
    //         if(error) return done(error);

    //         const file = fs.readFileSync(path.join(dbPath, `${whale._id}.json`), 'utf8');
    //     })
    // })
    // const sourcePath = path.join(__dirname, );
    // destFile = '/whales';
    // destPath = path.join(__dirname, destFile);

    // it('whale has a file' => {

    //     }
    //     )
        
    // });
});