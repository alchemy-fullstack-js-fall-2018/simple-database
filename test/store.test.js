
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Store = require('../lib/store');



describe('creates file', () => {
    
    
    describe('save method', () => {
        
        const dbPath = path.join(__dirname, 'animals');

        it('adds an id to an object', done => {
            const store = new Store(dbPath);
            store.save({ animal: 'dog' }, (err, animal) => {
                if(err) return done(err);
                
                assert.ok(animal._id);
                done();
            });
        });
        
        it('saves the object to a file with a name of <_id>.json', done => {
            const store = new Store(dbPath);
            store.save({ animal: 'dog' }, (err, animal) => {
                if(err) return done(err);
                console.log('animal', animal);
                const file = fs.readFileSync(path.join(dbPath, `${animal._id}.json`), 'utf8');
                assert.equal(JSON.parse(file).animal, 'dog');
                done();
            });
            
        });

    });

});
