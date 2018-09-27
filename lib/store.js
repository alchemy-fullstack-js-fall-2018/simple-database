const path = require('path');
const { writeFile, readFile, unlink } = require('fs');
const shortid = require('shortid');


module.exports = class Store {
    constructor(rootPath) {
        this.rootPath = rootPath;
    }
    
    save(objectToSave, callback) {
        objectToSave._id = shortid.generate();
        const newDestination = path.join(this.rootPath, `${objectToSave._id}.json`);
        const fileStuff = JSON.stringify(objectToSave);
        writeFile(newDestination, fileStuff, (err) => {
            if(err) {
                return callback(err);
            } else {
                callback(null, objectToSave); 
            } 
        });
    }   

    get(_id, callback) {
        const newDestinationPath = path.join(this.rootPath, `${_id}.json`);
        readFile(newDestinationPath, (err, string) => {
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
        const newDestinationPath = path.join(this.rootPath, `${_id}.json`);
        unlink(newDestinationPath, (err) => {
            if(err && err.code === 'ENOENT') {
                callback(null, { removed: false });
            } else if(err) {
                callback(err);
            } else {
                callback(null, { removed: true });
            }
        });
    }
};
