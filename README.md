# Simple Database

This application saves objects as JSON files in a folder.  It supports the following functions:

1. `.save(<objectToSave>, <callback(error, objectThatSaved)>)`

    Saves an object in the store.  The object is returned with the id that it was assigned.

1. `.get(<id>, <callback(error, objectFromFile)>)`

    Gets an object by its id.

1. `.remove(<id>, <callback(error, removedSuccessObject)>)`

    Removes as object when given its id.

1. `.getAll(<callback(error, arrayOfObjects)>)`

    Returns an array of all objects in the store, or an empty array if no objects exist.

The functions run asynchronously and execute a callback function when finished. 