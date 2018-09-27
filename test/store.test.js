const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store.js');

describe('Store Database', () => {

    const rootDirectory = path.join(__dirname, 'database');
    const store = new Store(rootDirectory);

    beforeEach(done => {
        return rimraf(rootDirectory, err => {
            err && err.code !== 'ENOENT' ? done(err) : done();
        });
    });

    beforeEach(() => {
        return mkdirp(rootDirectory);
    });

    it('saves a file to the database with a shortid', done => {
        store.save({ file: 'file contents' }, (err, object) => {
            err ? done(err) : assert.ok(object);
            done();
        });
    });

    it('gets file by id', done => {
        store.save({ file: 'file contents' }, (err, object) => {
            if(err) return done(err);
            store.get((object._id), (err, parsed) => {
                err ? done(err) : assert.deepEqual(object, parsed);
            });
            done();
        });
    });

    it('returns null if no object exists', done => {
        store.get((null), (err) => {
            err !== null ? done(err) : assert.equal(err, null);
            done();
        });
    });

    it('removes a file by id and returns true', done => {
        store.save({ file: 'file contents' }, (err, object) => {
            if(err) done(err);
            store.remove(object._id, (err, object) => {
                if(err) return done(err);
                assert.equal(object.removed, true);
            }); 
            done();
        });
    });

    it('removes a file and returns false if does not exist', done => {
        store.remove(null, (err, object) => {
            err ? done(err) : assert.equal(object.removed, false);
            done();
        }); 
    });

    it('gets all items in an array', done => {
        store.save({ file: 'file contents' }, (err) => {
            if(err) done(err);
            store.getAll((err, array) => {
                if(err) return done(err);
                assert.equal(array.length, 1);
            });
            done();
        });
    });

});
