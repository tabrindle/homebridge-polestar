#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

reset() {
  if adb devices | grep -w device | wc -l | grep 1 >/dev/null 2>&1; then
    log "Resetting device to closed app and sleep mode"
    adb shell am force-stop com.polestar.explore
    adb shell input keyevent KEYCODE_SLEEP
  fi
}
