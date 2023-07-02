import { Service } from "homebridge"
import { ClimateStateEnum, VehicleData } from "../util/types"
import { PolestarPluginService, PolestarPluginServiceContext } from "./PolestarPluginService"

export class ClimateSwitchService extends PolestarPluginService {
  service: Service

  constructor(context: PolestarPluginServiceContext) {
    super(context)
    const { hap, polestar } = context

    this.service = new hap.Service.Fan("Polestar Climate", "climate")

    const on = this.service
      .getCharacteristic(hap.Characteristic.On)
      .on("get", this.createGetter(this.getOn))
      .on("set", this.createSetter(this.setOn))

    polestar.on("vehicleDataUpdated", (data) => {
      on.updateValue(this.getOn(data))
    })
  }

  getOn(data: VehicleData | null) {
    this.context.log.debug("ClimateSwitchService", "getOn", data?.climateState)

    const options = {
      [ClimateStateEnum.ACTIVE]: true,
      [ClimateStateEnum.OFF]: false,
      [ClimateStateEnum.UNKNOWN]: false,
    }

    return options[data?.climateState ?? ClimateStateEnum.UNKNOWN]
  }

  async setOn(on: boolean) {
    this.context.log.debug("ClimateSwitchService", "setOn", `on: ${on}`)

    if (on) {
      this.context.log.debug("Turning on climate control…")
      await this.context.polestar.setClimateState(ClimateStateEnum.ACTIVE)
    } else {
      this.context.log.debug("Turning off climate control…")
      await this.context.polestar.setClimateState(ClimateStateEnum.OFF)
    }
  }
}
