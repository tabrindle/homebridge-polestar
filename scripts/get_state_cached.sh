#!/bin/bash

DIR="$(dirname "${BASH_SOURCE[0]}")"

source "$DIR/common_cleanup.sh"
source "$DIR/common_dump.sh"
source "$DIR/common_loading.sh"
source "$DIR/common_reset.sh"
source "$DIR/common_screenshot.sh"
source "$DIR/common_setup.sh"
source "$DIR/get_battery_helper.sh"
source "$DIR/get_charging_helper.sh"
source "$DIR/get_climate_helper.sh"
source "$DIR/get_lock_helper.sh"
source "$DIR/get_plug_helper.sh"

FILENAME=$(find . -maxdepth 1 -type f -name "*.png" | sort -k1,1nr | tail -1)
FILE_TIMESTAMP="${FILENAME//[!0-9]/}"
log "FILE_TIMESTAMP: $FILE_TIMESTAMP"
CURRENT_TIMESTAMP=$(date +"%y%m%d%H%M%S")
DIFFERENCE=$((CURRENT_TIMESTAMP - FILE_TIMESTAMP))
log "DIFFERENCE: $DIFFERENCE"

cat <<EOF
{
  "batteryState": "$(get_battery_helper)",
  "chargingState": "$(get_charging_helper)",
  "climateState": "$(get_climate_helper)",
  "lockState": "$(get_lock_helper)",
  "plugState": "$(get_plug_helper)"
  "timeElapsed": "$DIFFERENCE"
}
EOF

cleanup
reset
