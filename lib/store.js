const path = require('path');
const { writeFile } = require('fs');
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
            if(err) callback(err);
            else callback(null, objectToSave); 
            
        });
    }
    
}

