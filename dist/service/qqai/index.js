"use strict";
const MachineView_1 = require("./MachineView");
module.exports = class {
    constructor(appId, appKey) {
        this.appId = appId;
        this.appKey = appKey;
        this.machineView = new MachineView_1.MachineView(this.appId, this.appKey);
    }
};
