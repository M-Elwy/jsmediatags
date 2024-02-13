import MediaFileReader from "./MediaFileReader";
import MediaTagReader from "./MediaTagReader";
import type { CallbackType, LoadCallbackType } from "./FlowTypes";
export declare function read(location: Object, callbacks: CallbackType): void;
export declare class Reader {
    _file: any;
    _tagsToRead: Array<string>;
    _fileReader: MediaFileReader;
    _tagReader: MediaTagReader;
    constructor(file: any);
    setTagsToRead(tagsToRead: Array<string>): Reader;
    setFileReader(fileReader: MediaFileReader): Reader;
    setTagReader(tagReader: MediaTagReader): Reader;
    read(callbacks: CallbackType): void;
    _getFileReader(): MediaFileReader;
    _findFileReader(): MediaFileReader;
    _getTagReader(fileReader: MediaFileReader, callbacks: CallbackType): void;
    _findTagReader(fileReader: MediaFileReader, callbacks: CallbackType): void;
    _loadTagIdentifierRanges(fileReader: MediaFileReader, tagReaders: Array<MediaTagReader>, callbacks: LoadCallbackType): void;
}
export declare class Config {
    static addFileReader(fileReader: MediaFileReader): Config;
    static addTagReader(tagReader: MediaTagReader): Config;
    static removeTagReader(tagReader: MediaTagReader): Config;
    static EXPERIMENTAL_avoidHeadRequests(): void;
    static setDisallowedXhrHeaders(disallowedXhrHeaders: Array<string>): void;
    static setXhrTimeoutInSec(timeoutInSec: number): void;
}
