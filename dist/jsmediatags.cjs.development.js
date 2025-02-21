'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

var NOT_FOUND = -1;
var ChunkedFileData = /*#__PURE__*/function () {
  function ChunkedFileData() {
    this._fileData = void 0;
    this._fileData = [];
  }
  var _proto = ChunkedFileData.prototype;
  _proto.addData = function addData(offset, data) {
    var offsetEnd = offset + data.length - 1;
    var chunkRange = this._getChunkRange(offset, offsetEnd);
    if (chunkRange.startIx === NOT_FOUND) {
      this._fileData.splice(chunkRange.insertIx || 0, 0, {
        offset: offset,
        data: data
      });
    } else {
      var firstChunk = this._fileData[chunkRange.startIx];
      var lastChunk = this._fileData[chunkRange.endIx];
      var needsPrepend = offset > firstChunk.offset;
      var needsAppend = offsetEnd < lastChunk.offset + lastChunk.data.length - 1;
      var chunk = {
        offset: Math.min(offset, firstChunk.offset),
        data: data
      };
      if (needsPrepend) {
        var slicedData = this._sliceData(firstChunk.data, 0, offset - firstChunk.offset);
        chunk.data = this._concatData(slicedData, data);
      }
      if (needsAppend) {
        var slicedData = this._sliceData(chunk.data, 0, lastChunk.offset - chunk.offset);
        chunk.data = this._concatData(slicedData, lastChunk.data);
      }
      this._fileData.splice(chunkRange.startIx, chunkRange.endIx - chunkRange.startIx + 1, chunk);
    }
  };
  _proto._concatData = function _concatData(dataA, dataB) {
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView && ArrayBuffer.isView(dataA)) {
      var dataAandB = new dataA.constructor(dataA.length + dataB.length);
      dataAandB.set(dataA, 0);
      dataAandB.set(dataB, dataA.length);
      return dataAandB;
    } else {
      return dataA.concat(dataB);
    }
  };
  _proto._sliceData = function _sliceData(data, begin, end) {
    if (data.slice) {
      return data.slice(begin, end);
    } else {
      return data.subarray(begin, end);
    }
  };
  _proto._getChunkRange = function _getChunkRange(offsetStart, offsetEnd) {
    var startChunkIx = NOT_FOUND;
    var endChunkIx = NOT_FOUND;
    var insertIx = 0;
    for (var i = 0; i < this._fileData.length; i++, insertIx = i) {
      var chunkOffsetStart = this._fileData[i].offset;
      var chunkOffsetEnd = chunkOffsetStart + this._fileData[i].data.length;
      if (offsetEnd < chunkOffsetStart - 1) {
        break;
      }
      if (offsetStart <= chunkOffsetEnd + 1 && offsetEnd >= chunkOffsetStart - 1) {
        startChunkIx = i;
        break;
      }
    }
    if (startChunkIx === NOT_FOUND) {
      return {
        startIx: NOT_FOUND,
        endIx: NOT_FOUND,
        insertIx: insertIx
      };
    }
    for (var i = startChunkIx; i < this._fileData.length; i++) {
      var chunkOffsetStart = this._fileData[i].offset;
      var chunkOffsetEnd = chunkOffsetStart + this._fileData[i].data.length;
      if (offsetEnd >= chunkOffsetStart - 1) {
        endChunkIx = i;
      }
      if (offsetEnd <= chunkOffsetEnd + 1) {
        break;
      }
    }
    if (endChunkIx === NOT_FOUND) {
      endChunkIx = startChunkIx;
    }
    return {
      startIx: startChunkIx,
      endIx: endChunkIx
    };
  };
  _proto.hasDataRange = function hasDataRange(offsetStart, offsetEnd) {
    for (var i = 0; i < this._fileData.length; i++) {
      var chunk = this._fileData[i];
      if (offsetEnd < chunk.offset) {
        return false;
      }
      if (offsetStart >= chunk.offset && offsetEnd < chunk.offset + chunk.data.length) {
        return true;
      }
    }
    return false;
  };
  _proto.getByteAt = function getByteAt(offset) {
    var dataChunk;
    for (var i = 0; i < this._fileData.length; i++) {
      var dataChunkStart = this._fileData[i].offset;
      var dataChunkEnd = dataChunkStart + this._fileData[i].data.length - 1;
      if (offset >= dataChunkStart && offset <= dataChunkEnd) {
        dataChunk = this._fileData[i];
        break;
      }
    }
    if (dataChunk) {
      return dataChunk.data[offset - dataChunk.offset];
    }
    throw new Error("Offset " + offset + " hasn't been loaded yet.");
  };
  _createClass(ChunkedFileData, null, [{
    key: "NOT_FOUND",
    get: function get() {
      return NOT_FOUND;
    }
  }]);
  return ChunkedFileData;
}();

var InternalDecodedString = /*#__PURE__*/function () {
  function InternalDecodedString(value, bytesReadCount) {
    this._value = void 0;
    this.bytesReadCount = void 0;
    this.length = void 0;
    this._value = value;
    this.bytesReadCount = bytesReadCount;
    this.length = value.length;
  }
  var _proto = InternalDecodedString.prototype;
  _proto.toString = function toString() {
    return this._value;
  };
  return InternalDecodedString;
}();
var StringUtils = {
  readUTF16String: function readUTF16String(bytes, bigEndian, maxBytes) {
    var ix = 0;
    var offset1 = 1,
      offset2 = 0;
    maxBytes = Math.min(maxBytes || bytes.length, bytes.length);
    if (bytes[0] == 0xFE && bytes[1] == 0xFF) {
      bigEndian = true;
      ix = 2;
    } else if (bytes[0] == 0xFF && bytes[1] == 0xFE) {
      bigEndian = false;
      ix = 2;
    }
    if (bigEndian) {
      offset1 = 0;
      offset2 = 1;
    }
    var arr = [];
    for (var j = 0; ix < maxBytes; j++) {
      var byte1 = bytes[ix + offset1];
      var byte2 = bytes[ix + offset2];
      var word1 = (byte1 << 8) + byte2;
      ix += 2;
      if (word1 == 0x0000) {
        break;
      } else if (byte1 < 0xD8 || byte1 >= 0xE0) {
        arr[j] = String.fromCharCode(word1);
      } else {
        var byte3 = bytes[ix + offset1];
        var byte4 = bytes[ix + offset2];
        var word2 = (byte3 << 8) + byte4;
        ix += 2;
        arr[j] = String.fromCharCode(word1, word2);
      }
    }
    return new InternalDecodedString(arr.join(""), ix);
  },
  readUTF8String: function readUTF8String(bytes, maxBytes) {
    var ix = 0;
    maxBytes = Math.min(maxBytes || bytes.length, bytes.length);
    if (bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF) {
      ix = 3;
    }
    var arr = [];
    for (var j = 0; ix < maxBytes; j++) {
      var byte1 = bytes[ix++];
      if (byte1 == 0x00) {
        break;
      } else if (byte1 < 0x80) {
        arr[j] = String.fromCharCode(byte1);
      } else if (byte1 >= 0xC2 && byte1 < 0xE0) {
        var byte2 = bytes[ix++];
        arr[j] = String.fromCharCode(((byte1 & 0x1F) << 6) + (byte2 & 0x3F));
      } else if (byte1 >= 0xE0 && byte1 < 0xF0) {
        var byte2 = bytes[ix++];
        var byte3 = bytes[ix++];
        arr[j] = String.fromCharCode(((byte1 & 0xFF) << 12) + ((byte2 & 0x3F) << 6) + (byte3 & 0x3F));
      } else if (byte1 >= 0xF0 && byte1 < 0xF5) {
        var byte2 = bytes[ix++];
        var byte3 = bytes[ix++];
        var byte4 = bytes[ix++];
        var codepoint = ((byte1 & 0x07) << 18) + ((byte2 & 0x3F) << 12) + ((byte3 & 0x3F) << 6) + (byte4 & 0x3F) - 0x10000;
        arr[j] = String.fromCharCode((codepoint >> 10) + 0xD800, (codepoint & 0x3FF) + 0xDC00);
      }
    }
    return new InternalDecodedString(arr.join(""), ix);
  },
  readNullTerminatedString: function readNullTerminatedString(bytes, maxBytes) {
    var arr = [];
    maxBytes = maxBytes || bytes.length;
    for (var i = 0; i < maxBytes;) {
      var byte1 = bytes[i++];
      if (byte1 == 0x00) {
        break;
      }
      arr[i - 1] = String.fromCharCode(byte1);
    }
    return new InternalDecodedString(arr.join(""), i);
  }
};

