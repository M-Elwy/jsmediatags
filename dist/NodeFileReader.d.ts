import ChunkedFileData from "./ChunkedFileData";
import MediaFileReader from "./MediaFileReader";
import type { LoadCallbackType } from "./FlowTypes";
declare class NodeFileReader extends MediaFileReader {
    _path: string;
    _fileData: ChunkedFileData;
    constructor(path: string);
    static canReadFile(file: any): boolean;
    init(callbacks: LoadCallbackType): void;
    loadRange(range: [number, number], callbacks: LoadCallbackType): void;
    getByteAt(offset: number): number;
}
export default NodeFileReader;
