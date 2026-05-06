export const RuntimeKind = {};
export const runOnUISync = (f) => f;
export const scheduleOnUI = (f) => f;
export const isWorkletFunction = () => false;
export const makeShareable = (v) => v;
export const createSerializable = (v) => v;
export const serializableMappingCache = {};
export const WorkletsModule = {};
export const createShareable = (v) => v;
export const createSynchronizable = (v) => v;
export const UIRuntimeId = 0;
export const scheduleOnRN = (f) => f;
export const createWorkletRuntime = () => ({});
export const executeOnUIRuntimeSync = (f) => f();
export const runOnJS = (f) => f;
export const runOnRuntime = (r, f) => f;
export const runOnUI = (f) => f;

export default {
  RuntimeKind,
  runOnUISync,
  scheduleOnUI,
  isWorkletFunction,
  makeShareable,
  createSerializable,
  serializableMappingCache,
  WorkletsModule,
  createShareable,
  createSynchronizable,
  UIRuntimeId,
  scheduleOnRN,
  createWorkletRuntime,
  executeOnUIRuntimeSync,
  runOnJS,
  runOnRuntime,
  runOnUI
};
