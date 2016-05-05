module.exports = {
    lib: {
        Gpio: require("./dist/artik-gpio").default,
        GpioIO: require("./dist/artik-io").default
    },
    devices: {
        Led: require("./dist/led").default
    }
};