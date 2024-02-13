import MediaFileReader from "./MediaFileReader";
import type { Byte, ByteArray, LoadCallbackType } from "./FlowTypes";
declare class ArrayFileReader extends MediaFileReader {
    _array: ByteArray;
    _size: number;
    constructor(array: ByteArray);
    static canReadFile(file: any): boolean;
    init(callbacks: LoadCallbackType): void;
    loadRange(range: [number, number], callbacks: LoadCallbackType): void;
    getByteAt(offset: number): Byte;
}
export default ArrayFileReader;
