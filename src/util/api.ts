import { Logging } from "homebridge"
import debouncePromise from "debounce-promise"
import { EventEmitter } from "./events"
import { ClimateStateEnum, LockStateEnum, VehicleData } from "./types"
import { shell } from "./shell"
import { wait } from "./wait"

export interface PolestarApiEvents {
  vehicleDataUpdated(data: VehicleData): void
}

export class PolestarApi extends EventEmitter<PolestarApiEvents> {
  private log: Logging
  public getPolestarDataDebounced: () => Promise<VehicleData>
  public commandRunning = false
  public cachedPolestarData: VehicleData = {
    batteryState: 100,
    chargingState: "UNKNOWN",
    climateState: "UNKNOWN",
    lockState: "UNKNOWN",
    plugState: "UNKNOWN",
  }

  constructor(log: Logging) {
    super()
    this.log = log
    this.getPolestarDataDebounced = debouncePromise(() => {
      this.log.info("getPolestarDataDebounced")
      return this.getPolestarData()
    }, 30000)
  }

  public async setClimateState(targetClimateState: ClimateStateEnum) {
    this.log.info("setClimateState", "targetClimateState:", targetClimateState)
    if (targetClimateState === ClimateStateEnum.ACTIVE) {
      this.callScript("apply_climate_active.sh")
    } else {
      this.callScript("apply_climate_off.sh")
    }
    await wait(8000)
    this.cachedPolestarData.climateState = targetClimateState
    return Promise.resolve(targetClimateState)
  }

  public async setLockState(targetLockState: LockStateEnum) {
    this.log.info("setLockState", "targetLockState:", targetLockState)
    if (targetLockState === LockStateEnum.SECURED) {
      this.callScript("apply_lock_secured.sh")
    } else {
      this.callScript("apply_lock_unsecured.sh")
    }
    await wait(8000)
    this.cachedPolestarData.lockState = targetLockState
    return Promise.resolve(targetLockState)
  }

  public async getPolestarData(): Promise<any> {
    this.log.info("getPolestarData")
    return this.callScript("get_state.sh")
  }

  public async getCachedPolestarData(): Promise<VehicleData> {
    this.log.debug("getCachedPolestarData")
    this.getPolestarDataDebounced()
    return this.cachedPolestarData
  }

  public async callScript(script): Promise<VehicleData> {
    this.commandRunning = true
    try {
      const response = (await shell(`scripts/${script}`)) as string
      const json = JSON.parse(response)
      this.log.debug("response:", json)
      this.emit("vehicleDataUpdated", json)
      this.cachedPolestarData = json
      this.commandRunning = false
      return json
    } catch (error: any) {
      this.log.error("script error", error)
    }
    return this.cachedPolestarData
  }
}
