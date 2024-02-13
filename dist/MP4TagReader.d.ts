import MediaFileReader from './MediaFileReader';
import type { LoadCallbackType, ByteRange, TagType, TagFrame } from './FlowTypes';
import MediaTagReader from './MediaTagReader';
declare class MP4TagReader extends MediaTagReader {
    static getTagIdentifierByteRange(): ByteRange;
    static canReadTagFormat(tagIdentifier: Array<number>): boolean;
    _loadData(mediaFileReader: MediaFileReader, callbacks: LoadCallbackType): void;
    _loadAtom(mediaFileReader: MediaFileReader, offset: number, parentAtomFullName: string, callbacks: LoadCallbackType): void;
    _isContainerAtom(atomName: string): boolean;
    _canReadAtom(atomName: string): boolean;
    _parseData(data: MediaFileReader, tagsToRead: Array<string>): TagType;
    _readAtom(tags: Object, data: MediaFileReader, offset: number, length: number, tagsToRead: Array<string>, parentAtomFullName?: string, indent?: string): void;
    _readMetadataAtom(data: MediaFileReader, offset: number): TagFrame;
    _readMeanMetadataAtom(data: MediaFileReader, offset: number): TagFrame;
    getShortcuts(): {
        [key: string]: string | Array<string>;
    };
}
export default MP4TagReader;
