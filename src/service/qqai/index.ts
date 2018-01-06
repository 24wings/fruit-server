import { MachineView } from './MachineView';
export = class {
    machineView = new MachineView(this.appId, this.appKey);



    constructor(public appId: string, public appKey: string) { }
} 