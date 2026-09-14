import { apiRequest } from "./apiClient";

export function getProjectModel() {
  return apiRequest("/v1/project/model");
}

export function getProjectDataset() {
  return apiRequest("/v1/project/dataset");
}

export function getProjectPerformance() {
  return apiRequest("/v1/project/performance");
}

export function getProjectArchitecture() {
  return apiRequest("/v1/project/architecture");
}
