#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

refresh() {
  SIZE=$(adb shell wm size | grep -o '[0-9]\+x[0-9]\+' | head -1 | sed 's/x/ /')
  log "SIZE: $SIZE"
  X=$(echo "$SIZE" | awk '{print $1}')
  Y=$(echo "$SIZE" | awk '{print $2}')
  log "X: $X" && echo "Y: $Y"
  log "adb shell input swipe $((X / 2)) $((Y / 4)) $((X / 2)) $((Y * 3 / 4)) 500"
  adb shell input swipe $((X / 2)) $((Y / 4)) $((X / 2)) $((Y * 3 / 4)) 500
}
