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

        fs.readFile(path.join(this.dbPath, `${objId}.json`), (err, obj) => {
            if(err && err.code === 'ENOENT') {
                callback(null);
            } else if(err) {
                callback(err);
            } else {
                const parsedObj = JSON.parse(obj);
                callback(null, parsedObj);
            }
        });
    }




    getAll(callback) {
        // let files = fs.readdirSync(this.dbPath, 'utf8');
        // let parsedFiles = files.map(
        //     file => JSON.parse(fs.readFileSync(path.join(this.dbPath, file)))
        // );
        // parsedFiles.reverse();
        // callback(null, parsedFiles);
        // fs.readdir(this.dbPath, (err, files) => {
        //     if(err) callback(err);
        //     let parsedFiles = files.map(
        //         file => JSON.parse(fs.readFileSync(path.join(this.dbPath, file)))
        //     );
        //     callback(null, parsedFiles);
        // });

        fs.readdir(this.dbPath, (err, files) => {
            if(err) return callback(err);

            let counter = files.length;
            let items = [];

            files
                .map(file => file.replace('.json', ''))
                .forEach(id => 
                    this.get(id, (err, item) => {
                        if(err) return err;
                        items.push(item);
                        counter--;           
                        if(counter === 0) callback(null, items);
                    })); 
        });
    
    }
   

    remove(objId, callback) {


        fs.unlink(path.join(this.dbPath, `${objId}.json`), err => {
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

