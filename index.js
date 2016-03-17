module.exports = {
    lib: {
        Gpio: require("./build/artik-gpio").default,
        GpioIO: require("./build/artik-io").default
    },
    devices: {
        Led: require("./build/led").default
    }
};