#!/bin/bash

log() {
  mkdir -p logs
  touch "logs/$(date +"%y%m%d").log"
  echo "[$(date +"%y-%m-%d %H:%M:%S")] Polestar: $*" >>"logs/$(date +"%y%m%d").log"
}
