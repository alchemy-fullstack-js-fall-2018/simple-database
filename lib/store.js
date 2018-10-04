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
            if(err && err.code !== 'ENOENT') callback(null, null);
            
            else if(err) callback(err);
            else callback(null, JSON.parse(data));
        });
    }

    remove(id, callback) {
        fs.unlink(path.join(this.dbPath, `${id}.json`), err => {
            if(err && err.code === 'ENOENT') callback(null, { removed: false });
            else if(err) callback(err);
            else callback(null, { removed: true });
        });
    }

    getAll(callback) {
        fs.readdir(this.dbPath, (err, files) => {
            if(err) return callback(err);

            let counter = files.length;
            let items = [];

            files
                .map(file => file.replace('.json', ''))
                .forEach(id => {
                    this.get(id, (err, item) => {
                        if(err) return callback(err);
                        items.push(item);
                        counter--;
                        if(counter === 0) callback(null, items);
                    });
                });
        });
    }
};
