const assert = require('assert');
const mkdirp = require('mkdirp');
const rimraf = require ('rimraf');
const Store = require ('../lib/store');

describe('simple database of JSON files', () => {

    const DATABASE_NAME = 'cats';
    const store = new Store (DATABASE_NAME);

    beforeEach(done => {
        rimraf(DATABASE_NAME, err => {
            if(err && err.code !== 'ENOENT') return done(err);
            mkdirp(DATABASE_NAME, function(err) {
                if(err) return done(err);
                done(err);
            });
        });
    });

    it('saves an object as a file, then gets it by id', (done) => {
        const objectToSave = { name: 'Ember' };
        store.save (objectToSave, (err, objectThatSaved) => {
            if(err) return done(err);
            const hasId = objectThatSaved.hasOwnProperty('_id');
            assert.deepEqual(hasId, true);
            store.get(objectThatSaved._id, (err, objectFromFile) => {
                if(err) return done(err);
                assert.deepEqual(objectFromFile, objectThatSaved);
                done();
            });
        });
    });

    it('returns null when attempting to get file that doesn\'t exist', (done) => {
        store.get('DoesNotExist', (err, objectFromFile) => {
            if(err) return done(err);
            assert.deepEqual(objectFromFile, null);
            done();
        });
    });

    it('saves an object, removes it, then returns null when attempting to get it', (done) => {
        const objectToSave = { name: 'Ember' };
        store.save (objectToSave, (err, objectThatSaved) => {
            if(err) return done(err);
            store.remove(objectThatSaved._id, (err, statusObj) => {
                if(err) return done(err);
                assert.deepEqual(statusObj, { removed: true });
                store.get('objectThatSaved._id', (err, objectFromFile) => {
                    if(err) return done(err);
                    assert.deepEqual(objectFromFile, null);
                    done();
                });
            });
        });
    });

    it('returns false object when attempting to remove file that doesn\'t exist', done => {
        store.remove('DoesNotExist', (err, statusObj) => {
            if(err) return done(err);
            assert.deepEqual(statusObj, { removed: false });
            done();
        });
    });
    
    it('getAll returns an empty array when no objects exist', (done) => {
        store.getAll((err, objects) => {
            if(err) return done(err);
            assert.deepEqual(objects, []);
            done();
        });
    });

    it('getAll returns an array of all objects in the store', (done) => {
        store.save ({ name: 'Ember' }, (err, object1) => {
            if(err) return done(err);
            store.save ({ name: 'Luna' }, (err, object2) => {
                if(err) return done(err);
                store.save ({ name: 'Smooch' }, (err, object3) => {
                    if(err) return done(err);
                    store.getAll((err, objects) => {
                        if(err) return done(err);
                        //assert.deepEqual(objects, [object1, object2, object3]);
                        assert.equal(objects.length, 3);
                        done();
                    });
                });
            });
        });
    });

});

