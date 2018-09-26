const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
module.exports = class Store {
    constructor(path){
        this.path = path;
    }

    save(objToSave, callback) {
        objToSave._id = shortid.generate();
        const data = JSON.stringify(objToSave);
        const filePath = path.join(this.path, `${objToSave._id}.json`);
        fs.writeFile(filePath, data, (err) => {
            if(err) return callback(err);
            const obj = JSON.parse(data);
            return callback(err, obj);
        });

    }
};

