
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const rimraf = require('rimraf');

const store = require('../lib/store');



describe('it saves stuff', () => {

    const sourcePath = path.join(__dirname, 'save-dir-source');
    const destPath = path.join(__dirname, 'save-dir-dest');

    beforeEach(done => {
        rimraf(destPath, err => {
            if(err && err.code !== 'ENOENT') done(err);
            else done();
        });
    });

    it('saves the file', done => {

        const obj = { testing: [1, 1, 2, 3] };
        store.save(obj, (err, objSaved) => {
            if(err) return done(err);
            
            const destFile = fs.readdirSync(destPath);
            const objJSON = JSON.stringify(objSaved);

            assert.equal(destFile, objJSON);
            done();
        });
    });

});
