import type { ByteArray } from './FlowTypes';
declare class MP4TagContents {
    _atoms: Array<Atom>;
    constructor(ftyp: string, atoms?: Array<Atom>);
    toArray(): ByteArray;
    static createAtom(atomName: string): Atom;
    static createContainerAtom(atomName: string, atoms: Array<Atom>, data?: ByteArray): Atom;
    static createMetadataAtom(atomName: string, type: string, data: ByteArray): Atom;
}
declare class Atom {
    _name: string;
    _data: Array<number>;
    _atoms: Array<Atom>;
    constructor(name: string, data: ByteArray, atoms: Array<Atom>);
    toArray(): ByteArray;
}
export default MP4TagContents;
