import { schema } from "../../config.schema.json"

export type PolestarPluginConfig = {
  [key in keyof typeof schema.properties]: (typeof schema.properties)[key]["default"]
}

export function getConfigValue<T extends keyof PolestarPluginConfig>(
  config: PolestarPluginConfig,
  key: T,
): PolestarPluginConfig[T] {
  return config[key] ?? schema.properties[key].default
}

export enum ChargingStateEnum {
  CHARGING = "CHARGING",
  NOT_CHARGING = "NOT_CHARGING",
  UNKNOWN = "UNKNOWN",
}

export enum ClimateStateEnum {
  ACTIVE = "ACTIVE",
  OFF = "OFF",
  UNKNOWN = "UNKNOWN",
}

export enum LockStateEnum {
  UNSECURED = "UNSECURED",
  SECURED = "SECURED",
  UNKNOWN = "UNKNOWN",
}

export enum PlugStateEnum {
  UNPLUGGED = "UNPLUGGED",
  PLUGGEDIN = "PLUGGEDIN",
  UNKNOWN = "UNKNOWN",
}

export interface VehicleData {
  batteryState: number // percent
  chargingState: keyof typeof ChargingStateEnum
  climateState: keyof typeof ClimateStateEnum
  lockState: keyof typeof LockStateEnum
  plugState: keyof typeof PlugStateEnum
}
