const shortId = require('shortid');
const fs = require('fs'); //fs allows us to write a file
const path = require('path');


module.exports = class Store {
    constructor(dbPath) {
        this.dbPath = dbPath; 
    }

    save(whale, callback) {
        whale._id = shortId.generate();
        const storableWhale = JSON.stringify(whale);
        
        fs.writeFile(path.join(this.dbPath, `${whale._id}.json`), storableWhale, error => {
            if(error) {
                callback(error); 
            }
            else {
                callback(null, whale);
            }
        });
    }

    get(id, callback) {
        const filePath = path.join(this.dbPath, `${id}.json`);

        fs.readFile(filePath, (error, data) =>{
            if(error) {
                callback(error);
            }
            else {
                callback(null, JSON.parse(data));
            }
        });
          
    }

    remove(_id, callback) {
        const filePath = path.join(this.dbPath, `${_id}.json`);
        fs.unlink(filePath, (err) => {
            if(err && err.code === 'ENOENT') {
                callback(null, { removed: false });
            } else if(err) {
                callback(err);
            } else {
                callback(null, { removed: true });
            }
        });
    }
};
