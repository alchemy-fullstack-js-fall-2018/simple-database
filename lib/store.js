const path = require('path');
const { writeFile, readFile, unlink, readdir } = require('fs');
const shortid = require('shortid');


module.exports = class Store {
    
    constructor(rootPath) {
        this.rootPath = rootPath;
    }
    
    save(objectToSave, callback) {
        objectToSave._id = shortid.generate();
        const searchPath = path.join(this.rootPath, `${objectToSave._id}.json`);
        const fileStuff = JSON.stringify(objectToSave);
        writeFile(searchPath, fileStuff, (err) => {
            if(err) {
                return callback(err);
            } else {
                callback(null, objectToSave); 
            } 
        });    
    }   

    get(_id, callback) {
        const searchPath = path.join(this.rootPath, `${_id}.json`);
        readFile(searchPath, (err, string) => {
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
        const searchPath = path.join(this.rootPath, `${_id}.json`);
        unlink(searchPath, (err) => {
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
        readdir(this.rootPath, (err, object) => {
            if(err) return callback(err);
            let count = object.length;
            if(count === 0) return callback (err, results);
            object.forEach(file => {
                this.get(file, (err, objectsFromFile) => {
                    if(err) return callback(err);
                    results.push(objectsFromFile);
                    count--;
                    if(count === 0) return callback(err, results);
                });
            });
        });
    }

};


