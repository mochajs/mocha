#!/bin/bash
REL_SCRIPT_DIR="`dirname \"$0\"`"
SCRIPT_DIR="`( cd \"$REL_SCRIPT_DIR\" && pwd )`"
CALL_MOCHA=$SCRIPT_DIR/../../../bin/mocha
ERRORCASE_ROOT=$SCRIPT_DIR

ERRORCASE_FILES=./*.js
ERRORCASE_OUTPUT=/tmp/mocha-errorcase.txt
ERRORCASE_COUNT_PATTERNFILE=$SCRIPT_DIR/finalcount-pattern.txt
ERRORCASE_RESULT_PATTERNFILE=$SCRIPT_DIR/testresult-pattern.txt

cd $ERRORCASE_ROOT || {
    echo Could not cd to $SCRIPT_DIR from `pwd`
    exit 1
}

$CALL_MOCHA -R json-stream $ERRORCASE_FILES > $ERRORCASE_OUTPUT && {
    echo  "$ERRORCASE_FILES" in `pwd` should return failing exit code.
    exit 1
}


# All lines must match one of the following patterns.
# start or end line
# Cases which should fail should include "should fail" in their description.
# Cases which should pass should include "should pass" in their description.

cat $ERRORCASE_OUTPUT | egrep -v -f $ERRORCASE_RESULT_PATTERNFILE && {
    echo
    echo ======================================================================
    echo Results for "$ERRORCASE_FILES" in `pwd` do not match expected.
    echo ======================================================================
    echo
    echo ======================================================================
    echo The above lines do not match any of the patterns in "$ERRORCASE_RESULT_PATTERNFILE":
    cat $ERRORCASE_RESULT_PATTERNFILE
    echo
    echo You have either misnamed one or more tests, or the tests did not produce the expected result.
    echo ======================================================================
    exit 1
}


# NOTE: Update the numbers in as needed to match expected results.
#     This is a bit crude but sufficient for now.
#     This also makes the pattern file a need to change with every added test.  Bummer.

# This process is a little brittle - regex being what it is.
# Sanity check the pattern file against output that should never report a match.
echo '["end",{"suites":0,"tests":0,"passes":0,"pending":0,"failures":0,"start":"1999-12-31T23:59:58.000Z","end":"1999-12-31T23:59:59.000Z","duration":0}]' | egrep -f $ERRORCASE_COUNT_PATTERNFILE  && {
    echo
    echo ======================================================================
    echo Sanity check on $ERRORCASE_PATTERNFILE reported match where none was expected.
    echo Either you environment is incorrectly configured or the last edit to the pattern file was bad.
    echo ======================================================================
    exit 1
}

cat $ERRORCASE_OUTPUT | egrep -q -f $ERRORCASE_COUNT_PATTERNFILE || {
    echo
    echo ======================================================================
    echo Results for "$ERRORCASE_FILES" in `pwd` do not match expected.
    echo ======================================================================
    cat $ERRORCASE_OUTPUT
    echo
    echo ======================================================================
    echo The above lines do not match any of the patterns in "$ERRORCASE_COUNT_PATTERNFILE":
    cat $ERRORCASE_COUNT_PATTERNFILE
    echo
    echo If you are adding or changing tests, check the results listed above,
    echo against the expected, then update $ERRORCASE_COUNT_PATTERNFILE with the new values.
    echo ======================================================================
    exit 1
}


echo Error case results matched expected.