var MediaFileReader = /*#__PURE__*/function () {
  function MediaFileReader() {
    this._isInitialized = void 0;
    this._size = void 0;
    this._isInitialized = false;
    this._size = 0;
  }
  MediaFileReader.canReadFile = function canReadFile(file) {
    throw new Error("Must implement canReadFile function");
  };
  var _proto = MediaFileReader.prototype;
  _proto.init = function init(callbacks) {
    var self = this;
    if (this._isInitialized) {
      setTimeout(callbacks.onSuccess, 1);
    } else {
      return this._init({
        onSuccess: function onSuccess() {
          self._isInitialized = true;
          callbacks.onSuccess();
        },
        onError: callbacks.onError
      });
    }
  };
  _proto._init = function _init(callbacks) {
    throw new Error("Must implement init function");
  };
  _proto.loadRange = function loadRange(range, callbacks) {
    throw new Error("Must implement loadRange function");
  };
  _proto.getSize = function getSize() {
    if (!this._isInitialized) {
      throw new Error("init() must be called first.");
    }
    return this._size;
  };
  _proto.getByteAt = function getByteAt(offset) {
    throw new Error("Must implement getByteAt function");
  };
  _proto.getBytesAt = function getBytesAt(offset, length) {
    var bytes = new Array(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = this.getByteAt(offset + i);
    }
    return bytes;
  };
  _proto.isBitSetAt = function isBitSetAt(offset, bit) {
    var iByte = this.getByteAt(offset);
    return (iByte & 1 << bit) != 0;
  };
  _proto.getSByteAt = function getSByteAt(offset) {
    var iByte = this.getByteAt(offset);
    if (iByte > 127) {
      return iByte - 256;
    } else {
      return iByte;
    }
  };
  _proto.getShortAt = function getShortAt(offset, isBigEndian) {
    var iShort = isBigEndian ? (this.getByteAt(offset) << 8) + this.getByteAt(offset + 1) : (this.getByteAt(offset + 1) << 8) + this.getByteAt(offset);
    if (iShort < 0) {
      iShort += 65536;
    }
    return iShort;
  };
  _proto.getSShortAt = function getSShortAt(offset, isBigEndian) {
    var iUShort = this.getShortAt(offset, isBigEndian);
    if (iUShort > 32767) {
      return iUShort - 65536;
    } else {
      return iUShort;
    }
  };
  _proto.getLongAt = function getLongAt(offset, isBigEndian) {
    var iByte1 = this.getByteAt(offset),
      iByte2 = this.getByteAt(offset + 1),
      iByte3 = this.getByteAt(offset + 2),
      iByte4 = this.getByteAt(offset + 3);
    var iLong = isBigEndian ? (((iByte1 << 8) + iByte2 << 8) + iByte3 << 8) + iByte4 : (((iByte4 << 8) + iByte3 << 8) + iByte2 << 8) + iByte1;
    if (iLong < 0) {
      iLong += 4294967296;
    }
    return iLong;
  };
  _proto.getSLongAt = function getSLongAt(offset, isBigEndian) {
    var iULong = this.getLongAt(offset, isBigEndian);
    if (iULong > 2147483647) {
      return iULong - 4294967296;
    } else {
      return iULong;
    }
  };
  _proto.getInteger24At = function getInteger24At(offset, isBigEndian) {
    var iByte1 = this.getByteAt(offset),
      iByte2 = this.getByteAt(offset + 1),
      iByte3 = this.getByteAt(offset + 2);
    var iInteger = isBigEndian ? ((iByte1 << 8) + iByte2 << 8) + iByte3 : ((iByte3 << 8) + iByte2 << 8) + iByte1;
    if (iInteger < 0) {
      iInteger += 16777216;
    }
    return iInteger;
  };
  _proto.getStringAt = function getStringAt(offset, length) {
    var string = [];
    for (var i = offset, j = 0; i < offset + length; i++, j++) {
      string[j] = String.fromCharCode(this.getByteAt(i));
    }
    return string.join("");
  };
  _proto.getStringWithCharsetAt = function getStringWithCharsetAt(offset, length, charset) {
    var bytes = this.getBytesAt(offset, length);
    var string;
    switch ((charset || '').toLowerCase()) {
      case "utf-16":
      case "utf-16le":
      case "utf-16be":
        string = StringUtils.readUTF16String(bytes, charset === "utf-16be");
        break;
      case "utf-8":
        string = StringUtils.readUTF8String(bytes);
        break;
      default:
        string = StringUtils.readNullTerminatedString(bytes);
        break;
    }
    return string;
  };
  _proto.getCharAt = function getCharAt(offset) {
    return String.fromCharCode(this.getByteAt(offset));
  };
  _proto.getSynchsafeInteger32At = function getSynchsafeInteger32At(offset) {
    var size1 = this.getByteAt(offset);
    var size2 = this.getByteAt(offset + 1);
    var size3 = this.getByteAt(offset + 2);
    var size4 = this.getByteAt(offset + 3);
    var size = size4 & 0x7f | (size3 & 0x7f) << 7 | (size2 & 0x7f) << 14 | (size1 & 0x7f) << 21;
    return size;
  };
  return MediaFileReader;
}();

var CHUNK_SIZE = 1024;
var XhrFileReader = /*#__PURE__*/function (_MediaFileReader) {
  _inheritsLoose(XhrFileReader, _MediaFileReader);
  function XhrFileReader(url) {
    var _this;
    _this = _MediaFileReader.call(this) || this;
    _this._url = void 0;
    _this._fileData = void 0;
    _this._url = url;
    _this._fileData = new ChunkedFileData();
    return _this;
  }
  XhrFileReader.canReadFile = function canReadFile(file) {
    return typeof file === 'string' && /^[a-z]+:\/\//i.test(file);
  };
  XhrFileReader.setConfig = function setConfig(config) {
    for (var key in config) if (config.hasOwnProperty(key)) {
      this._config[key] = config[key];
    }
    var disallowedXhrHeaders = this._config.disallowedXhrHeaders;
    for (var i = 0; i < disallowedXhrHeaders.length; i++) {
      disallowedXhrHeaders[i] = disallowedXhrHeaders[i].toLowerCase();
    }
  };
  var _proto = XhrFileReader.prototype;
  _proto._init = function _init(callbacks) {
    if (XhrFileReader._config.avoidHeadRequests) {
      this._fetchSizeWithGetRequest(callbacks);
    } else {
      this._fetchSizeWithHeadRequest(callbacks);
    }
  };
  _proto._fetchSizeWithHeadRequest = function _fetchSizeWithHeadRequest(callbacks) {
    var self = this;
    this._makeXHRRequest("HEAD", null, {
      onSuccess: function onSuccess(xhr) {
        var contentLength = self._parseContentLength(xhr);
        if (contentLength) {
          self._size = contentLength;
          callbacks.onSuccess();
        } else {
          self._fetchSizeWithGetRequest(callbacks);
        }
      },
      onError: callbacks.onError
    });
  };
  _proto._fetchSizeWithGetRequest = function _fetchSizeWithGetRequest(callbacks) {
    var self = this;
    var range = this._roundRangeToChunkMultiple([0, 0]);
    this._makeXHRRequest("GET", range, {
      onSuccess: function onSuccess(xhr) {
        var contentRange = self._parseContentRange(xhr);
        var data = self._getXhrResponseContent(xhr);
        if (contentRange) {
          if (contentRange.instanceLength == null) {
            self._fetchEntireFile(callbacks);
            return;
          }
          self._size = contentRange.instanceLength;
        } else {
          self._size = data.length;
        }
        self._fileData.addData(0, data);
        callbacks.onSuccess();
      },
      onError: callbacks.onError
    });
  };
  _proto._fetchEntireFile = function _fetchEntireFile(callbacks) {
    var self = this;
    this._makeXHRRequest("GET", null, {
      onSuccess: function onSuccess(xhr) {
        var data = self._getXhrResponseContent(xhr);
        self._size = data.length;
        self._fileData.addData(0, data);
        callbacks.onSuccess();
      },
      onError: callbacks.onError
    });
  };
  _proto._getXhrResponseContent = function _getXhrResponseContent(xhr) {
    return xhr.response || xhr.responseText || "";
  };
  _proto._parseContentLength = function _parseContentLength(xhr) {
    var contentLength = this._getResponseHeader(xhr, "Content-Length");
    if (contentLength == null) {
      return contentLength;
    } else {
      return parseInt(contentLength, 10);
    }
  };
  _proto._parseContentRange = function _parseContentRange(xhr) {
    var contentRange = this._getResponseHeader(xhr, "Content-Range");
    if (contentRange) {
      var parsedContentRange = contentRange.match(/bytes (\d+)-(\d+)\/(?:(\d+)|\*)/i);
      if (!parsedContentRange) {
        throw new Error("FIXME: Unknown Content-Range syntax: " + contentRange);
      }
      return {
        firstBytePosition: parseInt(parsedContentRange[1], 10),
        lastBytePosition: parseInt(parsedContentRange[2], 10),
        instanceLength: parsedContentRange[3] ? parseInt(parsedContentRange[3], 10) : null
      };
    } else {
      return null;
    }
  };
  _proto.loadRange = function loadRange(range, callbacks) {
    var self = this;
    if (self._fileData.hasDataRange(range[0], Math.min(self._size, range[1]))) {
      setTimeout(callbacks.onSuccess, 1);
      return;
    }
    range = this._roundRangeToChunkMultiple(range);
    range[1] = Math.min(self._size, range[1]);
    this._makeXHRRequest("GET", range, {
      onSuccess: function onSuccess(xhr) {
        var data = self._getXhrResponseContent(xhr);
        self._fileData.addData(range[0], data);
        callbacks.onSuccess();
      },
      onError: callbacks.onError
    });
  };
  _proto._roundRangeToChunkMultiple = function _roundRangeToChunkMultiple(range) {
    var length = range[1] - range[0] + 1;
    var newLength = Math.ceil(length / CHUNK_SIZE) * CHUNK_SIZE;
    return [range[0], range[0] + newLength - 1];
  };
  _proto._makeXHRRequest = function _makeXHRRequest(method, range, callbacks) {
    var xhr = this._createXHRObject();
    xhr.open(method, this._url);
    var onXHRLoad = function onXHRLoad() {
      if (xhr.status === 200 || xhr.status === 206) {
        callbacks.onSuccess(xhr);
      } else if (callbacks.onError) {
        callbacks.onError({
          "type": "xhr",
          "info": "Unexpected HTTP status " + xhr.status + ".",
          "xhr": xhr
        });
      }
      xhr = null;
    };
    if (typeof xhr.onload !== 'undefined') {
      xhr.onload = onXHRLoad;
      xhr.onerror = function () {
        if (callbacks.onError) {
          callbacks.onError({
            "type": "xhr",
            "info": "Generic XHR error, check xhr object.",
            "xhr": xhr
          });
        }
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          onXHRLoad();
        }
      };
    }
    if (XhrFileReader._config.timeoutInSec) {
      xhr.timeout = XhrFileReader._config.timeoutInSec * 1000;
      xhr.ontimeout = function () {
        if (callbacks.onError) {
          callbacks.onError({
            "type": "xhr",
            "info": "Timeout after " + xhr.timeout / 1000 + "s. Use jsmediatags.Config.setXhrTimeout to override.",
            "xhr": xhr
          });
        }
      };
    }
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    if (range) {
      this._setRequestHeader(xhr, "Range", "bytes=" + range[0] + "-" + range[1]);
    }
    this._setRequestHeader(xhr, "If-Modified-Since", "Sat, 01 Jan 1970 00:00:00 GMT");
    xhr.send(null);
  };
  _proto._setRequestHeader = function _setRequestHeader(xhr, headerName, headerValue) {
    if (XhrFileReader._config.disallowedXhrHeaders.indexOf(headerName.toLowerCase()) < 0) {
      xhr.setRequestHeader(headerName, headerValue);
    }
  };
  _proto._hasResponseHeader = function _hasResponseHeader(xhr, headerName) {
    var allResponseHeaders = xhr.getAllResponseHeaders();
    if (!allResponseHeaders) {
      return false;
    }
    var headers = allResponseHeaders.split("\r\n");
    var headerNames = [];
    for (var i = 0; i < headers.length; i++) {
      headerNames[i] = headers[i].split(":")[0].toLowerCase();
    }
    return headerNames.indexOf(headerName.toLowerCase()) >= 0;
  };
  _proto._getResponseHeader = function _getResponseHeader(xhr, headerName) {
    if (!this._hasResponseHeader(xhr, headerName)) {
      return null;
    }
    return xhr.getResponseHeader(headerName);
  };
  _proto.getByteAt = function getByteAt(offset) {
    var character = this._fileData.getByteAt(offset);
    return character.charCodeAt(0) & 0xff;
  };
  _proto._createXHRObject = function _createXHRObject() {
    if (typeof XMLHttpRequest !== "undefined") {
      return new XMLHttpRequest();
    }
    throw new Error("XMLHttpRequest is not supported");
  };
  return XhrFileReader;
}(MediaFileReader);
XhrFileReader._config = void 0;
XhrFileReader._config = {
  avoidHeadRequests: false,
  disallowedXhrHeaders: [],
  timeoutInSec: 30
};

