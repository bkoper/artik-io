[![travis build](https://img.shields.io/travis/bkoper/artik-io.svg?style=flat-square)](https://api.travis-ci.org/bkoper/artik-io.svg?branch=master)
[![codecov coverage](https://img.shields.io/codecov/c/github/bkoper/artik-io.svg?style=flat-square)](https://codecov.io/github/bkoper/artik-io)
[![MIT License](https://img.shields.io/github/license/bkoper/artik-io.svg?style=flat-square)](http://opensource.org/licenses/MIT)

_Description as well as whole project is still under construction. It is not final version_

# Artik IO

GPIO library for [Artik](https://www.artik.io/) devices.
It gives you possibility to communicate with Gpio from *Node.js* enviroment.

## Installation

### Build for developer purposes
```
npm i 
npm build
```

### Production build
```
npm i
npm build:prod
```
it will output library files to ```dist``` directory, which meant to be included in npm package.

## Structure
- ```artik-gpio.js``` - main library, responsible for all IO communication
- ```artik-io.js``` - gpio mapping based on artik documentation that can be found [here](https://developer.artik.io/documentation/developer-guide/gpio-mapping.html)


## Usage and samples

To see usage samples, take look at [artik-io-devices](https://github.com/bkoper/artik-io-devices) project.
 
## How does it work

_tbd_
 