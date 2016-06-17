[![travis build](https://img.shields.io/travis/bkoper/artik-io.svg?style=flat-square)](https://api.travis-ci.org/bkoper/artik-io.svg?branch=master)
[![codecov coverage](https://img.shields.io/codecov/c/github/bkoper/artik-io.svg?style=flat-square)](https://codecov.io/github/bkoper/artik-io)
[![MIT License](https://img.shields.io/github/license/bkoper/artik-io.svg?style=flat-square)](http://opensource.org/licenses/MIT)

# Artik IO

GPIO library for [Artik](https://www.artik.io/) devices.
It gives you possibility to communicate with Gpio from *Node.js* enviroment.

## Installation
Via npm, as a project dependency:
```
$ npm i -D artik-io
```

## Development
or build from source:
```
$ npm i
$ npm build
```
will output compiled libs to ```build``` directory.


## Project structure
- ```src/artik-gpio.js``` - main library, responsible for all IO communication
- ```src/artik-io.js``` - gpio mapping based on artik documentation that can be found [here](https://developer.artik.io/documentation/developer-guide/gpio-mapping.html)


## Usage

```js
import {Gpio} from "artik-io";

const gpio = new Gpio(Gpio.pins.ARTIK_10[12]);
gpio.pinMode(Gpio.direction.INPUT);
gpio.on(Gpio.event.RISING, () => {
    console.info("sensor is on");
});
```

## More examples

To see usage samples, take look at [artik-io-devices](https://github.com/bkoper/artik-io-devices) project.

## License

MIT
 