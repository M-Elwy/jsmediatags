import type { ByteArray } from "./FlowTypes";
export declare const bin: (string: string) => ByteArray;
export declare const pad: (array: Array<any>, size: number) => Array<any>;
export declare const getSynchsafeInteger32: (number: number) => ByteArray;
export declare const getInteger32: (number: number) => ByteArray;
export declare const getInteger24: (number: number) => ByteArray;
