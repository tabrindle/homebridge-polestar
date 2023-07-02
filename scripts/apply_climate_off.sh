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
source "$DIR/helper_toggle_climate.sh"
source "$DIR/common_log.sh"

TIMESTAMP=$(date +'%y%m%d%H%M%S')

reset
setup
loading
screenshot "$TIMESTAMP" &
dump "$TIMESTAMP" &
wait

CLIMATE_STATE=$(get_climate_helper)

log "Current climate state: $CLIMATE_STATE"
log "Target climate state: OFF"

if [[ "$CLIMATE_STATE" == "ACTIVE" ]]; then
  helper_toggle_climate
  cleanup
  loading
  screenshot "$TIMESTAMP" &
  dump "$TIMESTAMP" &
  wait
else
  log "Climate not ACTIVE, skipping"
fi

cat <<EOF
{
  "batteryState": "$(get_battery_helper)",
  "chargingState": "$(get_charging_helper)",
  "climateState": "$(get_climate_helper)",
  "lockState": "$(get_lock_helper)",
  "plugState": "$(get_plug_helper)"
}
EOF

cleanup
reset
