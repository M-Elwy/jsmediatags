import MediaFileReader from './MediaFileReader';
import type { LoadCallbackType, ByteRange, TagType } from './FlowTypes';
import MediaTagReader from './MediaTagReader';
declare class FLACTagReader extends MediaTagReader {
    _commentOffset: number;
    _pictureOffset: number;
    static getTagIdentifierByteRange(): ByteRange;
    static canReadTagFormat(tagIdentifier: Array<number>): boolean;
    _loadData(mediaFileReader: MediaFileReader, callbacks: LoadCallbackType): void;
    _loadBlock(mediaFileReader: MediaFileReader, offset: number, callbacks: LoadCallbackType): void;
    _nextBlock(mediaFileReader: MediaFileReader, offset: number, blockHeader: number, blockSize: number, callbacks: LoadCallbackType): void;
    _parseData(data: MediaFileReader, tags: Array<string>): TagType;
}
export default FLACTagReader;
