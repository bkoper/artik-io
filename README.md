[![travis build](https://img.shields.io/travis/bkoper/artik-suite.svg?style=flat-square)](https://api.travis-ci.org/bkoper/artik-suite.svg?branch=master)
[![MIT License](https://img.shields.io/npm/l/starwars-names.svg?style=flat-square)](http://opensource.org/licenses/MIT)

_Description as well as whole project is still under construction. It is not final version_

# Artik Suite

GPIO library for [Artik](https://www.artik.io/) devices. 
It gives you possibility to communicate with Gpio from *Node.js* enviroment.

# Installation

## Developer build
```
npm i 
npm build
```

## Production build
```
npm i
npm build
```
it will output library files to ```dist``` directory

# Structure
- ```src/lib``` 
    - ```artik-gpio.js``` - main library, responsible for all IO communication
    - ```artik-io.js``` - gpio mapping based on artik documentation that can be found [here](https://developer.artik.io/documentation/developer-guide/gpio-mapping.html)
- ```devices``` - list of sample (or typical) devices that you can connect to artik
    - ```device.js``` - main prototype for rest of devices
- ```examples``` - list of samples    


# Usage and samples

To get full overview please refer to ```src/examples``` where you can find list of use cases 
for devices. You can also check ```devices``` directory, where you can get an idea how devices are created.
All of them are pretty simple, but you can get an idea how to use this library.
 
# How does it work

_tbd_
 