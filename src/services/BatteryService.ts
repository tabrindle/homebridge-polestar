import { Service } from "homebridge";
import { VehicleData } from "../util/types";
import {
  PolestarPluginService,
  PolestarPluginServiceContext,
} from "./PolestarPluginService";

export class BatteryService extends PolestarPluginService {
  service: Service;

  constructor(context: PolestarPluginServiceContext) {
    super(context);
    const { hap, polestar } = context;

    const service = new hap.Service.Battery(
      this.serviceName("Battery"),
      "battery",
    );

    const batteryLevel = service
      .getCharacteristic(hap.Characteristic.BatteryLevel)
      .on("get", this.createGetter(this.getLevel));

    // const chargingState = service
    //   .getCharacteristic(hap.Characteristic.ChargingState)
    //   .on("get", this.createGetter(this.getChargingState));

    const lowBattery = service
      .getCharacteristic(hap.Characteristic.StatusLowBattery)
      .on("get", this.createGetter(this.getLowBattery));

    this.service = service;

    polestar.on("vehicleDataUpdated", (data) => {
      batteryLevel.updateValue(this.getLevel(data));
      // chargingState.updateValue(this.getChargingState(data));
      lowBattery.updateValue(this.getLowBattery(data));
    });
  }

  getLevel(data: VehicleData | null): number {
    return data ? data.currentChargeState : 50;
  }

  // getChargingState(data: VehicleData | null): number {
  //   const { hap } = this.context;

  //   if (data) {
  //     return data.chargingState === "Charging"
  //       ? hap.Characteristic.ChargingState.CHARGING
  //       : hap.Characteristic.ChargingState.NOT_CHARGING;
  //   } else {
  //     return hap.Characteristic.ChargingState.NOT_CHARGING;
  //   }
  // }

  getLowBattery(data: VehicleData | null): boolean {
    return data ? data.currentChargeState <= 20 : false;
  }
}
