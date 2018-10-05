
const shortid = require('shortid');
const { writeFile, readFile, unlink, readdir } = require('fs');
const path = require('path');

module.exports = class Store {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }

    save(item, callback) {
        item._id = shortid.generate();
        const storableItem = JSON.stringify(item);
        writeFile(path.join(this.dbPath, `${item._id}.json`), storableItem, err => {
            if(err) {
                callback(err);
            }
            else {
                callback(null, item);
            }

        }); 
    }

    get(id, callback) {
        readFile(path.join(this.dbPath, `${id}.json`), (err, item) => {
            if(!item) {
                callback(null, null);
            }
            else if(err) {
                callback(err);
            
            }
            else {
                callback(null, JSON.parse(item));
            }
        });
    }

    delete(id, callback) {
        const destPath = path.join(this.dbPath, `${id}.json`);

        unlink(destPath, err => {
            if(err && err.code !== 'ENOENT') callback(err);
            const status = err ? { removed: false } : { removed: true };
            callback(null, status);
        });
    }

    getAll(callback) {
        const results = [];
        readdir(this.dbPath, (err, object) => {
            if(err) return callback(err);
            let count = object.length;
            if(count === 0) return callback (err, results);
            object.forEach(file => {
                this.get(file, (err, objectFromFile) => {
                    if(err) return callback(err);
                    results.push(objectFromFile);
                    count--;
                    if(count === 0) return callback(err, results);
                });
            });
        });
    }
}; 