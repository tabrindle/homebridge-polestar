#!/bin/bash -e

(
  if command -v yum &>/dev/null; then
    echo "Detected 'yum' package manager"
    if ! command -v tesseract &>/dev/null; then
      echo "Installing Tesseract..."
      sudo yum install tesseract -y
    else
      echo "Tesseract installed ✔"
    fi
    if ! command -v convert &>/dev/null; then
      echo "Installing ImageMagick..."
      sudo yum install ImageMagick -y
    else
      echo "ImageMagick installed ✔"
    fi
    if ! command -v xmlstarlet &>/dev/null; then
      echo "Installing xmlstarlet..."
      sudo yum install xmlstarlet -y
    else
      echo "xmlstarlet installed ✔"
    fi
    if ! command -v adb &>/dev/null; then
      echo "Installing adb..."
      sudo yum install adb -y
    else
      echo "adb installed ✔"
    fi
    echo "Done installing dependencies"
  elif command -v apt-get &>/dev/null; then
    echo "Detected 'apt' package manager"
    if ! command -v tesseract &>/dev/null; then
      echo "Installing Tesseract..."
      sudo apt-get install tesseract-ocr -y
    else
      echo "Tesseract installed ✔"
    fi
    if ! command -v convert &>/dev/null; then
      echo "Installing ImageMagick..."
      sudo apt-get install imagemagick -y
    else
      echo "ImageMagick installed ✔"
    fi
    if ! command -v xmlstarlet &>/dev/null; then
      echo "Installing xmlstarlet..."
      sudo apt-get install xmlstarlet -y
    else
      echo "xmlstarlet installed ✔"
    fi
    if ! command -v adb &>/dev/null; then
      echo "Installing Android Platform Tools..."
      sudo apt-get install adb -y
    else
      echo "Android Platform Tools installed ✔"
    fi
    echo "Done installing dependencies"
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v brew &>/dev/null; then
      echo "Installing Homebrew..."
      curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/common_install.sh | bash
    else
      echo "Homebrew installed ✔"
    fi
    if ! command -v tesseract &>/dev/null; then
      echo "Installing Tesseract..."
      brew install tesseract
    else
      echo "Tesseract installed ✔"
    fi
    if ! command -v convert &>/dev/null; then
      echo "Installing ImageMagick..."
      brew install imagemagick
    else
      echo "ImageMagick installed ✔"
    fi
    if ! command -v xmlstarlet &>/dev/null; then
      echo "Installing xmlstarlet..."
      brew install xmlstarlet
    else
      echo "xmlstarlet installed ✔"
    fi
    if ! command -v adb &>/dev/null; then
      echo "Installing Android Platform Tools..."
      brew install android-platform-tools
    fi
    printf "\nDone ✔\n"
  else
    echo "Unsupported OS: $OSTYPE"
    exit 1
  fi
) || echo "An error occurred. Script terminated." && exit 1
