const path = require('path');
const assert = require('assert');
const Store = require('../lib/store');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

describe('stores and retrieves objects from filesystem', () => {

    const rootPath = path.join(__dirname, 'base');
    const store = new Store(rootPath);

    beforeEach(done => {
        return rimraf(rootPath, error => {
            if(error && error.code !== 'ENOENT') done(error);
            else done();
        });
    });
    
    beforeEach(() => {
        return mkdirp(rootPath);
    });

    it('this should save directory from root to destination with id', (done) => {
        store.save({ fruits: 'apple' }, (error, fruit) => {
            error ? done(error) : assert.ok(fruit._id);
            done();
        });
    });

    it('this gets file by id', (done) => {
        store.save({ fruits: 'apple' }, (error, fruit) => {
            if(error) return done(error);
            store.get((fruit._id), (error, fruitObject) => {
                error ? done (error) : assert.deepEqual(fruit, fruitObject);
            });
            done();
        });
    });

    it('this will test give me a mismatched id', (done) => {
        store.get((null), (err) => {
            err !== null ? done(err) : assert.equal(err, null);
            done();
        });
    });
    
    
});




// .get(<id>, <callback(error, objectFromFile)>)
// Takes a callback which takes an error and the deserialized (JSON.parse) object that has that id
// If an object with that id does not exists, objectFromFile is null















