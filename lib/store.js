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

            let count = files.length;
            const allObj = [];

            files.forEach(file => {
                const id = file.split('.')[0];
                this.get(id, (err, obj) => {
                    if(err) return callback(err);
                    allObj.push(obj);
                    count --;
                    if(count === 0) return callback(err, allObj);
                });
            });
        });
    }


    // For code demo tomorrow:

    // getAll(callback) {

    //     const filePath = path.join(this.path);
    //     fs.readdir(filePath, (err, files) => {
    //         if(err && err.code !== 'ENOENT') callback(err);

    //         let count = files.length;

    //         let allObj = files.reduce((acc, file, index) => {

    //             const id = file.split('.')[0];

    //             this.get(id, (err, obj) => {
    //                 if(err) return callback(err);
    //                 acc.push(obj);

    //                 console.log('obj', index + 1, 'is', obj);
    //                 console.log('acc after obj', index + 1, 'is', acc);

    //                 count--;
    //             });
    //             console.log('reduce at index', index);
    //             console.log('count is...', count);
    //             return acc;
    //         }, []);

    //         if(count === 0) {
    //             console.log('now I can call back');
    //             return callback(err, allObj);
    //         }
    //     });


    // }


    remove(id, callback) {

        const filePath = path.join(this.path, `${id}.json`);
        fs.unlink(filePath, (err) => {
            if(err && err.code !== 'ENOENT') return callback(err);
            const status = err ? { removed: false } : { removed: true };
            return callback(err, status);
        });
    }


};

