#!/bin/bash

get_plug_helper() {
  log "get_plug_helper()"
  FILENAME=$(find . -maxdepth 1 -type f -name "*.xml" | sort -k1,1nr | tail -1)
  log "FILENAME: $FILENAME"
  TEXT=$(grep -o 'text="[^"]*"' "$FILENAME" | sed '/text=""/d' | sed '/text="Parked at"/ { N; d; }')
  log "TEXT: $(tr '\n' ' ' <<<"$TEXT")"

  if echo "$TEXT" | grep "Level" >/dev/null 2>&1; then
    echo "UNPLUGGED"
  elif echo "$TEXT" | grep "Done\|Not charging\|Charging\|Charging Error" >/dev/null 2>&1; then
    echo "PLUGGEDIN"
  else
    echo "UNKNOWN"
  fi
}
