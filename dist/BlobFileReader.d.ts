import ChunkedFileData from "./ChunkedFileData";
import MediaFileReader from "./MediaFileReader";
import type { LoadCallbackType } from "./FlowTypes";
declare class BlobFileReader extends MediaFileReader {
    _blob: Blob;
    _fileData: ChunkedFileData;
    constructor(blob: Blob);
    static canReadFile(file: any): boolean;
    _init(callbacks: LoadCallbackType): void;
    loadRange(range: [number, number], callbacks: LoadCallbackType): void;
    getByteAt(offset: number): number;
}
export default BlobFileReader;
