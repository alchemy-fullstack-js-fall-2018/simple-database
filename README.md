# Simple Database

## Overview

This simple database allows you to save, read and delete files in a specified directory. You can also get all of the files as an array of objects. Files are saved with randomly generated characters via short.id.

## How to Use

In your .js file: 

```
const Store = require('/The Path To Store/store');
```

Then initialize your store by: 

```
const store = new Store(Path To Directory);
```

Now you can use the methods: 

```
store.save({ key:value });
store.get(id);
store.remove(id);
store.getAll()
```