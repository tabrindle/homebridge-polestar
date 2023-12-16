#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

loading() {
  TMPFILE=$(mktemp /tmp/loading.png.XXXXXX)
  LOADING_COUNT=0
  NOT_LOADING_COUNT=0

  (
    while true; do
      log "Screenshotting..."
      adb exec-out screencap -p >"$TMPFILE"
      if tesseract "$TMPFILE" stdout -c debug_file=/dev/null | grep "Loading\|Turning\|Unlocking\|Locking" >/dev/null 2>&1; then
        log "Loading"
        LOADING_COUNT=$((LOADING_COUNT + 1))
        NOT_LOADING_COUNT=0
      else
        log "Not loading"
        NOT_LOADING_COUNT=$((NOT_LOADING_COUNT + 1))
      fi
      if [[ "$NOT_LOADING_COUNT" -gt 2 ]] && [[ "$LOADING_COUNT" -gt 0 ]]; then
        log "Done loading"
        NOT_LOADING_COUNT=0
        exit
      fi
    done
  ) &

  # Get the background process ID
  LOOP_PID=$!

  TIMEOUT=10
  START_TIME=$(date +%s)
  while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
    if ((ELAPSED_TIME >= TIMEOUT)); then
      log "Loading timeout reached, killing the process"
      kill "$LOOP_PID" >/dev/null 2>&1
      wait "$LOOP_PID" >/dev/null 2>&1
      rm "$TMPFILE" >/dev/null 2>&1
      break
    fi
    sleep 1
  done
}
