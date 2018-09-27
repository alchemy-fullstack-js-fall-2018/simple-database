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
        const filePath = path.join(this.path, `${objectToSave._id}.json`);
        fs.writeFile(filePath, data, (err) => {
            if(err) return callback(err);
            const dataObj = JSON.parse(data);
            return callback(err, dataObj);
        });
    }

    get(id, callback) {

        const filePath = path.join(this.path, `${id}.json`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            let content;
            if(err && err.code !== 'ENOENT') callback(err);
            else if(data) content = JSON.parse(data);
            else content = null;
            return callback(err, content);
        });

    }



};

