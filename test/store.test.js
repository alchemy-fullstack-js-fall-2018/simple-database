const assert = require('assert');
const fs = require('fs');
const path = require ('path');
const Store = require ('../lib/store');

it ('gets existing file', (done) => {
    const store = new Store ('cats');
    store.get('luna.json', (err, objectFromFile) => {
        if(err) return done(err);
        assert.deepEqual(objectFromFile, { name:'Luna' });
        done();
    });
});