var BlobFileReader = /*#__PURE__*/function (_MediaFileReader) {
  _inheritsLoose(BlobFileReader, _MediaFileReader);
  function BlobFileReader(blob) {
    var _this;
    _this = _MediaFileReader.call(this) || this;
    _this._blob = void 0;
    _this._fileData = void 0;
    _this._blob = blob;
    _this._fileData = new ChunkedFileData();
    return _this;
  }
  BlobFileReader.canReadFile = function canReadFile(file) {
    return typeof Blob !== "undefined" && file instanceof Blob || typeof File !== "undefined" && file instanceof File;
  };
  var _proto = BlobFileReader.prototype;
  _proto._init = function _init(callbacks) {
    this._size = this._blob.size;
    setTimeout(callbacks.onSuccess, 1);
  };
  _proto.loadRange = function loadRange(range, callbacks) {
    var self = this;
    var blobSlice = this._blob.slice;
    var blob = blobSlice.call(this._blob, range[0], range[1] + 1);
    var browserFileReader = new FileReader();
    browserFileReader.onloadend = function (event) {
      var intArray = new Uint8Array(browserFileReader.result);
      self._fileData.addData(range[0], intArray);
      callbacks.onSuccess();
    };
    browserFileReader.onerror = browserFileReader.onabort = function (event) {
      if (callbacks.onError) {
        callbacks.onError({
          type: "blob",
          info: browserFileReader.error
        });
      }
    };
    browserFileReader.readAsArrayBuffer(blob);
  };
  _proto.getByteAt = function getByteAt(offset) {
    return this._fileData.getByteAt(offset);
  };
  return BlobFileReader;
}(MediaFileReader);

var ArrayFileReader = /*#__PURE__*/function (_MediaFileReader) {
  _inheritsLoose(ArrayFileReader, _MediaFileReader);
  function ArrayFileReader(array) {
    var _this;
    _this = _MediaFileReader.call(this) || this;
    _this._array = void 0;
    _this._size = void 0;
    _this._array = array;
    _this._size = array.length;
    _this._isInitialized = true;
    return _this;
  }
  ArrayFileReader.canReadFile = function canReadFile(file) {
    return Array.isArray(file) || typeof Buffer === "function" && Buffer.isBuffer(file);
  };
  var _proto = ArrayFileReader.prototype;
  _proto.init = function init(callbacks) {
    setTimeout(callbacks.onSuccess, 0);
  };
  _proto.loadRange = function loadRange(range, callbacks) {
    setTimeout(callbacks.onSuccess, 0);
  };
  _proto.getByteAt = function getByteAt(offset) {
    if (offset >= this._array.length) {
      throw new Error("Offset " + offset + " hasn't been loaded yet.");
    }
    return this._array[offset];
  };
  return ArrayFileReader;
}(MediaFileReader);

var MediaTagReader = /*#__PURE__*/function () {
  function MediaTagReader(mediaFileReader) {
    this._mediaFileReader = void 0;
    this._tags = void 0;
    this._mediaFileReader = mediaFileReader;
    this._tags = null;
  }
  MediaTagReader.getTagIdentifierByteRange = function getTagIdentifierByteRange() {
    throw new Error("Must implement");
  };
  MediaTagReader.canReadTagFormat = function canReadTagFormat(tagIdentifier) {
    throw new Error("Must implement");
  };
  var _proto = MediaTagReader.prototype;
  _proto.setTagsToRead = function setTagsToRead(tags) {
    this._tags = tags;
    return this;
  };
  _proto.read = function read(callbacks) {
    var self = this;
    this._mediaFileReader.init({
      onSuccess: function onSuccess() {
        self._loadData(self._mediaFileReader, {
          onSuccess: function onSuccess() {
            try {
              var tags = self._parseData(self._mediaFileReader, self._tags);
            } catch (ex) {
              if (callbacks.onError) {
                callbacks.onError({
                  type: "parseData",
                  info: ex.message
                });
                return;
              }
            }
            callbacks.onSuccess(tags);
          },
          onError: callbacks.onError
        });
      },
      onError: callbacks.onError
    });
  };
  _proto.getShortcuts = function getShortcuts() {
    return {};
  };
  _proto._loadData = function _loadData(mediaFileReader, callbacks) {
    throw new Error("Must implement _loadData function");
  };
  _proto._parseData = function _parseData(mediaFileReader, tags) {
    throw new Error("Must implement _parseData function");
  };
  _proto._expandShortcutTags = function _expandShortcutTags(tagsWithShortcuts) {
    if (!tagsWithShortcuts) {
      return null;
    }
    var tags = [];
    var shortcuts = this.getShortcuts();
    for (var i = 0, tagOrShortcut; tagOrShortcut = tagsWithShortcuts[i]; i++) {
      tags = tags.concat(shortcuts[tagOrShortcut] || [tagOrShortcut]);
    }
    return tags;
  };
  return MediaTagReader;
}();

