require("@babel/polyfill")

import { AccessoryConfig, API, HAP, Logging, Service } from "homebridge"
import { BatteryService } from "./services/BatteryService"
import { BatteryLightbulbService } from "./services/BatteryLightbulbService"
import { ChargingSwitchService } from "./services/ChargingSwitchService"
import { ClimateSwitchService } from "./services/ClimateSwitchService"
import { PolestarPluginService, PolestarPluginServiceContext } from "./services/PolestarPluginService"
import { PlugSwitchService } from "./services/PlugSwitchService"
import { VehicleLockService } from "./services/VehicleLockService"
import { PolestarApi } from "./util/api"
import { getConfigValue, PolestarPluginConfig } from "./util/types"
import { periodic } from "./util/periodic"

let hap: HAP

export default function (api: API) {
  hap = api.hap
  api.registerAccessory("homebridge-polestar", "Polestar", PolestarAccessory)
}
class PolestarAccessory {
  log: Logging
  name: string
  polestar: PolestarApi
  services: PolestarPluginService[] = []

  constructor(log: Logging, untypedConfig: AccessoryConfig) {
    const config: PolestarPluginConfig = untypedConfig as any
    const polestar = new PolestarApi(log)

    this.log = log
    this.name = config.name
    this.polestar = polestar

    polestar.getPolestarData()

    periodic(() => {
      if (!polestar.commandRunning) polestar.getPolestarData()
    }, log)

    const context: PolestarPluginServiceContext = {
      log,
      hap,
      config,
      polestar,
    }

    this.services.push(new BatteryService(context))

    if (getConfigValue(config, "batteryAsLightbulb")) {
      this.services.push(new BatteryLightbulbService(context))
    }

    if (getConfigValue(config, "chargingStatusAsSwitch")) {
      this.services.push(new ChargingSwitchService(context))
    }

    if (getConfigValue(config, "plugStatusAsSwitch")) {
      this.services.push(new PlugSwitchService(context))
    }

    if (getConfigValue(config, "vehicleLock")) {
      this.services.push(new VehicleLockService(context))
    }

    if (getConfigValue(config, "climateSwitch")) {
      this.services.push(new ClimateSwitchService(context))
    }
  }

  getServices() {
    const services = this.services.map((service) => service.service)

    services.push(
      new hap.Service.AccessoryInformation()
        .setCharacteristic(hap.Characteristic.Name, "Polestar")
        .setCharacteristic(hap.Characteristic.SerialNumber, "LPSED3KA4NLXXXXXX")
        .setCharacteristic(hap.Characteristic.Manufacturer, "Polestar")
        .setCharacteristic(hap.Characteristic.Model, "Polestar 2")
        .setCharacteristic(hap.Characteristic.FirmwareRevision, "2.x"),
    )

    return services
  }
}
