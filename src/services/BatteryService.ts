import { Service } from "homebridge"
import { VehicleData, ChargingStateEnum } from "../util/types"
import { PolestarPluginService, PolestarPluginServiceContext } from "./PolestarPluginService"

export class BatteryService extends PolestarPluginService {
  service: Service

  constructor(context: PolestarPluginServiceContext) {
    super(context)
    const { hap, polestar } = context

    this.service = new hap.Service.Battery("Polestar Battery", "battery")

    const batteryLevel = this.service
      .getCharacteristic(hap.Characteristic.BatteryLevel)
      .on("get", this.createGetter(this.getLevel))

    const chargingState = this.service
      .getCharacteristic(hap.Characteristic.ChargingState)
      .on("get", this.createGetter(this.getChargingState))

    const lowBattery = this.service
      .getCharacteristic(hap.Characteristic.StatusLowBattery)
      .on("get", this.createGetter(this.getLowBattery))

    polestar.on("vehicleDataUpdated", (data) => {
      batteryLevel.updateValue(this.getLevel(data))
      chargingState.updateValue(this.getChargingState(data))
      lowBattery.updateValue(this.getLowBattery(data))
    })
  }

  getLevel(data: VehicleData | null): number {
    this.context.log.debug("BatteryService", "getLevel")
    return data ? data.batteryState : 50
  }

  getChargingState(data: VehicleData | null): number {
    this.context.log.debug("BatteryService", "getChargingState")
    const { hap } = this.context

    if (data) {
      return data.chargingState === ChargingStateEnum.CHARGING
        ? hap.Characteristic.ChargingState.CHARGING
        : hap.Characteristic.ChargingState.NOT_CHARGING
    } else {
      return hap.Characteristic.ChargingState.NOT_CHARGING
    }
  }

  getLowBattery(data: VehicleData | null): boolean {
    this.context.log.debug("BatteryService", "getLowBattery")
    return data ? data.batteryState <= 20 : false
  }
}
