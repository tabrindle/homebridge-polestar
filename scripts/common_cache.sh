#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

cache() {
  log "cache()"
  FILENAME=$(find . -maxdepth 1 -type f -name "*.png" | sort -k1,1nr | tail -1)
  log "$FILENAME"
  FILE_TIMESTAMP="${FILENAME//[!0-9]/}"
  CURRENT_TIMESTAMP=$(date +"%y%m%d%H%M%S")
  DIFFERENCE=$((CURRENT_TIMESTAMP - FILE_TIMESTAMP))
  log "DIFFERENCE: $DIFFERENCE"

  if [[ $DIFFERENCE -lt 30 ]]; then
    log "true"
  else
    log "false"
  fi
}
