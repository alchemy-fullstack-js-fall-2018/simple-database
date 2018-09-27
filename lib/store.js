const { writeFile } = require('fs');
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
            if(err) callback(err);
            callback(null, object);
        });
        
    }

};

