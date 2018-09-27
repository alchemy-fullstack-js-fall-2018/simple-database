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
};

