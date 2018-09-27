const { writeFile, readFile, unlink, readdir } = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    save(object, callback) {
        
        object._id = shortid.generate();
        const destFileName = path.join(this.rootDirectory, `${object._id}.json`);
        const fileContents = JSON.stringify(object);
        writeFile(destFileName, fileContents, (err) => {
            if(err) {
                callback(err);
            } else {
                this.get(object._id, (err, object) => {
                    callback(err, object);
                });
            }
        });
    }

    get(_id, callback) {
        const filePath = path.join(this.rootDirectory, `${_id}.json`);
        readFile(filePath, (err, string) => {
            if(err && err.code === 'ENOENT') {
                callback(null, null);
            } else if(err) {
                callback(err);
            } else {
                let parsed = JSON.parse(string);
                callback(null, parsed);
            }
        });
           
    }

    remove(_id, callback) {
        const filePath = path.join(this.rootDirectory, `${_id}.json`);
        unlink(filePath, (err) => {
            if(err && err.code === 'ENOENT') {
                callback(null, { removed: false });
            } else if(err) {
                callback(err);
            } else {
                callback(null, { removed: true });
            }
        });
    }

    getAll(callback) {
        const results = [];
        readdir(this.rootDirectory, (err, object) => {
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


