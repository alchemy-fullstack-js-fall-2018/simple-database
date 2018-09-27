var shortid = require('shortid');

module.exports = class Store {
    constructor() {
    
    }

    save(item, callback) {
        item._id = shortid.generate();
        callback(null, item);
    }

};
