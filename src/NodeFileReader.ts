const fs = require('fs');

import ChunkedFileData from "./ChunkedFileData";
import MediaFileReader from "./MediaFileReader";

import type { LoadCallbackType } from "./FlowTypes";

class NodeFileReader extends MediaFileReader {
  _path: string;
  _fileData: ChunkedFileData;

  constructor(path: string) {
    super();
    this._path = path;
    this._fileData = new ChunkedFileData();
    this._isInitialized = true;
  }

  static canReadFile(file: any): boolean {
    return (
        typeof file === 'string' &&
        !/^[a-z]+:\/\//i.test(file)
      );
  }

  init(callbacks: LoadCallbackType) {
    var self = this;

    fs.stat(self._path, function(err : Error, stats : any) {
      if (err) {
        if (callbacks.onError) {
          callbacks.onError({"type": "fs", "info": err});
        }
      } else {
        self._size = stats.size;
        callbacks.onSuccess();
      }
    });
  }

  loadRange(range: [number, number], callbacks: LoadCallbackType) {
    var fd = -1;
    var self = this;
    var fileData = this._fileData;

    var length = range[1] - range[0] + 1;
    var onSuccess = callbacks.onSuccess;
    var onError = callbacks.onError || function(object){};

    if (fileData.hasDataRange(range[0], range[1])) {
      process.nextTick(onSuccess);
      return;
    }

    var readData = function(err : Error, _fd : number) {
      if (err) {
        onError({"type": "fs", "info": err});
        return;
      }

      fd = _fd;
      // TODO: Should create a pool of Buffer objects across all instances of
      //       NodeFileReader. This is fine for now.
      var buffer = Buffer.alloc(length);
      fs.read(_fd, buffer, 0, length, range[0], processData);
    };

    var processData = function(err: Error, bytesRead : any, buffer: Buffer) {
      fs.close(fd, function(err: Error) {
        if (err) {
          console.error(err);
        }
      });

      if (err) {
        onError({"type": "fs", "info": err});
        return;
      }

      storeBuffer(buffer);
      onSuccess();
    };

    var storeBuffer = function(buffer: Buffer) {
      var data = Array.prototype.slice.call(buffer, 0, length);
      fileData.addData(range[0], data);
    }

    fs.open(this._path, "r", undefined, readData);
  }

  getByteAt(offset: number): number {
    return this._fileData.getByteAt(offset);
  }
}

export default NodeFileReader;
