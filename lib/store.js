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

    remove(_id, callback) {
        fs.unlink(path.join(this.dbPath, `${_id}.json`), err => {
            console.log('err', err);
            if(err) {
                callback(err, { removed: false });
            }
            else {
                callback(null, { removed: true });
            }
        });
    }

    getAll(store, callback) {
        let animals = [];
        fs.readdir(this.dbPath, (err, files) => {
            console.log('getAll files', files);
            let counter = files.length;
            files.forEach(file => {
                const id = file.replace('.json', '');
                console.log('getAll id', id);
                console.log('store', store);
                store.get(id, (err, item) => {
                    console.log('get file', file);
                    if(err) {
                        callback(err);
                    }
                    else {
                        counter--;
                        animals.push(item);
                        if(counter === 0) {
                            callback(null, animals);
                        }
                    }
                });
            });
        });
       
    }

};
