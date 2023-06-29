import { Service } from "homebridge";
import { VehicleData } from "../util/types";
import {
  PolestarPluginService,
  PolestarPluginServiceContext,
} from "./PolestarPluginService";

export class ChargingSwitchService extends PolestarPluginService {
  service: Service;

  constructor(context: PolestarPluginServiceContext) {
    super(context);

    const { hap, polestar } = context;

    this.service = new hap.Service.Switch(
      this.serviceName("Charging"),
      "charging",
    );

    const on = this.service
      .getCharacteristic(hap.Characteristic.On)
      .on("get", this.createGetter(this.getOn));

    polestar.on("vehicleDataUpdated", (data) => {
      on.updateValue(this.getOn(data));
    });
  }

  getOn(data: VehicleData | null) {
    this.context.log("ChargingSwitchService", "getOn");
    return data?.currentChargingState === "CHARGING";
  }
}