var ID3v1TagReader = /*#__PURE__*/function (_MediaTagReader) {
  _inheritsLoose(ID3v1TagReader, _MediaTagReader);
  function ID3v1TagReader() {
    return _MediaTagReader.apply(this, arguments) || this;
  }
  ID3v1TagReader.getTagIdentifierByteRange = function getTagIdentifierByteRange() {
    return {
      offset: -128,
      length: 128
    };
  };
  ID3v1TagReader.canReadTagFormat = function canReadTagFormat(tagIdentifier) {
    var id = String.fromCharCode.apply(String, tagIdentifier.slice(0, 3));
    return id === "TAG";
  };
  var _proto = ID3v1TagReader.prototype;
  _proto._loadData = function _loadData(mediaFileReader, callbacks) {
    var fileSize = mediaFileReader.getSize();
    mediaFileReader.loadRange([fileSize - 128, fileSize - 1], callbacks);
  };
  _proto._parseData = function _parseData(data, tags) {
    var offset = data.getSize() - 128;
    var title = data.getStringWithCharsetAt(offset + 3, 30).toString();
    var artist = data.getStringWithCharsetAt(offset + 33, 30).toString();
    var album = data.getStringWithCharsetAt(offset + 63, 30).toString();
    var year = data.getStringWithCharsetAt(offset + 93, 4).toString();
    var trackFlag = data.getByteAt(offset + 97 + 28);
    var track = data.getByteAt(offset + 97 + 29);
    if (trackFlag == 0 && track != 0) {
      var version = "1.1";
      var comment = data.getStringWithCharsetAt(offset + 97, 28).toString();
    } else {
      var version = "1.0";
      var comment = data.getStringWithCharsetAt(offset + 97, 30).toString();
      track = 0;
    }
    var genreIdx = data.getByteAt(offset + 97 + 30);
    if (genreIdx < 255) {
      var genre = GENRES[genreIdx];
    } else {
      var genre = "";
    }
    var tag = {
      "type": "ID3",
      "version": version,
      "tags": {
        "title": title,
        "artist": artist,
        "album": album,
        "year": year,
        "comment": comment,
        "genre": genre
      }
    };
    if (track) {
      tag.tags.track = track;
    }
    return tag;
  };
  return ID3v1TagReader;
}(MediaTagReader);
var GENRES = ["Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge", "Hip-Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B", "Rap", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska", "Death Metal", "Pranks", "Soundtrack", "Euro-Techno", "Ambient", "Trip-Hop", "Vocal", "Jazz+Funk", "Fusion", "Trance", "Classical", "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel", "Noise", "AlternRock", "Bass", "Soul", "Punk", "Space", "Meditative", "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic", "Darkwave", "Techno-Industrial", "Electronic", "Pop-Folk", "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta", "Top 40", "Christian Rap", "Pop/Funk", "Jungle", "Native American", "Cabaret", "New Wave", "Psychadelic", "Rave", "Showtunes", "Trailer", "Lo-Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro", "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock", "National Folk", "Swing", "Fast Fusion", "Bebob", "Latin", "Revival", "Celtic", "Bluegrass", "Avantgarde", "Gothic Rock", "Progressive Rock", "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band", "Chorus", "Easy Listening", "Acoustic", "Humour", "Speech", "Chanson", "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus", "Porn Groove", "Satire", "Slow Jam", "Club", "Tango", "Samba", "Folklore", "Ballad", "Power Ballad", "Rhythmic Soul", "Freestyle", "Duet", "Punk Rock", "Drum Solo", "Acapella", "Euro-House", "Dance Hall"];

var frameReaderFunctions = {};
var FRAME_DESCRIPTIONS = {
  "BUF": "Recommended buffer size",
  "CNT": "Play counter",
  "COM": "Comments",
  "CRA": "Audio encryption",
  "CRM": "Encrypted meta frame",
  "ETC": "Event timing codes",
  "EQU": "Equalization",
  "GEO": "General encapsulated object",
  "IPL": "Involved people list",
  "LNK": "Linked information",
  "MCI": "Music CD Identifier",
  "MLL": "MPEG location lookup table",
  "PIC": "Attached picture",
  "POP": "Popularimeter",
  "REV": "Reverb",
  "RVA": "Relative volume adjustment",
  "SLT": "Synchronized lyric/text",
  "STC": "Synced tempo codes",
  "TAL": "Album/Movie/Show title",
  "TBP": "BPM (Beats Per Minute)",
  "TCM": "Composer",
  "TCO": "Content type",
  "TCR": "Copyright message",
  "TDA": "Date",
  "TDY": "Playlist delay",
  "TEN": "Encoded by",
  "TFT": "File type",
  "TIM": "Time",
  "TKE": "Initial key",
  "TLA": "Language(s)",
  "TLE": "Length",
  "TMT": "Media type",
  "TOA": "Original artist(s)/performer(s)",
  "TOF": "Original filename",
  "TOL": "Original Lyricist(s)/text writer(s)",
  "TOR": "Original release year",
  "TOT": "Original album/Movie/Show title",
  "TP1": "Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",
  "TP2": "Band/Orchestra/Accompaniment",
  "TP3": "Conductor/Performer refinement",
  "TP4": "Interpreted, remixed, or otherwise modified by",
  "TPA": "Part of a set",
  "TPB": "Publisher",
  "TRC": "ISRC (International Standard Recording Code)",
  "TRD": "Recording dates",
  "TRK": "Track number/Position in set",
  "TSI": "Size",
  "TSS": "Software/hardware and settings used for encoding",
  "TT1": "Content group description",
  "TT2": "Title/Songname/Content description",
  "TT3": "Subtitle/Description refinement",
  "TXT": "Lyricist/text writer",
  "TXX": "User defined text information frame",
  "TYE": "Year",
  "UFI": "Unique file identifier",
  "ULT": "Unsychronized lyric/text transcription",
  "WAF": "Official audio file webpage",
  "WAR": "Official artist/performer webpage",
  "WAS": "Official audio source webpage",
  "WCM": "Commercial information",
  "WCP": "Copyright/Legal information",
  "WPB": "Publishers official webpage",
  "WXX": "User defined URL link frame",
  "AENC": "Audio encryption",
  "APIC": "Attached picture",
  "ASPI": "Audio seek point index",
  "CHAP": "Chapter",
  "CTOC": "Table of contents",
  "COMM": "Comments",
  "COMR": "Commercial frame",
  "ENCR": "Encryption method registration",
  "EQU2": "Equalisation (2)",
  "EQUA": "Equalization",
  "ETCO": "Event timing codes",
  "GEOB": "General encapsulated object",
  "GRID": "Group identification registration",
  "IPLS": "Involved people list",
  "LINK": "Linked information",
  "MCDI": "Music CD identifier",
  "MLLT": "MPEG location lookup table",
  "OWNE": "Ownership frame",
  "PRIV": "Private frame",
  "PCNT": "Play counter",
  "POPM": "Popularimeter",
  "POSS": "Position synchronisation frame",
  "RBUF": "Recommended buffer size",
  "RVA2": "Relative volume adjustment (2)",
  "RVAD": "Relative volume adjustment",
  "RVRB": "Reverb",
  "SEEK": "Seek frame",
  "SYLT": "Synchronized lyric/text",
  "SYTC": "Synchronized tempo codes",
  "TALB": "Album/Movie/Show title",
  "TBPM": "BPM (beats per minute)",
  "TCOM": "Composer",
  "TCON": "Content type",
  "TCOP": "Copyright message",
  "TDAT": "Date",
  "TDLY": "Playlist delay",
  "TDRC": "Recording time",
  "TDRL": "Release time",
  "TDTG": "Tagging time",
  "TENC": "Encoded by",
  "TEXT": "Lyricist/Text writer",
  "TFLT": "File type",
  "TIME": "Time",
  "TIPL": "Involved people list",
  "TIT1": "Content group description",
  "TIT2": "Title/songname/content description",
  "TIT3": "Subtitle/Description refinement",
  "TKEY": "Initial key",
  "TLAN": "Language(s)",
  "TLEN": "Length",
  "TMCL": "Musician credits list",
  "TMED": "Media type",
  "TMOO": "Mood",
  "TOAL": "Original album/movie/show title",
  "TOFN": "Original filename",
  "TOLY": "Original lyricist(s)/text writer(s)",
  "TOPE": "Original artist(s)/performer(s)",
  "TORY": "Original release year",
  "TOWN": "File owner/licensee",
  "TPE1": "Lead performer(s)/Soloist(s)",
  "TPE2": "Band/orchestra/accompaniment",
  "TPE3": "Conductor/performer refinement",
  "TPE4": "Interpreted, remixed, or otherwise modified by",
  "TPOS": "Part of a set",
  "TPRO": "Produced notice",
  "TPUB": "Publisher",
  "TRCK": "Track number/Position in set",
  "TRDA": "Recording dates",
  "TRSN": "Internet radio station name",
  "TRSO": "Internet radio station owner",
  "TSOA": "Album sort order",
  "TSOP": "Performer sort order",
  "TSOT": "Title sort order",
  "TSIZ": "Size",
  "TSRC": "ISRC (international standard recording code)",
  "TSSE": "Software/Hardware and settings used for encoding",
  "TSST": "Set subtitle",
  "TYER": "Year",
  "TXXX": "User defined text information frame",
  "UFID": "Unique file identifier",
  "USER": "Terms of use",
  "USLT": "Unsychronized lyric/text transcription",
  "WCOM": "Commercial information",
  "WCOP": "Copyright/Legal information",
  "WOAF": "Official audio file webpage",
  "WOAR": "Official artist/performer webpage",
  "WOAS": "Official audio source webpage",
  "WORS": "Official internet radio station homepage",
  "WPAY": "Payment",
  "WPUB": "Publishers official webpage",
  "WXXX": "User defined URL link frame"
};
var ID3v2FrameReader = /*#__PURE__*/function () {
  function ID3v2FrameReader() {}
  ID3v2FrameReader.getFrameReaderFunction = function getFrameReaderFunction(frameId) {
    if (frameId in frameReaderFunctions) {
      return frameReaderFunctions[frameId];
    } else if (frameId[0] === "T") {
      return frameReaderFunctions["T*"];
    } else if (frameId[0] === "W") {
      return frameReaderFunctions["W*"];
    } else {
      return null;
    }
  };
  ID3v2FrameReader.readFrames = function readFrames(offset, end, data, id3header, tags) {
    var frames = {};
    var frameHeaderSize = this._getFrameHeaderSize(id3header);
    while (offset < end - frameHeaderSize) {
      var header = this._readFrameHeader(data, offset, id3header);
      var frameId = header.id;
      if (!frameId) {
        break;
      }
      var flags = header.flags;
      var frameSize = header.size;
      var frameDataOffset = offset + header.headerSize;
      var frameData = data;
      offset += header.headerSize + header.size;
      if (tags && tags.indexOf(frameId) === -1) {
        continue;
      }
      if (frameId === 'MP3e' || frameId === '\x00MP3' || frameId === '\x00\x00MP' || frameId === ' MP3') {
        break;
      }
      if (flags && flags.format.unsynchronisation && !id3header.flags.unsynchronisation) {
        frameData = this.getUnsyncFileReader(frameData, frameDataOffset, frameSize);
        frameDataOffset = 0;
        frameSize = frameData.getSize();
      }
      if (flags && flags.format.data_length_indicator) {
        frameDataOffset += 4;
        frameSize -= 4;
      }
      var readFrameFunc = ID3v2FrameReader.getFrameReaderFunction(frameId);
      var parsedData = readFrameFunc ? readFrameFunc.apply(this, [frameDataOffset, frameSize, frameData, flags, id3header]) : null;
      var desc = this._getFrameDescription(frameId);
      var frame = {
        id: frameId,
        size: frameSize,
        description: desc,
        data: parsedData
      };
      if (frameId in frames) {
        if (frames[frameId].id) {
          frames[frameId] = [frames[frameId]];
        }
        frames[frameId].push(frame);
      } else {
        frames[frameId] = frame;
      }
    }
    return frames;
  };
  ID3v2FrameReader._getFrameHeaderSize = function _getFrameHeaderSize(id3header) {
    var major = id3header.major;
    if (major == 2) {
      return 6;
    } else if (major == 3 || major == 4) {
      return 10;
    } else {
      return 0;
    }
  };
  ID3v2FrameReader._readFrameHeader = function _readFrameHeader(data, offset, id3header) {
    var major = id3header.major;
    var flags = null;
    var frameHeaderSize = this._getFrameHeaderSize(id3header);
    switch (major) {
      case 2:
        var frameId = data.getStringAt(offset, 3);
        var frameSize = data.getInteger24At(offset + 3, true);
        break;
      case 3:
        var frameId = data.getStringAt(offset, 4);
        var frameSize = data.getLongAt(offset + 4, true);
        break;
      case 4:
        var frameId = data.getStringAt(offset, 4);
        var frameSize = data.getSynchsafeInteger32At(offset + 4);
        break;
    }
    if (frameId == String.fromCharCode(0, 0, 0) || frameId == String.fromCharCode(0, 0, 0, 0)) {
      frameId = "";
    }
    if (frameId) {
      if (major > 2) {
        flags = this._readFrameFlags(data, offset + 8);
      }
    }
    return {
      "id": frameId || "",
      "size": frameSize || 0,
      "headerSize": frameHeaderSize || 0,
      "flags": flags
    };
  };
  ID3v2FrameReader._readFrameFlags = function _readFrameFlags(data, offset) {
    return {
      message: {
        tag_alter_preservation: data.isBitSetAt(offset, 6),
        file_alter_preservation: data.isBitSetAt(offset, 5),
        read_only: data.isBitSetAt(offset, 4)
      },
      format: {
        grouping_identity: data.isBitSetAt(offset + 1, 7),
        compression: data.isBitSetAt(offset + 1, 3),
        encryption: data.isBitSetAt(offset + 1, 2),
        unsynchronisation: data.isBitSetAt(offset + 1, 1),
        data_length_indicator: data.isBitSetAt(offset + 1, 0)
      }
    };
  };
  ID3v2FrameReader._getFrameDescription = function _getFrameDescription(frameId) {
    if (frameId in FRAME_DESCRIPTIONS) {
      return FRAME_DESCRIPTIONS[frameId];
    } else {
      return 'Unknown';
    }
  };
  ID3v2FrameReader.getUnsyncFileReader = function getUnsyncFileReader(data, offset, size) {
    var frameData = data.getBytesAt(offset, size);
    for (var i = 0; i < frameData.length - 1; i++) {
      if (frameData[i] === 0xff && frameData[i + 1] === 0x00) {
        frameData.splice(i + 1, 1);
      }
    }
    return new ArrayFileReader(frameData);
  };
  return ID3v2FrameReader;
}();
frameReaderFunctions['APIC'] = function readPictureFrame(offset, length, data, flags, id3header) {
  var start = offset;
  var charset = getTextEncoding(data.getByteAt(offset));
  switch (id3header && id3header.major) {
    case 2:
      var format = data.getStringAt(offset + 1, 3);
      offset += 4;
      break;
    case 3:
    case 4:
      var format = data.getStringWithCharsetAt(offset + 1, length - 1);
      offset += 1 + format.bytesReadCount;
      break;
    default:
      throw new Error("Couldn't read ID3v2 major version.");
  }
  var bite = data.getByteAt(offset);
  var type = PICTURE_TYPE[bite];
  var desc = data.getStringWithCharsetAt(offset + 1, length - (offset - start) - 1, charset);
  offset += 1 + desc.bytesReadCount;
  return {
    "format": format.toString(),
    "type": type,
    "description": desc.toString(),
    "data": data.getBytesAt(offset, start + length - offset)
  };
};
frameReaderFunctions['CHAP'] = function readChapterFrame(offset, length, data, flags, id3header) {
  var originalOffset = offset;
  var result = {};
  var id = StringUtils.readNullTerminatedString(data.getBytesAt(offset, length));
  result.id = id.toString();
  offset += id.bytesReadCount;
  result.startTime = data.getLongAt(offset, true);
  offset += 4;
  result.endTime = data.getLongAt(offset, true);
  offset += 4;
  result.startOffset = data.getLongAt(offset, true);
  offset += 4;
  result.endOffset = data.getLongAt(offset, true);
  offset += 4;
  var remainingLength = length - (offset - originalOffset);
  result.subFrames = this.readFrames(offset, offset + remainingLength, data, id3header);
  return result;
};
frameReaderFunctions['CTOC'] = function readTableOfContentsFrame(offset, length, data, flags, id3header) {
  var originalOffset = offset;
  var result = {
    childElementIds: [],
    id: undefined,
    topLevel: undefined,
    ordered: undefined,
    entryCount: undefined,
    subFrames: undefined
  };
  var id = StringUtils.readNullTerminatedString(data.getBytesAt(offset, length));
  result.id = id.toString();
  offset += id.bytesReadCount;
  result.topLevel = data.isBitSetAt(offset, 1);
  result.ordered = data.isBitSetAt(offset, 0);
  offset++;
  result.entryCount = data.getByteAt(offset);
  offset++;
  for (var i = 0; i < result.entryCount; i++) {
    var childId = StringUtils.readNullTerminatedString(data.getBytesAt(offset, length - (offset - originalOffset)));
    result.childElementIds.push(childId.toString());
    offset += childId.bytesReadCount;
  }
  var remainingLength = length - (offset - originalOffset);
  result.subFrames = this.readFrames(offset, offset + remainingLength, data, id3header);
  return result;
};
frameReaderFunctions['COMM'] = function readCommentsFrame(offset, length, data, flags, id3header) {
  var start = offset;
  var charset = getTextEncoding(data.getByteAt(offset));
  var language = data.getStringAt(offset + 1, 3);
  var shortdesc = data.getStringWithCharsetAt(offset + 4, length - 4, charset);
  offset += 4 + shortdesc.bytesReadCount;
  var text = data.getStringWithCharsetAt(offset, start + length - offset, charset);
  return {
    language: language,
    short_description: shortdesc.toString(),
    text: text.toString()
  };
};
frameReaderFunctions['COM'] = frameReaderFunctions['COMM'];
frameReaderFunctions['PIC'] = function (offset, length, data, flags, id3header) {
  return frameReaderFunctions['APIC'](offset, length, data, flags, id3header);
};
frameReaderFunctions['PCNT'] = function readCounterFrame(offset, length, data, flags, id3header) {
  return data.getLongAt(offset, false);
};
frameReaderFunctions['CNT'] = frameReaderFunctions['PCNT'];
frameReaderFunctions['T*'] = function readTextFrame(offset, length, data, flags, id3header) {
  var charset = getTextEncoding(data.getByteAt(offset));
  return data.getStringWithCharsetAt(offset + 1, length - 1, charset).toString();
};
frameReaderFunctions['TXXX'] = function readTextFrame(offset, length, data, flags, id3header) {
  var charset = getTextEncoding(data.getByteAt(offset));
  return getUserDefinedFields(offset, length, data, charset);
};
frameReaderFunctions['WXXX'] = function readUrlFrame(offset, length, data, flags, id3header) {
  if (length === 0) {
    return null;
  }
  var charset = getTextEncoding(data.getByteAt(offset));
  return getUserDefinedFields(offset, length, data, charset);
};
frameReaderFunctions['W*'] = function readUrlFrame(offset, length, data, flags, id3header) {
  if (length === 0) {
    return null;
  }
  return data.getStringWithCharsetAt(offset, length, 'iso-8859-1').toString();
};
frameReaderFunctions['TCON'] = function readGenreFrame(offset, length, data, flags) {
  var text = frameReaderFunctions['T*'].apply(this, arguments);
  return text.replace(/^\(\d+\)/, '');
};
frameReaderFunctions['TCO'] = frameReaderFunctions['TCON'];
frameReaderFunctions['USLT'] = function readLyricsFrame(offset, length, data, flags, id3header) {
  var start = offset;
  var charset = getTextEncoding(data.getByteAt(offset));
  var language = data.getStringAt(offset + 1, 3);
  var descriptor = data.getStringWithCharsetAt(offset + 4, length - 4, charset);
  offset += 4 + descriptor.bytesReadCount;
  var lyrics = data.getStringWithCharsetAt(offset, start + length - offset, charset);
  return {
    language: language,
    descriptor: descriptor.toString(),
    lyrics: lyrics.toString()
  };
};
frameReaderFunctions['ULT'] = frameReaderFunctions['USLT'];
frameReaderFunctions['UFID'] = function readLyricsFrame(offset, length, data, flags, id3header) {
  var ownerIdentifier = StringUtils.readNullTerminatedString(data.getBytesAt(offset, length));
  offset += ownerIdentifier.bytesReadCount;
  var identifier = data.getBytesAt(offset, length - ownerIdentifier.bytesReadCount);
  return {
    ownerIdentifier: ownerIdentifier.toString(),
    identifier: identifier
  };
};
function getTextEncoding(bite) {
  var charset;
  switch (bite) {
    case 0x00:
      charset = 'iso-8859-1';
      break;
    case 0x01:
      charset = 'utf-16';
      break;
    case 0x02:
      charset = 'utf-16be';
      break;
    case 0x03:
      charset = 'utf-8';
      break;
    default:
      charset = 'iso-8859-1';
  }
  return charset;
}
function getUserDefinedFields(offset, length, data, charset) {
  var userDesc = data.getStringWithCharsetAt(offset + 1, length - 1, charset);
  var userDefinedData = data.getStringWithCharsetAt(offset + 1 + userDesc.bytesReadCount, length - 1 - userDesc.bytesReadCount, charset);
  return {
    user_description: userDesc.toString(),
    data: userDefinedData.toString()
  };
}
var PICTURE_TYPE = ["Other", "32x32 pixels 'file icon' (PNG only)", "Other file icon", "Cover (front)", "Cover (back)", "Leaflet page", "Media (e.g. label side of CD)", "Lead artist/lead performer/soloist", "Artist/performer", "Conductor", "Band/Orchestra", "Composer", "Lyricist/text writer", "Recording Location", "During recording", "During performance", "Movie/video screen capture", "A bright coloured fish", "Illustration", "Band/artist logotype", "Publisher/Studio logotype"];

var ID3_HEADER_SIZE = 10;
var ID3v2TagReader = /*#__PURE__*/function (_MediaTagReader) {
  _inheritsLoose(ID3v2TagReader, _MediaTagReader);
  function ID3v2TagReader() {
    return _MediaTagReader.apply(this, arguments) || this;
  }
  ID3v2TagReader.getTagIdentifierByteRange = function getTagIdentifierByteRange() {
    return {
      offset: 0,
      length: ID3_HEADER_SIZE
    };
  };
  ID3v2TagReader.canReadTagFormat = function canReadTagFormat(tagIdentifier) {
    var id = String.fromCharCode.apply(String, tagIdentifier.slice(0, 3));
    return id === 'ID3';
  };
  var _proto = ID3v2TagReader.prototype;
  _proto._loadData = function _loadData(mediaFileReader, callbacks) {
    mediaFileReader.loadRange([6, 9], {
      onSuccess: function onSuccess() {
        mediaFileReader.loadRange([0, ID3_HEADER_SIZE + mediaFileReader.getSynchsafeInteger32At(6) - 1], callbacks);
      },
      onError: callbacks.onError
    });
  };
  _proto._parseData = function _parseData(data, tags) {
    var offset = 0;
    var major = data.getByteAt(offset + 3);
    if (major > 4) {
      return {
        "type": "ID3",
        "version": ">2.4",
        "tags": {}
      };
    }
    var revision = data.getByteAt(offset + 4);
    var unsynch = data.isBitSetAt(offset + 5, 7);
    var xheader = data.isBitSetAt(offset + 5, 6);
    var xindicator = data.isBitSetAt(offset + 5, 5);
    var size = data.getSynchsafeInteger32At(offset + 6);
    offset += 10;
    if (xheader) {
      if (major === 4) {
        var xheadersize = data.getSynchsafeInteger32At(offset);
        offset += xheadersize;
      } else {
        var xheadersize = data.getLongAt(offset, true);
        offset += xheadersize + 4;
      }
    }
    var id3 = {
      "type": "ID3",
      "version": '2.' + major + '.' + revision,
      "major": major,
      "revision": revision,
      "flags": {
        "unsynchronisation": unsynch,
        "extended_header": xheader,
        "experimental_indicator": xindicator,
        "footer_present": false
      },
      "size": size,
      "tags": {}
    };
    if (tags) {
      var expandedTags = this._expandShortcutTags(tags);
    }
    var offsetEnd = size + 10;
    if (id3.flags.unsynchronisation) {
      data = ID3v2FrameReader.getUnsyncFileReader(data, offset, size);
      offset = 0;
      offsetEnd = data.getSize();
    }
    var frames = ID3v2FrameReader.readFrames(offset, offsetEnd, data, id3, expandedTags);
    for (var name in SHORTCUTS$1) if (SHORTCUTS$1.hasOwnProperty(name)) {
      var frameData = this._getFrameData(frames, SHORTCUTS$1[name]);
      if (frameData) {
        id3.tags[name] = frameData;
      }
    }
    for (var frame in frames) if (frames.hasOwnProperty(frame)) {
      id3.tags[frame] = frames[frame];
    }
    return id3;
  };
  _proto._getFrameData = function _getFrameData(frames, ids) {
    var frame;
    for (var i = 0, id; id = ids[i]; i++) {
      if (id in frames) {
        if (frames[id] instanceof Array) {
          frame = frames[id][0];
        } else {
          frame = frames[id];
        }
        return frame.data;
      }
    }
  };
  _proto.getShortcuts = function getShortcuts() {
    return SHORTCUTS$1;
  };
  return ID3v2TagReader;
}(MediaTagReader);
var SHORTCUTS$1 = {
  "title": ["TIT2", "TT2"],
  "artist": ["TPE1", "TP1"],
  "album": ["TALB", "TAL"],
  "year": ["TYER", "TYE"],
  "comment": ["COMM", "COM"],
  "track": ["TRCK", "TRK"],
  "genre": ["TCON", "TCO"],
  "picture": ["APIC", "PIC"],
  "lyrics": ["USLT", "ULT"]
};

var MP4TagReader = /*#__PURE__*/function (_MediaTagReader) {
  _inheritsLoose(MP4TagReader, _MediaTagReader);
  function MP4TagReader() {
    return _MediaTagReader.apply(this, arguments) || this;
  }
  MP4TagReader.getTagIdentifierByteRange = function getTagIdentifierByteRange() {
    return {
      offset: 0,
      length: 16
    };
  };
  MP4TagReader.canReadTagFormat = function canReadTagFormat(tagIdentifier) {
    var id = String.fromCharCode.apply(String, tagIdentifier.slice(4, 8));
    return id === "ftyp";
  };
  var _proto = MP4TagReader.prototype;
  _proto._loadData = function _loadData(mediaFileReader, callbacks) {
    var self = this;
    mediaFileReader.loadRange([0, 16], {
      onSuccess: function onSuccess() {
        self._loadAtom(mediaFileReader, 0, "", callbacks);
      },
      onError: callbacks.onError
    });
  };
  _proto._loadAtom = function _loadAtom(mediaFileReader, offset, parentAtomFullName, callbacks) {
    if (offset >= mediaFileReader.getSize()) {
      callbacks.onSuccess();
      return;
    }
    var self = this;
    var atomSize = mediaFileReader.getLongAt(offset, true);
    if (atomSize == 0 || isNaN(atomSize)) {
      callbacks.onSuccess();
      return;
    }
    var atomName = mediaFileReader.getStringAt(offset + 4, 4);
    if (this._isContainerAtom(atomName)) {
      if (atomName == "meta") {
        offset += 4;
      }
      var atomFullName = (parentAtomFullName ? parentAtomFullName + "." : "") + atomName;
      if (atomFullName === "moov.udta.meta.ilst") {
        mediaFileReader.loadRange([offset, offset + atomSize], callbacks);
      } else {
        mediaFileReader.loadRange([offset + 8, offset + 8 + 8], {
          onSuccess: function onSuccess() {
            self._loadAtom(mediaFileReader, offset + 8, atomFullName, callbacks);
          },
          onError: callbacks.onError
        });
      }
    } else {
      mediaFileReader.loadRange([offset + atomSize, offset + atomSize + 8], {
        onSuccess: function onSuccess() {
          self._loadAtom(mediaFileReader, offset + atomSize, parentAtomFullName, callbacks);
        },
        onError: callbacks.onError
      });
    }
  };
  _proto._isContainerAtom = function _isContainerAtom(atomName) {
    return ["moov", "udta", "meta", "ilst"].indexOf(atomName) >= 0;
  };
  _proto._canReadAtom = function _canReadAtom(atomName) {
    return true;
  };
  _proto._parseData = function _parseData(data, tagsToRead) {
    var tags = {};
    tagsToRead = this._expandShortcutTags(tagsToRead);
    this._readAtom(tags, data, 0, data.getSize(), tagsToRead);
    for (var name in SHORTCUTS) if (SHORTCUTS.hasOwnProperty(name)) {
      var tag = tags[SHORTCUTS[name]];
      if (tag) {
        if (name === "track") {
          tags[name] = tag.data.track;
        } else {
          tags[name] = tag.data;
        }
      }
    }
    return {
      "type": "MP4",
      "ftyp": data.getStringAt(8, 4),
      "version": data.getLongAt(12, true),
      "tags": tags
    };
  };
  _proto._readAtom = function _readAtom(tags, data, offset, length, tagsToRead, parentAtomFullName, indent) {
    indent = indent === undefined ? "" : indent + "  ";
    var seek = offset;
    while (seek < offset + length) {
      var atomSize = data.getLongAt(seek, true);
      if (atomSize == 0) {
        return;
      }
      var atomName = data.getStringAt(seek + 4, 4);
      if (this._isContainerAtom(atomName)) {
        if (atomName == "meta") {
          seek += 4;
        }
        var atomFullName = (parentAtomFullName ? parentAtomFullName + "." : "") + atomName;
        this._readAtom(tags, data, seek + 8, atomSize - 8, tagsToRead, atomFullName, indent);
        return;
      }
      if ((!tagsToRead || tagsToRead.indexOf(atomName) >= 0) && parentAtomFullName === "moov.udta.meta.ilst" && this._canReadAtom(atomName)) {
        if (atomName === '----') {
          var atomData = this._readMeanMetadataAtom(data, seek);
          tags[atomData.id] = atomData;
        } else {
          tags[atomName] = this._readMetadataAtom(data, seek);
        }
      }
      seek += atomSize;
    }
  };
  _proto._readMetadataAtom = function _readMetadataAtom(data, offset) {
    var METADATA_HEADER = 16;
    var atomSize = data.getLongAt(offset, true);
    var atomName = data.getStringAt(offset + 4, 4);
    var klass = data.getInteger24At(offset + METADATA_HEADER + 1, true);
    var type = TYPES[klass];
    var atomData;
    var bigEndian = true;
    if (atomName == "trkn") {
      atomData = {
        "track": data.getShortAt(offset + METADATA_HEADER + 10, bigEndian),
        "total": data.getShortAt(offset + METADATA_HEADER + 14, bigEndian)
      };
    } else if (atomName == "disk") {
      atomData = {
        "disk": data.getShortAt(offset + METADATA_HEADER + 10, bigEndian),
        "total": data.getShortAt(offset + METADATA_HEADER + 14, bigEndian)
      };
    } else {
      var atomHeader = METADATA_HEADER + 4 + 4;
      var dataStart = offset + atomHeader;
      var dataLength = atomSize - atomHeader;
      var atomData;
      if (atomName === 'covr' && type === 'uint8') {
        type = 'jpeg';
      }
      switch (type) {
        case "text":
          atomData = data.getStringWithCharsetAt(dataStart, dataLength, "utf-8").toString();
          break;
        case "uint8":
          atomData = data.getShortAt(dataStart, false);
          break;
        case "int":
        case "uint":
          var intReader = type == 'int' ? dataLength == 1 ? data.getSByteAt : dataLength == 2 ? data.getSShortAt : dataLength == 4 ? data.getSLongAt : data.getLongAt : dataLength == 1 ? data.getByteAt : dataLength == 2 ? data.getShortAt : data.getLongAt;
          atomData = intReader.call(data, dataStart + (dataLength == 8 ? 4 : 0), true);
          break;
        case "jpeg":
        case "png":
          atomData = {
            "format": "image/" + type,
            "data": data.getBytesAt(dataStart, dataLength)
          };
          break;
      }
    }
    return {
      id: atomName,
      size: atomSize,
      start: offset,
      description: ATOM_DESCRIPTIONS[atomName] || "Unknown",
      data: atomData
    };
  };
  _proto._readMeanMetadataAtom = function _readMeanMetadataAtom(data, offset) {
    var METADATA_HEADER = 16;
    var atomSize = data.getLongAt(offset, true);
    var atomName = data.getStringAt(offset + 4, 4);
    var description = '';
    data.getInteger24At(offset + METADATA_HEADER + 1, true);
    var atomData;
    if (atomName == "----") {
      var parentAtomName = atomName;
      var atomOffset = offset + 8;
      atomSize = data.getLongAt(atomOffset, true);
      atomName = data.getStringAt(atomOffset + 4, 4);
      parentAtomName += '/' + atomName;
      if (atomName === "mean") {
        atomOffset += 8;
        atomName = data.getStringAt(atomOffset + 4, atomSize - 12);
        parentAtomName += '/' + atomName;
        atomOffset = offset + atomSize + 8;
        atomSize = data.getLongAt(atomOffset, true);
        atomName = data.getStringAt(atomOffset + 4, 4);
        if (atomName === "name") {
          atomName = data.getStringAt(atomOffset + 12, atomSize - 12);
          parentAtomName += '/' + atomName;
          description = atomName;
          atomOffset += atomSize;
          atomSize = data.getLongAt(atomOffset, true);
          atomName = data.getStringAt(atomOffset + 4, 4);
          var dataStart = atomOffset + METADATA_HEADER;
          var dataLength = atomSize - METADATA_HEADER;
          atomData = data.getStringWithCharsetAt(dataStart, dataLength, "utf-8").toString();
          return {
            id: parentAtomName,
            size: atomSize,
            start: offset,
            description: description,
            data: atomData
          };
        }
      }
    }
  };
  _proto.getShortcuts = function getShortcuts() {
    return SHORTCUTS;
  };
  return MP4TagReader;
}(MediaTagReader);
var TYPES = {
  "0": "uint8",
  "1": "text",
  "13": "jpeg",
  "14": "png",
  "21": "int",
  "22": "uint"
};
var ATOM_DESCRIPTIONS = {
  "©alb": "Album",
  "©ART": "Artist",
  "aART": "Album Artist",
  "©day": "Release Date",
  "©nam": "Title",
  "©gen": "Genre",
  "gnre": "Genre",
  "trkn": "Track Number",
  "©wrt": "Composer",
  "©too": "Encoding Tool",
  "©enc": "Encoded By",
  "cprt": "Copyright",
  "covr": "Cover Art",
  "©grp": "Grouping",
  "keyw": "Keywords",
  "©lyr": "Lyrics",
  "©cmt": "Comment",
  "tmpo": "Tempo",
  "cpil": "Compilation",
  "disk": "Disc Number",
  "tvsh": "TV Show Name",
  "tven": "TV Episode ID",
  "tvsn": "TV Season",
  "tves": "TV Episode",
  "tvnn": "TV Network",
  "desc": "Description",
  "ldes": "Long Description",
  "sonm": "Sort Name",
  "soar": "Sort Artist",
  "soaa": "Sort Album",
  "soco": "Sort Composer",
  "sosn": "Sort Show",
  "purd": "Purchase Date",
  "pcst": "Podcast",
  "purl": "Podcast URL",
  "catg": "Category",
  "hdvd": "HD Video",
  "stik": "Media Type",
  "rtng": "Content Rating",
  "pgap": "Gapless Playback",
  "apID": "Purchase Account",
  "sfID": "Country Code",
  "atID": "Artist ID",
  "cnID": "Catalog ID",
  "plID": "Collection ID",
  "geID": "Genre ID",
  "xid ": "Vendor Information",
  "flvr": "Codec Flavor"
};
var SHORTCUTS = {
  "title": "©nam",
  "artist": "©ART",
  "album": "©alb",
  "year": "©day",
  "comment": "©cmt",
  "track": "trkn",
  "genre": "©gen",
  "picture": "covr",
  "lyrics": "©lyr"
};

var FLAC_HEADER_SIZE = 4;
var COMMENT_HEADERS = [4, 132];
var PICTURE_HEADERS = [6, 134];
var IMAGE_TYPES = ["Other", "32x32 pixels 'file icon' (PNG only)", "Other file icon", "Cover (front)", "Cover (back)", "Leaflet page", "Media (e.g. label side of CD)", "Lead artist/lead performer/soloist", "Artist/performer", "Conductor", "Band/Orchestra", "Composer", "Lyricist/text writer", "Recording Location", "During recording", "During performance", "Movie/video screen capture", "A bright coloured fish", "Illustration", "Band/artist logotype", "Publisher/Studio logotype"];
var FLACTagReader = /*#__PURE__*/function (_MediaTagReader) {
  _inheritsLoose(FLACTagReader, _MediaTagReader);
  function FLACTagReader() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _MediaTagReader.call.apply(_MediaTagReader, [this].concat(args)) || this;
    _this._commentOffset = void 0;
    _this._pictureOffset = void 0;
    return _this;
  }
  FLACTagReader.getTagIdentifierByteRange = function getTagIdentifierByteRange() {
    return {
      offset: 0,
      length: FLAC_HEADER_SIZE
    };
  };
  FLACTagReader.canReadTagFormat = function canReadTagFormat(tagIdentifier) {
    var id = String.fromCharCode.apply(String, tagIdentifier.slice(0, 4));
    return id === 'fLaC';
  };
  var _proto = FLACTagReader.prototype;
  _proto._loadData = function _loadData(mediaFileReader, callbacks) {
    var self = this;
    mediaFileReader.loadRange([4, 7], {
      onSuccess: function onSuccess() {
        self._loadBlock(mediaFileReader, 4, callbacks);
      }
    });
  };
  _proto._loadBlock = function _loadBlock(mediaFileReader, offset, callbacks) {
    var self = this;
    var blockHeader = mediaFileReader.getByteAt(offset);
    var blockSize = mediaFileReader.getInteger24At(offset + 1, true);
    if (COMMENT_HEADERS.indexOf(blockHeader) !== -1) {
      var offsetMetadata = offset + 4;
      mediaFileReader.loadRange([offsetMetadata, offsetMetadata + blockSize], {
        onSuccess: function onSuccess() {
          self._commentOffset = offsetMetadata;
          self._nextBlock(mediaFileReader, offset, blockHeader, blockSize, callbacks);
        }
      });
    } else if (PICTURE_HEADERS.indexOf(blockHeader) !== -1) {
      var offsetMetadata = offset + 4;
      mediaFileReader.loadRange([offsetMetadata, offsetMetadata + blockSize], {
        onSuccess: function onSuccess() {
          self._pictureOffset = offsetMetadata;
          self._nextBlock(mediaFileReader, offset, blockHeader, blockSize, callbacks);
        }
      });
    } else {
      self._nextBlock(mediaFileReader, offset, blockHeader, blockSize, callbacks);
    }
  };
  _proto._nextBlock = function _nextBlock(mediaFileReader, offset, blockHeader, blockSize, callbacks) {
    var self = this;
    if (blockHeader > 127) {
      if (!self._commentOffset) {
        callbacks.onError({
          "type": "loadData",
          "info": "Comment block could not be found."
        });
      } else {
        callbacks.onSuccess();
      }
    } else {
      mediaFileReader.loadRange([offset + 4 + blockSize, offset + 4 + 4 + blockSize], {
        onSuccess: function onSuccess() {
          self._loadBlock(mediaFileReader, offset + 4 + blockSize, callbacks);
        }
      });
    }
  };
  _proto._parseData = function _parseData(data, tags) {
    var vendorLength = data.getLongAt(this._commentOffset, false);
    var offsetVendor = this._commentOffset + 4;
    var offsetList = vendorLength + offsetVendor;
    var numComments = data.getLongAt(offsetList, false);
    var dataOffset = offsetList + 4;
    var title, artist, album, track, genre, picture;
    for (var i = 0; i < numComments; i++) {
      var _dataLength = data.getLongAt(dataOffset, false);
      var s = data.getStringWithCharsetAt(dataOffset + 4, _dataLength, "utf-8").toString();
      var d = s.indexOf("=");
      var split = [s.slice(0, d), s.slice(d + 1)];
      switch (split[0].toUpperCase()) {
        case "TITLE":
          title = split[1];
          break;
        case "ARTIST":
          artist = split[1];
          break;
        case "ALBUM":
          album = split[1];
          break;
        case "TRACKNUMBER":
          track = split[1];
          break;
        case "GENRE":
          genre = split[1];
          break;
      }
      dataOffset += 4 + _dataLength;
    }
    if (this._pictureOffset) {
      var imageType = data.getLongAt(this._pictureOffset, true);
      var offsetMimeLength = this._pictureOffset + 4;
      var mimeLength = data.getLongAt(offsetMimeLength, true);
      var offsetMime = offsetMimeLength + 4;
      var mime = data.getStringAt(offsetMime, mimeLength);
      var offsetDescriptionLength = offsetMime + mimeLength;
      var descriptionLength = data.getLongAt(offsetDescriptionLength, true);
      var offsetDescription = offsetDescriptionLength + 4;
      var description = data.getStringWithCharsetAt(offsetDescription, descriptionLength, "utf-8").toString();
      var offsetDataLength = offsetDescription + descriptionLength + 16;
      var dataLength = data.getLongAt(offsetDataLength, true);
      var offsetData = offsetDataLength + 4;
      var imageData = data.getBytesAt(offsetData, dataLength, true);
      picture = {
        format: mime,
        type: IMAGE_TYPES[imageType],
        description: description,
        data: imageData
      };
    }
    var tag = {
      type: "FLAC",
      version: "1",
      tags: {
        "title": title,
        "artist": artist,
        "album": album,
        "track": track,
        "genre": genre,
        "picture": picture
      }
    };
    return tag;
  };
  return FLACTagReader;
}(MediaTagReader);

