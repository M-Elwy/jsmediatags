import type { ChunkType, DataType } from "./FlowTypes";
declare class ChunkedFileData {
    static get NOT_FOUND(): number;
    _fileData: Array<ChunkType>;
    constructor();
    addData(offset: number, data: DataType): void;
    _concatData(dataA: DataType, dataB: DataType): DataType;
    _sliceData(data: DataType, begin: number, end: number): DataType;
    _getChunkRange(offsetStart: number, offsetEnd: number): {
        startIx: number;
        endIx: number;
        insertIx?: number;
    };
    hasDataRange(offsetStart: number, offsetEnd: number): boolean;
    getByteAt(offset: number): any;
}
export default ChunkedFileData;
