const { writeFile, readFile, unlink } = require('fs');
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
            err ? callback(err) : callback(err, object);
        });
    }

    get(_id, callback) {
        const filePath = path.join(this.rootDirectory, `${_id}.json`);
        readFile(filePath, (err, object) => {
            err && err.code === 'ENOENT' ? callback(null, object) : callback(err);
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
};


