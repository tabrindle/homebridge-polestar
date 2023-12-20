import fetch from "node-fetch"
import { Logging } from "homebridge"
import debouncePromise from "debounce-promise"
import { EventEmitter } from "./events"
import { PolestarPluginConfig, VehicleData, getConfigValue } from "./types"

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
    plugState: "UNKNOWN",
  }
  public vin: string
  public token: string

  constructor(log: Logging, config: PolestarPluginConfig) {
    super()
    this.log = log
    this.vin = getConfigValue(config, "vin")
    this.token = getConfigValue(config, "token")
    this.getPolestarDataDebounced = debouncePromise(() => {
      this.log.info("getPolestarDataDebounced")
      return this.getPolestarData()
    }, 30000)
  }

  public async getPolestarData(): Promise<any> {
    this.log.info("getPolestarData")
    return this.callApi()
  }

  public async getCachedPolestarData(): Promise<VehicleData> {
    this.log.debug("getCachedPolestarData")
    this.getPolestarDataDebounced()
    return this.cachedPolestarData
  }

  public async callApi(): Promise<VehicleData> {
    try {
      const response = await fetch("https://pc-api.polestar.com/eu-north-1/my-star", {
        headers: {
          accept: "*/*",
          authorization: this.token,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getBatteryData(vin:"${this.vin}") {
                batteryChargeLevelPercentage
                chargingStatus
                chargerConnectionStatus
                estimatedChargingTimeToFullMinutes
                estimatedDistanceToEmptyMiles
              }
            }
          `,
        }),
        method: "POST",
      })
      const json = response.json() as unknown as VehicleData
      this.log.debug("response:", json)
      this.emit("vehicleDataUpdated", json)
      this.cachedPolestarData = json
      return json
    } catch (error: any) {
      this.log.error("fetch error", error)
    }
    return this.cachedPolestarData
  }
}
