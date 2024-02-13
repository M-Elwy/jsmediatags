import MediaFileReader from './MediaFileReader';
import type { LoadCallbackType, TagFrames, ByteRange, TagType } from './FlowTypes';
import MediaTagReader from './MediaTagReader';
declare class ID3v2TagReader extends MediaTagReader {
    static getTagIdentifierByteRange(): ByteRange;
    static canReadTagFormat(tagIdentifier: Array<number>): boolean;
    _loadData(mediaFileReader: MediaFileReader, callbacks: LoadCallbackType): void;
    _parseData(data: MediaFileReader, tags?: Array<string>): TagType;
    _getFrameData(frames: TagFrames, ids: Array<string>): Object;
    getShortcuts(): {
        [key: string]: string | Array<string>;
    };
}
export default ID3v2TagReader;
