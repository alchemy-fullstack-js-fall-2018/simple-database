const shortid = require('shortid');
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
            if(err){
                callback(err);
            } 
            else {
                callback(null, item);
            }            
        });
    }

    get(id, callback) {
        fs.readFile(path.join(this.dbPath, `${id}.json`), (err, data) => {
            if(err && err.code !== 'ENOENT'){
                callback(err, null);
            }
            else {
                if(data) {
                    callback(null, JSON.parse(data));
                }
                else callback(null, null);
            }
        });
    }
};
