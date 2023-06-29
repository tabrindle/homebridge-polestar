require("@babel/polyfill");

import { AccessoryConfig, API, HAP, Logging } from "homebridge";
import { BatteryService } from "./services/BatteryService";
import { ClimateSwitchService } from "./services/ClimateSwitchService";
import {
  PolestarPluginService,
  PolestarPluginServiceContext,
} from "./services/PolestarPluginService";
import { VehicleLockService } from "./services/VehicleLockService";
import { PolestarApi } from "./util/api";
import { getConfigValue, PolestarPluginConfig } from "./util/types";

let hap: HAP;

export default function (api: API) {
  hap = api.hap;
  api.registerAccessory("homebridge-polestar", "Polestar", PolestarAccessory);
}

class PolestarAccessory {
  log: Logging;
  name: string;
  polestar: PolestarApi;
  services: PolestarPluginService[] = [];

  constructor(log: Logging, untypedConfig: AccessoryConfig) {
    const config: PolestarPluginConfig = untypedConfig as any;
    const polestar = new PolestarApi(log, config);

    this.log = log;
    this.name = config.name;
    this.polestar = polestar;

    polestar.getVehicleData();

    const context: PolestarPluginServiceContext = {
      log,
      hap,
      config,
      polestar,
    };

    this.services.push(new BatteryService(context));

    if (getConfigValue(config, "vehicleLock")) {
      this.services.push(new VehicleLockService(context));
    }

    if (getConfigValue(config, "climateSwitch")) {
      this.services.push(new ClimateSwitchService(context));
    }
  }

  getServices() {
    return this.services.map((service) => service.service);
  }
}
