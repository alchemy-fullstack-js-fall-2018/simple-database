const fs = require('fs');
const path = require('path');
var shortid = require('shortid');

module.exports = class Store {

    constructor(folderName) {
        this.folderName = folderName;
    }

    save(objectToSave, callback) {  // callback(error, objectThatSaved)
        const id = shortid.generate();
        const destPath = path.join(this.folderName, id);
        const contents = JSON.stringify(objectToSave);
        fs.writeFile(destPath, contents, err => {
            if(err) return callback(err);
            callback(err, JSON.parse(contents));
        });
    }

    get(id, callback) {  // callback(error, objectFromFile)
        const sourcePath = path.join(this.folderName, id);
        fs.readFile(sourcePath, (err, JSONContents) => {
            if(err) return callback(err);
            const obj = JSON.parse(JSONContents);
            callback(err, obj);
        });
    }

    remove(id, callback) {  // callback(error, removedSuccessObject)
        const pathToDelete = path.join(this.folderName, id);
        const objFalse = { removed: false };
        const objTrue = { removed: true };
        fs.unlink(pathToDelete, (err) => {
            if(err && err.code !== 'ENOENT') return callback (err, objFalse);
            callback (null, objTrue);
        });
    }

    getAll(callback) { // callback(error, arrayOfObjects)
        const arrayOfObjects = [];
        fs.readdir(this.folderName, (err, files) => {
            if(err) return callback(err);
            let count = files.length;
            files.forEach(file => {
                this.get(file, (err, objectFromFile) => {
                    if(err) return callback(err);
                    arrayOfObjects.push(objectFromFile);
                    count--;
                    if(count === 0) callback(err, arrayOfObjects);
                });
            });
        });
    }

};