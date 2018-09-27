const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {

    constructor(path) {
        this.path = path;
    }

    save(objectToSave, callback, id) {

        objectToSave._id = id || shortid.generate();
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

    getList(ids, callback) {

        let count = ids.length;
        const allObj = [];
        ids.forEach(id => {
            this.get(id, (err, obj) => {
                if(err) return callback(err);
                allObj.push(obj);
                count --;
                if(count === 0) return callback(err, allObj);
            });
        });
    }

    getAll(callback) {

        const filePath = path.join(this.path);
        fs.readdir(filePath, (err, files) => {
            if(err && err.code !== 'ENOENT') callback(err);
            if(files.length == 0) return callback(err, []);

            let count = files.length;
            const allObj = [];

            files
                .map(file => file.split('.')[0])
                .forEach(id => {
                    this.get(id, (err, obj) => {
                        if(err) return callback(err);
                        allObj.push(obj);
                        count --;
                        if(count === 0) return callback(err, allObj);
                    });
                });
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

    update(obj, callback) {

        this.remove(obj._id, (err) => {
            if(err) return callback(err);
            this.save(obj, (err) => {
                if(err) return callback(err);
                return callback(err, obj);
            }, obj._id);

        });

    }


};

