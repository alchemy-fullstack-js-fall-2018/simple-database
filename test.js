const Store = require('./lib/store');
const myStore = new Store();

myStore.save({ animal: 'cat' }, (err, animal) => {
    console.log('I finished saving', err, animal);
});
