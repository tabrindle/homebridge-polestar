#!/bin/bash

get_lock_helper() {
  log "get_lock_helper()"
  FILENAME=$(find . -maxdepth 1 -type f -name "*.xml" | sort -k1,1nr | tail -1)
  log "FILENAME: $FILENAME"
  TEXT=$(grep -o 'text="[^"]*"' "$FILENAME" | sed '/text=""/d' | sed '/text="Parked at"/ { N; d; }')
  log "TEXT: $(tr '\n' ' ' <<<"$TEXT")"

  if echo "$TEXT" | grep "Locked" >/dev/null 2>&1; then
    echo "SECURED"
  elif echo "$TEXT" | grep "Unlocked" >/dev/null 2>&1; then
    echo "UNSECURED"
  else
    echo "UNKNOWN"
  fi

  # Using tesseract is not as reliable, but it's faster
  # FILENAME=$(find . -maxdepth 1 -type f -name "*.png" | sort -k1,1nr | tail -1)
  # if tesseract "$FILENAME" stdout -c debug_file=/dev/null | grep "Locked" >/dev/null 2>&1; then
  #   echo "SECURED"
  # elif tesseract "$FILENAME" stdout -c debug_file=/dev/null | grep "Unlocked" >/dev/null 2>&1; then
  #   echo "UNSECURED"
  # else
  #   echo "UNKNOWN"
  # fi
}
