const shortid = require('shortid');

module.exports = class Store {
    constructor(dir) {
        this.dir = dir;
    }

    save(item, callback) {
        item._id = shortid.generate();
        callback(null, item);
        return item;
    }
};
