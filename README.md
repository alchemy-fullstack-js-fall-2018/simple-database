Class 03 Node Architecture and Asynchronous Programming
Questions and Feedback
gitignore global
eslint
?
Learning Objectives
Have a working model of asynchronous programming in NodeJS
Write and utilize asynchronous callback functions effectively:
When calling node asynchronous APIs
When exposing a function
Utilize the filesystem
Use a class to hold onto state
Agenda
Node.JS Architecture
What is it?
Node Event Loop
Basic node architecture 101
v8 + event-loop + os-lib
Thread - actual "thread of execution"
Event loop explained
JavaScript single threaded event model
Demo: event-loop.js
Passing functions in javascript
How do we
return values?
Propagate errors?
JavaScript Async Callback Styles
"Old School" Node callback pattern: callback(err, result)
Promises FTW!
Promise FTW!s async/await FTW!
Some hard rules:
You can't create asynchronicity with just js
If your building functionality on top of asynchronous APIs, then your library must be asynchronous!
If a function or method uses asynchronous activity to complete its work, then that function must have an asynchronous interface (takes a callback and/or returns a promise)!
Demo: Copy Dir
Jest done
test parameter
Tests function.length
if > 0, test is async
calling done with any non-null argument is failure (matches node callback signature)
and node fs module
Jest beforeEach and friends
Orchestration?
Sequential
Parallel
Async order is "completion" based