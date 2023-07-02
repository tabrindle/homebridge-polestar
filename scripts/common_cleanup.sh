#!/bin/bash

cleanup() {
  find . -maxdepth 1 -type f -name "*.png" | sort -k1 | sed '$d' | xargs rm -f
  find . -maxdepth 1 -type f -name "*.xml" | sort -k1 | sed '$d' | xargs rm -f
}
