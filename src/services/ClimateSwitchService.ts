import { Service } from "homebridge";
import { CurrentClimateState, VehicleData } from "../util/types";
import {
  PolestarPluginService,
  PolestarPluginServiceContext,
} from "./PolestarPluginService";

export class ClimateSwitchService extends PolestarPluginService {
  service: Service;

  constructor(context: PolestarPluginServiceContext) {
    super(context);
    const { hap, polestar } = context;

    const service = new hap.Service.Switch(
      this.serviceName("Climate"),
      "climate",
    );

    const on = service
      .getCharacteristic(hap.Characteristic.On)
      .on("get", this.createGetter(this.getOn))
      .on("set", this.createSetter(this.setOn));

    this.service = service;

    polestar.on("vehicleDataUpdated", (data) => {
      on.updateValue(this.getOn(data));
    });
  }

  getOn(data: VehicleData | null) {
    return data?.currentClimateState || "OFF";
  }

  async setOn(on: boolean) {
    const { log, polestar } = this.context;

    if (on) {
      log("Turning on climate control…");
      await polestar.setClimateState(CurrentClimateState.ACTIVE);
    } else {
      log("Turning off climate control…");
      await polestar.setClimateState(CurrentClimateState.OFF);
    }
  }
}
