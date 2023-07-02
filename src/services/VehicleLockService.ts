import { CharacteristicValue, Service } from "homebridge"
import { LockStateEnum, VehicleData } from "../util/types"
import { wait } from "../util/wait"
import { PolestarPluginService, PolestarPluginServiceContext } from "./PolestarPluginService"

export class VehicleLockService extends PolestarPluginService {
  service: Service

  constructor(context: PolestarPluginServiceContext) {
    super(context)
    const { hap, polestar } = context

    this.service = new hap.Service.LockMechanism("Polestar Doors", "carDoors")

    const currentState = this.service
      .getCharacteristic(hap.Characteristic.LockCurrentState)
      .on("get", this.createGetter(this.getCurrentState))

    const targetState = this.service
      .getCharacteristic(hap.Characteristic.LockTargetState)
      .on("get", this.createGetter(this.getTargetState))
      .on("set", this.createSetter(this.setTargetState))

    polestar.on("vehicleDataUpdated", (data) => {
      currentState.updateValue(this.getCurrentState(data))
      targetState.updateValue(this.getTargetState(data))
    })
  }

  getCurrentState(data: VehicleData | null): CharacteristicValue {
    this.context.log.debug("VehicleLockService", "getCurrentState", data?.lockState)
    const { hap } = this.context

    const options = {
      [LockStateEnum.SECURED]: hap.Characteristic.LockCurrentState.SECURED,
      [LockStateEnum.UNSECURED]: hap.Characteristic.LockCurrentState.UNSECURED,
      [LockStateEnum.UNKNOWN]: hap.Characteristic.LockCurrentState.UNKNOWN,
    }

    return options[data?.lockState ?? LockStateEnum.UNKNOWN]
  }

  getTargetState(data: VehicleData | null): CharacteristicValue {
    const { hap } = this.context

    const currentState = this.getCurrentState(data)

    return currentState === hap.Characteristic.LockCurrentState.SECURED
      ? hap.Characteristic.LockTargetState.SECURED
      : hap.Characteristic.LockTargetState.UNSECURED
  }

  async setTargetState(state: number) {
    this.context.log.debug(
      "VehicleLockService",
      "setTargetState",
      state === this.context.hap.Characteristic.LockTargetState.SECURED
        ? LockStateEnum.SECURED
        : LockStateEnum.UNSECURED,
    )
    const { polestar, hap } = this.context

    const lock = state === hap.Characteristic.LockTargetState.SECURED

    if (lock) {
      this.context.log.debug("Locking vehicle...")
      await polestar.setLockState(LockStateEnum.SECURED)
    } else {
      this.context.log.debug("Unlocking vehicle...")
      await polestar.setLockState(LockStateEnum.UNSECURED)
    }

    // We need to update the current state "later" because Siri can't
    // handle receiving the change event inside the same "set target state"
    // response.
    await wait(1)

    if (state == hap.Characteristic.LockTargetState.SECURED) {
      this.service.setCharacteristic(hap.Characteristic.LockCurrentState, hap.Characteristic.LockCurrentState.SECURED)
    } else {
      this.service.setCharacteristic(hap.Characteristic.LockCurrentState, hap.Characteristic.LockCurrentState.UNSECURED)
    }
  }
}
