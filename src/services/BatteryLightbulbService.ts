import { Service } from "homebridge"
import { VehicleData } from "../util/types"
import { PolestarPluginService, PolestarPluginServiceContext } from "./PolestarPluginService"

export class BatteryLightbulbService extends PolestarPluginService {
  service: Service

  constructor(context: PolestarPluginServiceContext) {
    super(context)
    const { hap, polestar } = context

    this.service = new hap.Service.Lightbulb("Polestar Battery", "BatterySwitch")

    const batteryLevelSwitch = this.service
      .getCharacteristic(hap.Characteristic.On)
      .on("get", this.createGetter(this.getOn))

    batteryLevelSwitch.updateValue(true)

    const batteryLevel = this.service
      .getCharacteristic(hap.Characteristic.Brightness)
      .on("get", this.createGetter(this.getLevel))

    polestar.on("vehicleDataUpdated", (data) => {
      batteryLevelSwitch.updateValue(this.getLevel(data))
      batteryLevel.updateValue(this.getOn())
    })
  }

  getOn() {
    this.context.log.debug("BatteryLightbulbService", "getOn", true)
    return true
  }

  getLevel(data: VehicleData | null): number {
    this.context.log.debug("BatteryLightbulbService", "getLevel", data ? data.batteryState : 50)
    return data ? data.batteryState : 50
  }
}
