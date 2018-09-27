const assert = require('assert');
const Store = require('../lib/store');

describe('store', () => {
    const dbPath = path.join(_dirname, 'dinosaurs');

    it('adds id to object', () => {
        const store = new Store();
        store.save({ name: 'little foot' }, (err, dinosaur) => {
            if(err) return done(err);
        });
        assert.ok(object.id);
    });
    it('saves object to a file', () => {
        const store = new Store(dbPath);
        store.save({ name: 'little foot' }, (err, dinosaur) => {
            if(err) return done(err);
            console.log('name', name);
            const file = fs.readFilerSync(path.join{dbPath, `${name._id}.JSON`}, 'utf8');
            assert.equal(JSON.parse(file).name, 'little foot');
            done();
        });
    });
});
