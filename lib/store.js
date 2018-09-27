var shortid = require('shortid');
const fs = require('fs');
const path = require('path');

module.exports = class Store {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }

    save(item, callback) {
        item._id = shortid.generate();
        const storableItem = JSON.stringify(item);
        fs.writeFile(path.join(this.dbPath, `${item._id}.json`), storableItem, err => {
            if(err) {
                callback(err);
            }
            else {
                callback(null, item);
            }
        });
    }

    get(_id, callback) {
        fs.readFile(path.join(this.dbPath, `${_id}.json`), (err, file) => {
            if(err) {
                callback(null);
            }
            else {
                callback(null, JSON.parse(file));
            }
        });
    }

};
