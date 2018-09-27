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
                // callback(null, whale);
                this.get(whale._id, callback);
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
};