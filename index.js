module.exports = {
    Gpio: require("./dist/artik-gpio").default,
    GpioIO: require("./dist/artik-io").default
    Device: require("./dist/devices/device").default,
    led: require("./dist/led").default,
    rainDetector: require("./dist/devices/rainDetector").default,
    soilHumid: require("./dist/devices/soilHumid").default,
    switcher: require("./dist/devices/switcher_srd-05vdc-sl-c").default,
    waterFlow: require("./dist/devices/waterFlowSensor").default
};
