import { CharacteristicGetCallback, CharacteristicValue, HAP, HAPStatus, Logging, Nullable, Service } from "homebridge"
import { PolestarApi } from "../util/api"
import { PolestarPluginConfig, VehicleData } from "../util/types"

export type PolestarPluginServiceContext = {
  log: Logging
  hap: HAP
  config: PolestarPluginConfig
  polestar: PolestarApi
}

export abstract class PolestarPluginService {
  protected context: PolestarPluginServiceContext
  public abstract service: Service

  constructor(context: PolestarPluginServiceContext) {
    this.context = context
  }

  protected createGetter<T extends CharacteristicValue>(getter: Getter<T>): GetterCallback {
    return (callback) => {
      this.context.polestar
        .getCachedPolestarData()
        .then((data) => getter.call(this, data))
        .then((value) => callback(null, value))
        .catch((error: Error) => callback(error))
    }
  }

  protected createSetter<T extends CharacteristicValue>(setter: Setter<T>): SetterCallback {
    return (value, callback) => {
      setter
        .call(this, value as T)
        .then((writeResponse) => callback(null, writeResponse ?? undefined))
        .catch((error: Error) => callback(error))
    }
  }
}

type Getter<T extends CharacteristicValue> = (this: any, data: VehicleData | null) => Promise<T> | T

type GetterCallback = (callback: CharacteristicGetCallback) => void

type Setter<T extends CharacteristicValue> = (this: any, value: T) => Promise<Nullable<T> | void>

type SetterCallback = (
  value: CharacteristicValue,
  callback: (error?: HAPStatus | Error | null, writeResponse?: Nullable<CharacteristicValue>) => void,
) => void
