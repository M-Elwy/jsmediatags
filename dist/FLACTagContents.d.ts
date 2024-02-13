import type { ByteArray } from './FlowTypes';
declare class FLACTagContents {
    _blocks: Array<MetadataBlock>;
    constructor(blocks?: Array<MetadataBlock>);
    toArray(): ByteArray;
    static createBlock(type: number, data: ByteArray): MetadataBlock;
    static createStreamBlock(): MetadataBlock;
    static createCommentBlock(...data: Array<Array<string>>): MetadataBlock;
    static createPictureBlock(): MetadataBlock;
}
declare class MetadataBlock {
    _data: Array<number>;
    _final: boolean;
    _type: number;
    constructor(type: number, data: ByteArray);
    setFinal(): void;
    toArray(): number[];
}
export default FLACTagContents;
