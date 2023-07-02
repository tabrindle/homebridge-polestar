#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

screenshot() {
  if [[ -z "$1" ]]; then
    FILENAME="$(date +'%y%m%d%H%M%S').png"
  else
    FILENAME="$1.png"
  fi
  log "Capturing screenshot to $FILENAME"
  adb exec-out screencap -p >"$FILENAME"
  if command -v convert >/dev/null 2>&1; then
    log "Converting screenshot"
    convert "$FILENAME" -alpha off -colorspace Gray -shave 32x176 "$FILENAME"
    log "Done converting screenshot"
  else
    log "Skipping conversion"
  fi
}
