import { Logging } from "homebridge";
import { EventEmitter } from "./events";
import { lock } from "./mutex";
import {
  CurrentChargingState,
  CurrentClimateState,
  CurrentLockState,
  PolestarPluginConfig,
  VehicleData,
} from "./types";

export interface PolestarApiEvents {
  vehicleDataUpdated(data: VehicleData): void;
}

export class PolestarApi extends EventEmitter<PolestarApiEvents> {
  private log: Logging;
  private lastVehicleData: VehicleData | null = null;
  private lastVehicleDataTime = 0;

  constructor(log: Logging, config: PolestarPluginConfig) {
    super();
    this.log = log;
  }

  public async getClimateState() {
    this.log("getClimateState");
    return Promise.resolve(CurrentClimateState.ACTIVE);
  }
  public async setClimateState(currentClimateState: CurrentClimateState) {
    this.log("setClimateState", currentClimateState);
    if (currentClimateState === CurrentClimateState.ACTIVE) {
      return Promise.resolve(CurrentClimateState.ACTIVE);
    }
    return Promise.resolve(CurrentClimateState.OFF);
  }

  public async getLockState() {
    this.log("getLockState");
    return Promise.resolve(CurrentLockState.UNSECURED);
  }
  public async setLockState(currentLockState: CurrentLockState) {
    this.log("setLockState", currentLockState);
    if (currentLockState === CurrentLockState.UNSECURED) {
      return Promise.resolve(CurrentLockState.SECURED);
    }
    return Promise.resolve(CurrentLockState.UNSECURED);
  }

  public async getChargeState() {
    this.log("getChargeState");
    return Promise.resolve(15);
  }

  public async getChargingState() {
    this.log("getChargingState");
    return Promise.resolve(CurrentChargingState.NOT_CHARGING);
  }

  public async getVehicleData(): Promise<any> {
    // Use a mutex to prevent multiple calls happening in parallel.
    const unlock = await lock("getVehicleData", 60 * 1000);

    if (!unlock) {
      this.log("Failed to acquire lock for getVehicleData");
      return null;
    }

    try {
      // If the cached value is less than 5 minutes old, return it.
      const cacheAge = Date.now() - this.lastVehicleDataTime;

      if (cacheAge < 1000 * 60 * 5) {
        return this.lastVehicleData;
      }

      let data: VehicleData = {
        currentChargingState: CurrentChargingState.NOT_CHARGING,
        currentClimateState: CurrentClimateState.OFF,
        currentLockState: CurrentLockState.UNKNOWN,
        currentChargeState: 50,
      };

      try {
        data.currentClimateState = await this.getClimateState();
        data.currentLockState = await this.getLockState();
        data.currentChargeState = await this.getChargeState();
      } catch (error: any) {
        this.lastVehicleData = null;
        this.lastVehicleDataTime = Date.now();
        return null;
      }

      this.lastVehicleData = data;
      this.lastVehicleDataTime = Date.now();

      this.emit("vehicleDataUpdated", data);

      return data;
    } finally {
      unlock();
    }
  }
}
