#!/bin/bash
REL_SCRIPT_DIR="`dirname \"$0\"`"
SCRIPT_DIR="`( cd \"$REL_SCRIPT_DIR\" && pwd )`"
CALL_MOCHA=$SCRIPT_DIR/../../../bin/mocha
ERRORCASE_ROOT=$SCRIPT_DIR

ERRORCASE_FILES=./*.js
ERRORCASE_OUTPUT=/tmp/mocha-errorcase.txt
ERRORCASE_RESULT_PATTERNFILE=$SCRIPT_DIR/match-pattern.txt
ERRORCASE_EXCLUDE_PATTERNFILE=$SCRIPT_DIR/exclude-pattern.txt

cd $ERRORCASE_ROOT || {
    echo Could not cd to $SCRIPT_DIR from `pwd`
    exit 1
}

$CALL_MOCHA -R json-stream $ERRORCASE_FILES > $ERRORCASE_OUTPUT && {
    echo  "$ERRORCASE_FILES" in `pwd` should return failing exit code.
    exit 1
}


# All lines must match one of the following patterns.
# start line
# Cases which should fail should include "should fail" in their description.
# Cases which should pass should include "should pass" in their description.
# end line with count
# NOTE: Update the numbers in end line as needed to match expected results.
#     This is a bit crude but sufficient for now.
#     This also makes the pattern file a need to change with every added test.  Bummer.

# This process is a little brittle - regex being what it is.
# Sanity check the pattern file against output that should never report a match.
echo '["end",{"suites":0,"tests":0,"passes":0,"pending":0,"failures":0,"start":"1999-12-31T23:59:58.000Z","end":"1999-12-31T23:59:59.000Z","duration":0}]' | egrep -f $ERRORCASE_RESULT_PATTERNFILE  && {
    echo
    echo ======================================================================
    echo Sanity check on $ERRORCASE_RESULT_PATTERNFILE reported match where none was expected.
    echo Either your environment is incorrectly configured or the last edit to the pattern file was bad.
    echo ======================================================================
    exit 1
}

# check for excluded patterns
cat $ERRORCASE_OUTPUT | egrep -f $ERRORCASE_EXCLUDE_PATTERNFILE && {
    echo
    echo ======================================================================
    echo Results for "$ERRORCASE_FILES" in `pwd` do not match expected.
    echo ======================================================================
    echo
    echo ======================================================================
    echo The above lines match one of the excluded patterns in "$ERRORCASE_EXCLUDE_PATTERNFILE":
    echo
    cat $ERRORCASE_EXCLUDE_PATTERNFILE
    echo
    echo
    echo One of the following has happened:
    echo    Test marked "should not run" reported a result
    echo
    echo Full json output may be found at "$ERRORCASE_OUTPUT".
    echo
    echo To see general test output run the following from `pwd`:
    echo $CALL_MOCHA "$ERRORCASE_FILES"
    echo ======================================================================
    exit 1
}

# check for required patterns
cat $ERRORCASE_OUTPUT | egrep -v -f $ERRORCASE_RESULT_PATTERNFILE && {
    echo
    echo ======================================================================
    echo Results for "$ERRORCASE_FILES" in `pwd` do not match expected.
    echo ======================================================================
    echo
    echo ======================================================================
    echo The above lines do not match any of the patterns in "$ERRORCASE_RESULT_PATTERNFILE":
    echo
    cat $ERRORCASE_RESULT_PATTERNFILE
    echo
    echo
    echo One of the following has happened:
    echo    Run did not start
    echo    Test marked "should pass" reported fail
    echo    Test marked "should fail" reported pass
    echo    Tests were added, changed, or removed - the counts in the "end" line need to change
    echo
    echo Full output may be found at "$ERRORCASE_OUTPUT".
    echo
    echo To see general test output run the following from `pwd`:
    echo $CALL_MOCHA "$ERRORCASE_FILES"
    echo ======================================================================
    exit 1
}

echo Error case results matched expected.
