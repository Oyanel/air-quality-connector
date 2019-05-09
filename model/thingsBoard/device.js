'use strict';

class Device {

    constructor(name, type, id, tenantId, additionalInfo) {
        this.id = id;
        this.additionalInfo = additionalInfo;
        this.tenantId = tenantId;
        this.name = name;
        this.type = type;
    }

    toString(){
        const string = {
            name: this.name,
            type: this.type
          };
        return JSON.stringify(string);
    }

}

module.exports = Device;