var fs = /*#__PURE__*/require('fs');
var NodeFileReader = /*#__PURE__*/function (_MediaFileReader) {
  _inheritsLoose(NodeFileReader, _MediaFileReader);
  function NodeFileReader(path) {
    var _this;
    _this = _MediaFileReader.call(this) || this;
    _this._path = void 0;
    _this._fileData = void 0;
    _this._path = path;
    _this._fileData = new ChunkedFileData();
    _this._isInitialized = true;
    return _this;
  }
  NodeFileReader.canReadFile = function canReadFile(file) {
    return typeof file === 'string' && !/^[a-z]+:\/\//i.test(file);
  };
  var _proto = NodeFileReader.prototype;
  _proto.init = function init(callbacks) {
    var self = this;
    fs.stat(self._path, function (err, stats) {
      if (err) {
        if (callbacks.onError) {
          callbacks.onError({
            "type": "fs",
            "info": err
          });
        }
      } else {
        self._size = stats.size;
        callbacks.onSuccess();
      }
    });
  };
  _proto.loadRange = function loadRange(range, callbacks) {
    var fd = -1;
    var fileData = this._fileData;
    var length = range[1] - range[0] + 1;
    var onSuccess = callbacks.onSuccess;
    var onError = callbacks.onError || function (object) {};
    if (fileData.hasDataRange(range[0], range[1])) {
      process.nextTick(onSuccess);
      return;
    }
    var readData = function readData(err, _fd) {
      if (err) {
        onError({
          "type": "fs",
          "info": err
        });
        return;
      }
      fd = _fd;
      var buffer = Buffer.alloc(length);
      fs.read(_fd, buffer, 0, length, range[0], processData);
    };
    var processData = function processData(err, bytesRead, buffer) {
      fs.close(fd, function (err) {
        if (err) {
          console.error(err);
        }
      });
      if (err) {
        onError({
          "type": "fs",
          "info": err
        });
        return;
      }
      storeBuffer(buffer);
      onSuccess();
    };
    var storeBuffer = function storeBuffer(buffer) {
      var data = Array.prototype.slice.call(buffer, 0, length);
      fileData.addData(range[0], data);
    };
    fs.open(this._path, "r", undefined, readData);
  };
  _proto.getByteAt = function getByteAt(offset) {
    return this._fileData.getByteAt(offset);
  };
  return NodeFileReader;
}(MediaFileReader);

