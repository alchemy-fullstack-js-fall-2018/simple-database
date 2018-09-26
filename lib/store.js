const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {

    constructor(path) {
        this.path = path;
    }

    save(objectToSave, callback) {

        objectToSave._id = shortid.generate();
        const data = JSON.stringify(objectToSave);
        const filename = objectToSave._id + '.json';
        const filePath = path.join(this.path, filename);
        fs.writeFile(filePath, data, (err) => {
            if(err) return callback(err);
            const dataObj = JSON.parse(data);
            return callback(err, dataObj);
        });
    }



};

