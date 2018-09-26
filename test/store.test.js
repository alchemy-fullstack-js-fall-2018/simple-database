
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/store');



describe('it saves stuff', () => {

    const sourcePath = path.join(__dirname, 'save-dir-source');
    const destPath = path.join(__dirname, 'save-dir-dest');

    beforeEach(done => {
        rimraf(destPath, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });

    beforeEach(done => {
        mkdirp(destPath, err => {
            if(err) return done(err);
            else done();
        });
    });

    it('saves the file', done => {

        const store = new Store(sourcePath);
        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            
            const savedPath = path.join(sourcePath, 'test');
            console.log(savedPath);
            const destFile = fs.readFileSync(savedPath);
            console.log(objSaved);
            console.log(destFile);

            // const objJSON = JSON.stringify(objSaved);
            assert.equal(objSaved, destFile);
            done();
        });
    });

});
