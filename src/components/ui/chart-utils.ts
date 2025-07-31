import type { ChartConfig } from "./chart";

export interface ChartPayloadItem {
  value?: number | string;
  name?: string;
  dataKey?: string;
  payload?: {
    fill?: string;
  };
  color?: string;
}

export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const item = payload as ChartPayloadItem;
  const configKey = key || item.name || item.dataKey;

  if (!configKey || !config[configKey]) {
    return null;
  }

  return config[configKey];
}