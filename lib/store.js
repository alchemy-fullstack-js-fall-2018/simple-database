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
        fs.readFile(path.join(this.dbPath, `${id}.json`), something, err => {
            if(err){
                callback(err);
            }
        });

    }
};
