const path = require('path');
const assert = require('assert');
const fs = require('fs');
const Store = require('../lib/store')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

describe('stores and retrieves objects from filesystem', () => {

    const rootPath = path.join(__dirname, 'base');
    const store = new Store(rootPath);

    beforeEach(done => {
        rimraf(store, error => {
            if(error && error.code !== 'ENOENT') done(error);
            else done();
        });
    });
    
    beforeEach(() => {
        mkdirp(rootPath);
    });


    it('this should save directory from root to destination with id', (done) => {
        store.save({ fruits: 'apple' }), (error, fruit) => {
            if(error) {
                done(error);             
            } else {
                assert.ok(fruit._id);
                done();
            };
        }
    })


});