var mediaFileReaders = [];
var mediaTagReaders = [];
function read(location, callbacks) {
  new Reader(location).read(callbacks);
}
function isRangeValid(range, fileSize) {
  var invalidPositiveRange = range.offset >= 0 && range.offset + range.length >= fileSize;
  var invalidNegativeRange = range.offset < 0 && (-range.offset > fileSize || range.offset + range.length > 0);
  return !(invalidPositiveRange || invalidNegativeRange);
}
var Reader = /*#__PURE__*/function () {
  function Reader(file) {
    this._file = void 0;
    this._tagsToRead = void 0;
    this._fileReader = void 0;
    this._tagReader = void 0;
    this._file = file;
  }
  var _proto = Reader.prototype;
  _proto.setTagsToRead = function setTagsToRead(tagsToRead) {
    this._tagsToRead = tagsToRead;
    return this;
  };
  _proto.setFileReader = function setFileReader(fileReader) {
    this._fileReader = fileReader;
    return this;
  };
  _proto.setTagReader = function setTagReader(tagReader) {
    this._tagReader = tagReader;
    return this;
  };
  _proto.read = function read(callbacks) {
    var FileReader = this._getFileReader();
    var fileReader = new FileReader(this._file);
    var self = this;
    fileReader.init({
      onSuccess: function onSuccess() {
        self._getTagReader(fileReader, {
          onSuccess: function onSuccess(TagReader) {
            new TagReader(fileReader).setTagsToRead(self._tagsToRead).read(callbacks);
          },
          onError: callbacks.onError
        });
      },
      onError: callbacks.onError
    });
  };
  _proto._getFileReader = function _getFileReader() {
    if (this._fileReader) {
      return this._fileReader;
    } else {
      return this._findFileReader();
    }
  };
  _proto._findFileReader = function _findFileReader() {
    for (var i = 0; i < mediaFileReaders.length; i++) {
      if (mediaFileReaders[i].canReadFile(this._file)) {
        return mediaFileReaders[i];
      }
    }
    throw new Error("No suitable file reader found for " + this._file);
  };
  _proto._getTagReader = function _getTagReader(fileReader, callbacks) {
    if (this._tagReader) {
      var tagReader = this._tagReader;
      setTimeout(function () {
        callbacks.onSuccess(tagReader);
      }, 1);
    } else {
      this._findTagReader(fileReader, callbacks);
    }
  };
  _proto._findTagReader = function _findTagReader(fileReader, callbacks) {
    var tagReadersAtFileStart = [];
    var tagReadersAtFileEnd = [];
    var fileSize = fileReader.getSize();
    for (var i = 0; i < mediaTagReaders.length; i++) {
      var range = mediaTagReaders[i].getTagIdentifierByteRange();
      if (!isRangeValid(range, fileSize)) {
        continue;
      }
      if (range.offset >= 0 && range.offset < fileSize / 2 || range.offset < 0 && range.offset < -fileSize / 2) {
        tagReadersAtFileStart.push(mediaTagReaders[i]);
      } else {
        tagReadersAtFileEnd.push(mediaTagReaders[i]);
      }
    }
    var tagsLoaded = false;
    var loadTagIdentifiersCallbacks = {
      onSuccess: function onSuccess() {
        if (!tagsLoaded) {
          tagsLoaded = true;
          return;
        }
        for (var i = 0; i < mediaTagReaders.length; i++) {
          var range = mediaTagReaders[i].getTagIdentifierByteRange();
          if (!isRangeValid(range, fileSize)) {
            continue;
          }
          try {
            var tagIndentifier = fileReader.getBytesAt(range.offset >= 0 ? range.offset : range.offset + fileSize, range.length);
          } catch (ex) {
            if (callbacks.onError) {
              callbacks.onError({
                type: "fileReader",
                info: ex.message
              });
            }
            return;
          }
          if (mediaTagReaders[i].canReadTagFormat(tagIndentifier)) {
            callbacks.onSuccess(mediaTagReaders[i]);
            return;
          }
        }
        if (callbacks.onError) {
          callbacks.onError({
            type: "tagFormat",
            info: "No suitable tag reader found"
          });
        }
      },
      onError: callbacks.onError
    };
    this._loadTagIdentifierRanges(fileReader, tagReadersAtFileStart, loadTagIdentifiersCallbacks);
    this._loadTagIdentifierRanges(fileReader, tagReadersAtFileEnd, loadTagIdentifiersCallbacks);
  };
  _proto._loadTagIdentifierRanges = function _loadTagIdentifierRanges(fileReader, tagReaders, callbacks) {
    if (tagReaders.length === 0) {
      setTimeout(callbacks.onSuccess, 1);
      return;
    }
    var tagIdentifierRange = [Number.MAX_VALUE, 0];
    var fileSize = fileReader.getSize();
    for (var i = 0; i < tagReaders.length; i++) {
      var range = tagReaders[i].getTagIdentifierByteRange();
      var start = range.offset >= 0 ? range.offset : range.offset + fileSize;
      var end = start + range.length - 1;
      tagIdentifierRange[0] = Math.min(start, tagIdentifierRange[0]);
      tagIdentifierRange[1] = Math.max(end, tagIdentifierRange[1]);
    }
    fileReader.loadRange(tagIdentifierRange, callbacks);
  };
  return Reader;
}();
var Config = /*#__PURE__*/function () {
  function Config() {}
  Config.addFileReader = function addFileReader(fileReader) {
    mediaFileReaders.push(fileReader);
    return Config;
  };
  Config.addTagReader = function addTagReader(tagReader) {
    mediaTagReaders.push(tagReader);
    return Config;
  };
  Config.removeTagReader = function removeTagReader(tagReader) {
    var tagReaderIx = mediaTagReaders.indexOf(tagReader);
    if (tagReaderIx >= 0) {
      mediaTagReaders.splice(tagReaderIx, 1);
    }
    return Config;
  };
  Config.EXPERIMENTAL_avoidHeadRequests = function EXPERIMENTAL_avoidHeadRequests() {
    XhrFileReader.setConfig({
      avoidHeadRequests: true
    });
  };
  Config.setDisallowedXhrHeaders = function setDisallowedXhrHeaders(disallowedXhrHeaders) {
    XhrFileReader.setConfig({
      disallowedXhrHeaders: disallowedXhrHeaders
    });
  };
  Config.setXhrTimeoutInSec = function setXhrTimeoutInSec(timeoutInSec) {
    XhrFileReader.setConfig({
      timeoutInSec: timeoutInSec
    });
  };
  return Config;
}();
Config.addFileReader(XhrFileReader).addFileReader(BlobFileReader).addFileReader(ArrayFileReader).addTagReader(ID3v2TagReader).addTagReader(ID3v1TagReader).addTagReader(MP4TagReader).addTagReader(FLACTagReader);
if (typeof process !== "undefined" && !process.browser) {
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    throw new Error('ReactNative not supported');
  } else {
    Config.addFileReader(NodeFileReader);
  }
}

exports.Config = Config;
exports.Reader = Reader;
exports.read = read;
//# sourceMappingURL=jsmediatags.cjs.development.js.map
