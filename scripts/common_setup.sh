#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

setup() {
    if adb devices | grep -w device | wc -l | grep 1 >/dev/null 2>&1; then
        log "Device is connected"
    else
        log "Error: Device is not connected"
        exit 1
    fi
    if adb shell dumpsys window policy | grep "screenState=SCREEN_STATE_ON" >/dev/null 2>&1; then
        log "Screen is on"
    else
        log "Screen is off"
        adb shell input keyevent KEYCODE_WAKEUP
    fi
    sleep 1
    if adb shell dumpsys window policy | grep "mIsShowing=true" >/dev/null 2>&1; then
        log "Lockscreen is showing"
        adb shell input keyevent KEYCODE_MENU
    else
        log "Lockscreen is not showing"
    fi
    sleep 1
    # Android Q and above
    if adb shell dumpsys activity recents | grep 'Recent #0' | grep 'com.polestar.explore' >/dev/null 2>&1; then
        log "App is foreground"
    else
        log "App is not foreground"
        adb shell am start -n com.polestar.explore/com.polestar.explore.ui.MainActivity >/dev/null 2>&1
    fi
}
