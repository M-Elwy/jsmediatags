import MediaFileReader from './MediaFileReader';
import type { LoadCallbackType, ByteRange, TagType } from './FlowTypes';
import MediaTagReader from './MediaTagReader';
declare class ID3v1TagReader extends MediaTagReader {
    static getTagIdentifierByteRange(): ByteRange;
    static canReadTagFormat(tagIdentifier: Array<number>): boolean;
    _loadData(mediaFileReader: MediaFileReader, callbacks: LoadCallbackType): void;
    _parseData(data: MediaFileReader, tags: Array<string>): TagType;
}
export default ID3v1TagReader;
