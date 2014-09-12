#!/bin/bash
REL_SCRIPT_DIR="`dirname \"$0\"`"
SCRIPT_DIR="`( cd \"$REL_SCRIPT_DIR\" && pwd )`"

cd $SCRIPT_DIR || {
    echo Could not cd to $SCRIPT_DIR from `pwd`
    exit 1
}

../../../bin/mocha -R json-stream  ./*.js > /tmp/mocha-glob.txt || {
    echo Globbing ./*.js in `pwd` failed.
    exit 1
}

cat /tmp/mocha-glob.txt | grep -q -F '["end",{"suites":1,"tests":1,"passes":1,"pending":0,"failures":0,' || {
    echo Globbing ./*.js in `pwd` should match glob.js with one test inside.
    exit 1
}

../../../bin/mocha -R json-stream ./*-none.js 2> /tmp/mocha-glob.txt && {
    echo Globbing './*-none.js' in `pwd` failed.
    exit 1
}

cat /tmp/mocha-glob.txt | grep -q -F 'cannot resolve path' || {
    echo Globbing './*-none.js' in `pwd` should match no files and run no tests.
    exit 1
}

# Globbing in windows command-shell differs completely from unix-style globbing.
# In bash, the shell expands globs and passes the result to executables.
# In windows, the shell passes globs unexpanded, executables do expansion if they support it.
# Adding single-quotes around the glob below makes bash pass glob unexpanded,
#     allowing us to test windows-style globbing in bash.
../../../bin/mocha -R json-stream  './*.js' > /tmp/mocha-glob.txt || {
    echo Globbing './*.js' in `pwd` failed.
    exit 1
}

cat /tmp/mocha-glob.txt | grep -q -F '["end",{"suites":1,"tests":1,"passes":1,"pending":0,"failures":0,' || {
    echo Globbing './*.js' in `pwd` should match glob.js with one test inside.
    exit 1
}

../../../bin/mocha -R json-stream  './*-none.js' 2> /tmp/mocha-glob.txt && {
    echo Globbing './*-none.js' in `pwd` failed.
    exit 1
}

cat /tmp/mocha-glob.txt | grep -q -F 'cannot resolve path' || {
    echo Globbing './*-none.js' in `pwd` should match no files and run no tests.
    exit 1
}

echo Glob-test passed.
