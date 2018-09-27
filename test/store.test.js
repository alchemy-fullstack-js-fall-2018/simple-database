
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/store');

const dbPath = path.join(__dirname, 'simpleDB');

const pretest = () => {

    beforeEach(done => {
        rimraf(dbPath, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });

    beforeEach(done => {
        mkdirp(dbPath, err => {
            if(err) return done(err);
            else done();
        });
    });
};

describe('it saves stuff', () => {

    pretest();

    it('returns the passed in object', done => {

        const store = new Store(dbPath);
        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            const testObject = objSaved;
            assert.deepEqual(testObject['testing'], [1, 1, 2, 3]);
            done();
        });
    });

    it('saves the object to a file', done => {
        const store = new Store(dbPath);
        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            const filename = objSaved._id + '.json';
            const savedPath = path.join(dbPath, filename);
            const destFile = fs.readFileSync(savedPath, 'utf8');
            const destObj = JSON.parse(destFile);
            assert.deepEqual(objSaved.testing, destObj.testing);
            done();
        });
    });

    it('gives the object an _id property', done => {
        const store = new Store(dbPath);
        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            const idObject = objSaved._id;
            assert.equal(typeof idObject, 'string');
            done();
        });
    });

    it('saves to path with same name as _id property', done => {
        const store = new Store(dbPath);
        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            const idObject = objSaved._id;
            const filename = idObject + '.json';
            const dirObj = fs.readdirSync(dbPath);
            assert.equal(filename, dirObj[0]);
            done();
        });
    });
});

describe('it gets stuff', () => {

    pretest();

    it('gets the object from file', done => {

        const store = new Store(dbPath);
        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            const idObject = objSaved._id;
            store.get(idObject, (err, objFile) => {
                if(err) return done(err);
                assert.deepEqual(obj.testing, objFile.testing);
                done();
            });
        });
    });

    it('returns null if object does not exist', done => {

        const store = new Store(dbPath);
        store.get('', (err, objFile) => {
            if(err && err.code !== 'ENOENT') return done(err);
            assert.equal(null, objFile);
            done();
        });
    });


});
