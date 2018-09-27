const shortId = require('shortid');

module.exports = class Store {
    constructor(path) {
        this.path = path; 
    }
    save(whale, callback) {
        whale._id = shortId.generate();
        callback(null, whale);
    }
};