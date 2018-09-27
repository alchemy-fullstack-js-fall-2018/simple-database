const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

module.exports = class Store {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }
    save(dinosaur, callback) {
        dinosaur._id = shortid.generate();
        const storableItem = JSON.stringify(dinosaur);
        fs.writeFile(path.join(this.dbPath, `${dinosaur._id}.json`), storableItem, err => {
            if(err) {
                callback(err);
            }
            else {
                callback(null, dinosaur);
            }

        }); 
    }

    get(dinosaur, callback) {
        
    }
    
};
