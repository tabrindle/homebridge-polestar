#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

dump() {
  if adb devices | grep -w device | wc -l | grep 1 >/dev/null 2>&1; then
    if [[ -z "$1" ]]; then
      FILENAME="$(date +'%y%m%d%H%M%S').xml"
    else
      FILENAME="$1.xml"
    fi
    log "Getting XML"
    adb shell uiautomator dump >/dev/null 2>&1
    log "Pulling XML"
    adb pull /sdcard/window_dump.xml "$FILENAME" >/dev/null 2>&1
    log "Finished pulling XML"
  fi
}
