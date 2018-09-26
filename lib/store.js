const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = class Store {

    constructor(folderName) {
        this.folderName = folderName;
    }

    // save(objectToSave, callback) {  // callback(error, objectThatSaved)

    // }

    get(id, callback) {  // callback(error, objectFromFile)
        var err;
        callback (err, { name:'Luna' });
    }

    // remove(id, callback) {  // callback(error, removedSuccessObject)

    // }

    // getAll(callback) { // callback(error, arrayOfObjects)

    // }

}