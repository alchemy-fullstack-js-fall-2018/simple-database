const fs = require('fs');
const path = require('path');

module.exports = class Store {

    constructor(path) {

        this.path = path;

    }

    save(objectToSave, callback) {

        const data = JSON.stringify(objectToSave);
        const filePath = path.join(this.path, 'test');
        fs.writeFile(filePath, data, (err) => {
            if(err) return callback(err);
            return callback(err, data);
        });

    }

};

