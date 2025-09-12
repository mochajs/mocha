# Developing Mocha

This page contains info on developing Mocha itself.

## Environment setup

When you contribute to mocha itself, you will probably want to try to run your changes on the test suite of another project. You can (and should) run the test suite of mocha itself before committing, but also confirming that your changes give the expected result on another project can be useful.

For example, [WebSocket.io](https://github.com/LearnBoost/websocket.io/):

    $ git clone https://github.com/LearnBoost/websocket.io.git

Retreive websocket.io's dependencies, which will include the stable version of mocha:

    $ cd websocket.io/
    $ npm install

Replace the mocha dependency by the current git repository:

    $ cd node_modules/
    $ mv mocha/ mocha.save
    $ git clone https://github.com/visionmedia/mocha.git

Install mocha's dependencies for the development version:

    $ cd mocha
    $ npm install

Run websocket.io's test suite using the development version you just installed:

    $ cd ../.. 
    $ ./node_modules/.bin/mocha
