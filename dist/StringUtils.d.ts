export type DecodedString = InternalDecodedString;
declare class InternalDecodedString {
    _value: string;
    bytesReadCount: number;
    length: number;
    constructor(value: string, bytesReadCount: number);
    toString(): string;
}
declare var StringUtils: {
    readUTF16String: (bytes: Array<number>, bigEndian: boolean, maxBytes?: number) => DecodedString;
    readUTF8String: (bytes: Array<number>, maxBytes?: number) => DecodedString;
    readNullTerminatedString: (bytes: Array<number>, maxBytes?: number) => DecodedString;
};
export default StringUtils;
