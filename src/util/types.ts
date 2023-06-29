import { schema } from "../../config.schema.json";

export type PolestarPluginConfig = {
  [key in keyof typeof schema.properties]: (typeof schema.properties)[key]["default"];
};

export function getConfigValue<T extends keyof PolestarPluginConfig>(
  config: PolestarPluginConfig,
  key: T,
): PolestarPluginConfig[T] {
  return config[key] ?? schema.properties[key].default;
}

export enum CurrentLockState {
  UNSECURED = "UNSECURED",
  SECURED = "SECURED",
  UNKNOWN = "UNKNOWN",
}

export enum CurrentClimateState {
  ACTIVE = "ACTIVE",
  OFF = "OFF",
}

export enum CurrentChargingState {
  CHARGING = "CHARGING",
  NOT_CHARGING = "NOT_CHARGING",
}

export interface VehicleData {
  currentChargingState: CurrentChargingState;
  currentClimateState: CurrentClimateState;
  currentLockState: CurrentLockState;
  currentChargeState: number; // percent
}
