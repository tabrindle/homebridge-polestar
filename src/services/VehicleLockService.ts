import { CharacteristicValue, Service } from "homebridge";
import { CurrentLockState, VehicleData } from "../util/types";
import { wait } from "../util/wait";
import {
  PolestarPluginService,
  PolestarPluginServiceContext,
} from "./PolestarPluginService";

export class VehicleLockService extends PolestarPluginService {
  service: Service;

  constructor(context: PolestarPluginServiceContext) {
    super(context);
    const { hap, polestar } = context;

    const service = new hap.Service.LockMechanism(
      this.serviceName("Car Doors"),
      "carDoors",
    );

    const currentState = service
      .getCharacteristic(hap.Characteristic.LockCurrentState)
      .on("get", this.createGetter(this.getCurrentState));

    const targetState = service
      .getCharacteristic(hap.Characteristic.LockTargetState)
      .on("get", this.createGetter(this.getTargetState))
      .on("set", this.createSetter(this.setTargetState));

    this.service = service;

    polestar.on("vehicleDataUpdated", (data) => {
      currentState.updateValue(this.getCurrentState(data));
      targetState.updateValue(this.getTargetState(data));
    });
  }

  getCurrentState(data: VehicleData | null): CharacteristicValue {
    const { hap } = this.context;

    return {
      [CurrentLockState.SECURED]: hap.Characteristic.LockCurrentState.SECURED,
      [CurrentLockState.UNSECURED]:
        hap.Characteristic.LockCurrentState.UNSECURED,
      [CurrentLockState.UNKNOWN]: hap.Characteristic.LockCurrentState.UNKNOWN,
    }[data?.currentLockState ?? CurrentLockState.UNKNOWN];
  }

  getTargetState(data: VehicleData | null): CharacteristicValue {
    const { hap } = this.context;

    const currentState = this.getCurrentState(data);

    return currentState === hap.Characteristic.LockCurrentState.SECURED
      ? hap.Characteristic.LockTargetState.SECURED
      : hap.Characteristic.LockTargetState.UNSECURED;
  }

  async setTargetState(state: number) {
    const { service } = this;
    const { log, polestar, hap } = this.context;

    const locked = state === hap.Characteristic.LockTargetState.SECURED;

    if (locked) {
      log("Locking vehicle.");
      await polestar.setLockState(CurrentLockState.SECURED);
    } else {
      log("Unlocking vehicle.");
      await polestar.setLockState(CurrentLockState.UNSECURED);
    }

    // We need to update the current state "later" because Siri can't
    // handle receiving the change event inside the same "set target state"
    // response.
    await wait(1);

    if (state == hap.Characteristic.LockTargetState.SECURED) {
      service.setCharacteristic(
        hap.Characteristic.LockCurrentState,
        hap.Characteristic.LockCurrentState.SECURED,
      );
    } else {
      service.setCharacteristic(
        hap.Characteristic.LockCurrentState,
        hap.Characteristic.LockCurrentState.UNSECURED,
      );
    }
  }
}
