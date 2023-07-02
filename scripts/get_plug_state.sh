#!/bin/bash

DIR="$(dirname "${BASH_SOURCE[0]}")"

source "$DIR/common_cleanup.sh"
source "$DIR/common_dump.sh"
source "$DIR/common_loading.sh"
source "$DIR/common_reset.sh"
source "$DIR/common_screenshot.sh"
source "$DIR/common_setup.sh"
source "$DIR/get_plug_helper.sh"

TIMESTAMP=$(date +'%y%m%d%H%M%S')

setup
loading
screenshot "$TIMESTAMP" &
dump "$TIMESTAMP" &
wait

echo "{ \"plugState\": \"$(get_plug_helper)\" }"

cleanup
reset
