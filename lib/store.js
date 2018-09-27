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
            if(err && err.code !== 'ENOENT') callback(err);
            const content = data ? JSON.parse(data) : null;
            return callback(err, content);
        });
    }

    remove(id, callback) {

        const filePath = path.join(this.path, `${id}.json`);
        fs.unlink(filePath, (err) => {
            if(err && err.code !== 'ENOENT') return callback(err);
            const status = err ? { removed: false } : { removed: true };
            return callback(err, status);
        });
    }


};

