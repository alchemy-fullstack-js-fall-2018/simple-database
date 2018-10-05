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
            error && error.code !== 'ENOENT' ? done(error) : done();
        });
    });
    
    beforeEach((done) => {
        return mkdirp(rootPath, () => {
            done();
        });
    });

    it('this should save directory from root to destination with id', (done) => {
        store.save({ fruits: 'apple' }, (error, fruit) => {
            error ? done(error) : assert.ok(fruit._id);
            assert.equal(fruit.fruits, 'apple');
            done();
        });
    });

    it('this gets file by id', (done) => {
        store.save({ fruits: 'apple' }, (error, fruit) => {
            if(error) return done(error);
            store.get((fruit._id), (error, fruitObject) => {
                error ? done (error) : assert.deepEqual(fruit, fruitObject);
                done();
            });
        });
    });

    it('this will test give me a mismatched id', (done) => {
        store.get((null), (err) => {
            err !== null ? done(err) : assert.equal(err, null);
            done();
        });
    });

    it('this will remove a file by id and return true', (done) => {
        store.save({ fruits: 'apple' }, (error, fruit) => {
            if(error) done(error);
            store.remove(fruit._id, (err, object) => {
                if(error) return done(error);
                assert.equal(object.removed, true);
                done();
            });
        });
    });

    it('this will get all my files', (done) => {
        store.save({ fruits: 'apple' }, (err) => {
            if(err) done(err);
            store.getAll((err, array) => {
                if(err) return done(err);
                assert.equal(array.length, 1);
                done();
            });
        });
    });

    it('returns an empty array when getAll finds nothing', (done) => {
        store.getAll((err, objects) => {
            if(err) return done(err);
            assert.equal(objects.length, 0);
            done();
        });
    });
});
















