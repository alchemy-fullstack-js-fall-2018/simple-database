
const assert = require('assert');
// const fs = require('fs');
// const path = require('path');
const Store = require('../lib/store');



describe('create file', () => {
    it('creates a file name: <shortid>.json', () => {
        const store = new Store;
        const randomName = store.newFile();
        assert(randomName.endsWith('.json'), 'file name ends with .json');
    });
});
