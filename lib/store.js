const fs = require('fs');
const path = require('path');
var shortid = require('shortid');

module.exports = class Store {

    constructor(folderName) {
        this.folderName = folderName;
    }

    save(objectToSave, callback) {  // callback(error, objectThatSaved)
        const id = shortid.generate();
        objectToSave._id = id;
        const destPath = path.join(this.folderName, id);
        const contents = JSON.stringify(objectToSave);
        fs.writeFile(destPath, contents, err => {
            if(err) return callback(err);
            this.get(id, (err, savedObject) => {
                callback(err, savedObject);
            });
        });
    }

    get(id, callback) {  // callback(error, objectFromFile)
        const sourcePath = path.join(this.folderName, id);
        fs.readFile(sourcePath, (err, JSONContents) => {
            if(err && err.code === 'ENOENT') return callback (null, null);
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
            if(err && err.code === 'ENOENT') return callback (null, objFalse);
            if(err) return callback(err);
            callback (err, objTrue);
        });
    }

    getAll(callback) { // callback(error, arrayOfObjects)
        const arrayOfObjects = [];
        fs.readdir(this.folderName, (err, files) => {
            if(err) return callback(err);
            let count = files.length;
            if(count === 0) return callback (err, arrayOfObjects);
            files.forEach((file, index) => {
                this.get(file, (err, objectFromFile) => {
                    if(err) return callback(err);
                    arrayOfObjects[index] = objectFromFile;
                    count--;
                    if(count === 0) return callback(err, arrayOfObjects);
                });
            });
        });
    }

};
