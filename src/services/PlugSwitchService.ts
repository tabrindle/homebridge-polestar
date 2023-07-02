import { Service } from "homebridge"
import { VehicleData, PlugStateEnum } from "../util/types"
import { PolestarPluginService, PolestarPluginServiceContext } from "./PolestarPluginService"

export class PlugSwitchService extends PolestarPluginService {
  service: Service

  constructor(context: PolestarPluginServiceContext) {
    super(context)

    const { hap, polestar } = context

    this.service = new hap.Service.Switch("Polestar Plugged", "plug")

    const on = this.service.getCharacteristic(hap.Characteristic.On).on("get", this.createGetter(this.getOn))

    polestar.on("vehicleDataUpdated", (data) => {
      on.updateValue(this.getOn(data))
    })
  }

  getOn(data: VehicleData | null) {
    this.context.log.debug("PlugSwitchService", "getOn", data?.plugState === PlugStateEnum.PLUGGEDIN)
    return data?.plugState === PlugStateEnum.PLUGGEDIN
  }
}
