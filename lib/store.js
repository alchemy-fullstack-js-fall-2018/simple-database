const shortid = require('shortid');

module.exports = class Store {
    constructor(dir) {
        this.dir = dir;
    }

    save(object) {
        object._id = shortid.generate();
        return object;
    }
};
