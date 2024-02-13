import type { FrameReaderSignature, TagHeader, TagFrames, TagFrameHeader, TagFrameFlags } from './FlowTypes';
import MediaFileReader from './MediaFileReader';
declare class ID3v2FrameReader {
    static getFrameReaderFunction(frameId: string): FrameReaderSignature;
    static readFrames(offset: number, end: number, data: MediaFileReader, id3header: TagHeader, tags: Array<string>): TagFrames;
    static _getFrameHeaderSize(id3header: TagHeader): number;
    static _readFrameHeader(data: MediaFileReader, offset: number, id3header: TagHeader): TagFrameHeader;
    static _readFrameFlags(data: MediaFileReader, offset: number): TagFrameFlags;
    static _getFrameDescription(frameId: string): string;
    static getUnsyncFileReader(data: MediaFileReader, offset: number, size: number): MediaFileReader;
}
export default ID3v2FrameReader;
