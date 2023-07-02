#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/common_log.sh"

helper_toggle_climate() {
  log "helper_toggle_climate()"
  if [[ -z "$1" ]]; then
    FILENAME=$(find . -maxdepth 1 -type f -name "*.xml" | sort -k1,1nr | tail -1)
  else
    FILENAME="$1.xml"
  fi
  BOUNDS=$(xmlstarlet sel -t -v "//node[@resource-id='com.polestar.explore:id/cc_main_climate_IV']/@bounds" "$FILENAME")
  log "BOUNDS: $BOUNDS"
  X1=$(awk -F '[,\\[\\]]' '{print $2}' <<<"$BOUNDS")
  Y1=$(awk -F '[,\\[\\]]' '{print $3}' <<<"$BOUNDS")
  X2=$(awk -F '[,\\[\\]]' '{print $5}' <<<"$BOUNDS")
  Y2=$(awk -F '[,\\[\\]]' '{print $6}' <<<"$BOUNDS")
  MIDPOINT="$(((X1 + X2) / 2)) $(((Y1 + Y2) / 2))"
  log "MIDPOINT: $MIDPOINT"
  log "adb shell input tap $MIDPOINT"
  adb shell input tap "$MIDPOINT"
}
