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

    get(id, callback) {
        const filePath = path.join(this.path, `${id}.json`);
        fs.readFile(filePath, (err, data) => {
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

