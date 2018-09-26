const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Store = require('../lib/store');

describe('save', () => {
    it('should add an id to a sandwich', () => {
        let store = new Store();
        const sandwich = store.save({ name: 'Reuben' });        
        assert.ok(sandwich._id);
    });
});