const shortid = require('shortid');
const fs = require('fs');
const path = require('path');


module.exports = class Store {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }
    

    save(objToSave, callback) {
        objToSave.id = shortid.generate();
        const storableObj = JSON.stringify(objToSave);

        fs.writeFile(path.join(this.dbPath, `${objToSave.id}.json`), storableObj, err => {
            if(err) {
                callback(err);  
            } else {
                callback(null, objToSave);
            } 
        });
    }

    get(objId, callback) {
        fs.readFile(path.join(this.dbPath, `${objId}.json`), (err, requestedObj) => {
            if(err && err.code === 'ENOENT') {
                callback(null);
            } else if(err) {
                callback(err);
            } else {
                const parsedObj = JSON.parse(requestedObj);
                callback(null, parsedObj);
            }
        });
    }

    getAll(callback) {

        fs.readdir(this.dbPath, (err, files) => {
            if(err) callback(err);
            
            let dbContents = [
                files.forEach(file => fs.readFile(file, (err, obj) => {
                    if(err) return err;
                    file = JSON.parse(obj);
                }))
            ];
            for(let i = 0; i < files.length; i++) {
                // let file = files[i];

                // files.get(file, (err, done) => {
                //     if(err) return (err); 
                //     done(dbContents.push(file));
                // });
                // fs.readFile(path.join(this.dbPath, file), (err, obj) => {
                //     if(err)callback(err);
                //     const parsedObj = JSON.parse(obj);
                //     console.log(parsedObj);
                //     file = parsedObj;
                // });
                
                // dbContents.push(file);

            }   
            callback(null, dbContents);
        });
                
    }


    

    remove(objId, callback) {

        let removedStatus = { removed: false };

        fs.unlink(path.join(this.dbPath, `${objId}.json`), err => {
            if(err && err.code === 'ENOENT') {
                callback(null, removedStatus);
            } else if(err) {
                callback(err);
            } else {
                removedStatus.removed = true;
                callback(null, removedStatus);
            }
        });
    }
};

