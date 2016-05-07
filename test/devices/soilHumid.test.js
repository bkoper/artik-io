import SoilHumidity from "../../src/devices/soilHumid";
import {expect} from "chai";

describe("SoilHumidity", function () {
    it("should be defined", function () {
        expect(SoilHumidity).to.exist;
    });
});
