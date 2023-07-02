# *NOTE: THIS IS NOT FUNCTIONAL YET. CODE IS IN PROGRESS.*

# Polestar Accessory

Got a Polestar? Want to let Siri boss it around? Look no further.

# Services

After [installation](#installation) below, you'll get the default services enabled:

- _"Unlock the car doors"_ (unlock the vehicle)
- _"Turn on the climate control of my car"_ (turns on climate control if off)
- _"What is the current charge level of my car"_

# Installation

If you're running a Homebridge UI like [`homebridge-ui-config-x`](https://github.com/oznu/homebridge-config-ui-x) then you can use it to install `homebridge-polestar` and configure it there. All configuration options should be supported.

# Manual Installation

```sh
npm install --global homebridge-polestar
```

Example config.json:

```json
{
  "accessories": [
    {
      "accessory": "Polestar",
      "name": "PS2",
    }
  ]
}
```

You can find the full list of configuration settings in [`config.schema.json`](config.schema.json).

## Prerequisite Software Install
- This package comes with a ./scripts/install.sh script that will (probably) install the necessary software. It should support apt/yum/homebrew, so Linux and MacOS. 
- This script installs Tesseract (an OCR program) that takes an image and returns the text in the image, xmlstarlet, an xml parsing program that interprets the UI dump from the android phone, ADB (Android Debugging Bridge) to connect to the phone, and ImageMagick, an image manipulation program to help Tesseract work better. These are all required, and unfortunately not reliably automatically installable with npm (the pacakge manager that homebridge uses)
- In order to make this work, you must have an android phone (presumably that you dont use for anything else) connnected through adb
## Setting up the Home App

The plugin exposes a single HomeKit "Accessory" representing the car, which contains multiple services for all the different switches and locks. _This is the way._

Unfortunately, there is a very annoying [known bug](https://github.com/homebridge/homebridge/issues/3210) with iOS 16 where, when adding accessories with multiple services, the services are all given the same name as the main accessory.

This means that if your accessory (car) name is "Model Y", then (for instance) the trunk service will be renamed to "Model Y". And you'll say "open the trunk" and Siri will say "I don't know what you mean."

You'll need to manually tap into each service tile and change its name back to what you want.
**NOTE** Tapping "X" on the accessory name will display the true name.

Additionally, you'll find that when you tap into the car in the Home app to, say, open the trunk, you'll see a big scrolling page of switches and locks with _no labels_. This is just what the Home app does.

To improve this, you can create a new "Room" in HomeKit for each car. So you might have a "Model Y" room, and you can place your Model Y accessory inside there. Then you can configure it to "Show as separate tiles" and you get this lovely presentation of all your widgets in the "room" (pictured at top).

Here's a [video demonstrating the complete setup process as of iOS 16](https://youtu.be/sgDJmwwSOYA).

## Multiple Vehicles

Have a garage full of Polestar? Well you're currently out of luck, this plugin was not designed to handle more than one. The underlying API has been tough to reverse engineer, so this plugin depends on some really terrible hacky automation of the Polestar app. 

## Climate Switch

By default, the climate control is normally exposed as a "HVAC" accessory similar to a thermostat in your home. However, this is not currently possible with the Polestar, so the climate control as a simple switch. This allows you to say things like "Turn on the climate control" or "Turn off the climate control." The temperature setting will be the default Polestar 22C.

## Development

You can run Rollup in watch mode to automatically transpile code as you write it:

```sh
  npm run dev
```
