var shortid = require('shortid');

module.exports = class Store {
    constructor(animal) {
        this.animal = animal;
    }

    newFile() {
        let fileName = shortid.generate() + '.json';
        console.log('fileName', fileName);
        return fileName;
    }

};
