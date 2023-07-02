#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

get_charging_helper() {
  log "get_charging_helper()"
  FILENAME=$(find . -maxdepth 1 -type f -name "*.xml" | sort -k1,1nr | tail -1)
  log "FILENAME: $FILENAME"
  TEXT=$(grep -o 'text="[^"]*"' "$FILENAME" | sed '/text=""/d' | sed '/text="Parked at"/ { N; d; }')
  log "TEXT: $(tr '\n' ' ' <<<"$TEXT")"

  if echo "$TEXT" | grep "Level\|Charging Error\|Not charging\|Done" >/dev/null 2>&1; then
    echo "NOT_CHARGING"
  elif echo "$TEXT" | grep "Charging" >/dev/null 2>&1; then
    echo "CHARGING"
  else
    echo "UNKNOWN"
  fi
}
