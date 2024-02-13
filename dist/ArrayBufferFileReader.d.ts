import ChunkedFileData from "./ChunkedFileData";
import MediaFileReader from "./MediaFileReader";
import type { LoadCallbackType } from "./FlowTypes";
declare class ArrayBufferFileReader extends MediaFileReader {
    _buffer: ArrayBuffer;
    _fileData: ChunkedFileData;
    constructor(buffer: ArrayBuffer);
    static canReadFile(file: any): boolean;
    _init(callbacks: LoadCallbackType): void;
    loadRange(range: [number, number], callbacks: LoadCallbackType): void;
    getByteAt(offset: number): number;
}
export default ArrayBufferFileReader;
