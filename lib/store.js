const shortid = require('shortid');
const fs = require('fs');
const path = require('path');


module.exports = class Store {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }
    

    save(objToSave, callback) {
        objToSave.id = shortid.generate();
        const storableObj = JSON.stringify(objToSave);

        fs.writeFile(path.join(this.dbPath, `${objToSave.id}.json`), storableObj, err => {
            if(err) {
                callback(err);  
            } else {
                callback(null, objToSave);
            } 

        });
    }

    get(objId, callback) {
        fs.readFile(path.join(this.dbPath, `${objId}.json`), (err, requestedObj) => {
            if(err && err.code === 'ENOENT') {
                callback(null);
            } else if(err) {
                callback(err);
            } else {
                const parsedObj = JSON.parse(requestedObj);
                callback(null, parsedObj);
            }
        });
    }

    remove(objId, callback) {

        let removedStatus = { removed: false };

        fs.unlink(path.join(this.dbPath, `${objId}.json`), err => {
            if(err) {
                callback(err);
            } else {
                removedStatus.removed = true;
                callback(null, removedStatus);
            }
        });
    }
};

