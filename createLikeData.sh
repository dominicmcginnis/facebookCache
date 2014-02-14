#!/bin/bash
#
### ====================================================================== ###
##                                                                          ##
##  Facebook Likes script:                                                  ##
##   Fetches facebook likes via curl API call                               ##
##   Resulting json file is cached by Akamai                                ##
##                                                                          ##
### ====================================================================== ###
#
FB_URL='https://api.facebook.com/method/fql.query'
OFILE='fbLikes.xml'
#OFILE='/nas/html/stubhub/facebook/fbLikes.js'
ERROR_FLAG=0
ERROR_LOG=messages

error() {
 # output HTTP error code, if any, & message
 if [ $# -gt 0 ]; then echo `basename $0` error: "$@" >> $ERROR_LOG; fi
   if [ -f /tmp/$$-US.log ]; then
     echo `basename $0` error: "Curl HTTP Error: `/bin/grep '^< HTTP' /tmp/$$-US.log | /bin/cut -d' ' -f2-`" >> $ERROR_LOG
     /bin/rm -f /tmp/$$-US.log
   fi
   ERROR_FLAG=$((ERROR_FLAG + 1))
 }

# curl call for StubHub US
/usr/bin/curl --get "$FB_URL" --data 'query=select%20%20like_count%20from%20link_stat%20where%20url=%22http://www.facebook.com/Stubhub/%22' >> "$OFILE" 2> /tmp/$$-US.log && /bin/rm -f /tmp/$$-US.log || ERROR_FLAG=1

OFILE_WC=`/usr/bin/wc -w $OFILE | awk '{print $1}'`

# Output error(s) encountered, if any
if [ "$OFILE_WC" -eq '0' ]; then error 'Empty reults in ouput (US)!'
 elif [ "$OFILE_WC" -lt '15' ]; then error "Resulting curl output was suspiciously small (US): `/bin/cat "$OFILE"`"; fi
if [ "$ERROR_FLAG" == '0' ]; then
  exit 0
 else
  error
  exit 1
fi
