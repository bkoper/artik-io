module.exports = {
    Gpio: require("./dist/artik-gpio").default,
    GpioIO: require("./dist/artik-io").default,
    Device: require("./dist/device").default,
    led: require("./dist/led").default,
    rainDetector: require("./dist/rainDetector").default,
    soilHumid: require("./dist/soilHumid").default,
    switcher: require("./dist/switcher_srd-05vdc-sl-c").default,
    waterFlow: require("./dist/waterFlowSensor").default
};
