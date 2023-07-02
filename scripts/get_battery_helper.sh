#!/bin/bash

get_battery_helper() {
  log "get_battery_helper()"
  FILENAME=$(find . -maxdepth 1 -type f -name "*.xml" | sort -k1,1nr | tail -1)
  log "FILENAME: $FILENAME"
  TEXT=$(grep -o 'text="[^"]*"' "$FILENAME" | sed '/text=""/d' | sed '/text="Parked at"/ { N; d; }')
  log "TEXT: $(tr '\n' ' ' <<<"$TEXT")"
  PERCENT=$(echo "$TEXT" | grep -oE '[0-9]+%')
  log "PERCENT: $PERCENT"
  if [[ "$PERCENT" == "" ]]; then
    PERCENT="UNKNOWN%"
  fi
  echo "${PERCENT%?}"
}
