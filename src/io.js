/**
 * @preserve
 * 2012/01/03- (c) yoya@awm.jp
 */

use('globals');

(function(global) {
  var BitIO = function() {
    this.data = '';
    this.byte_offset = 0;
    this.bit_offset = 0;
    this.input = function(data) {
      this.data = data;
    };
    this.byteAlign = function() {
      if (this.bit_offset) {
        this.byte_offset += ((this.bit_offset + 7) / 8) | 0;
        this.bit_offset = 0;
      }
    };
    this.byteCarry = function() {
      if (this.bit_offset > 7) {
        this.byte_offset += ((this.bit_offset + 7) / 8) | 0;
        this.bit_offset &= 0x07;
      } else {
        while (this.bit_offset < 0) { // XXX
          this.byte_offset--;
          this.bit_offset += 8;
        }
      }
    };

    this.getData = function(n) {
      this.byteAlign();
      var bo = this.byte_offset;
      var ret = this.data.substr(bo, n);
      this.byte_offset = bo + n;
      return ret;
    };

    this.getUI8 = function() {
      this.byteAlign();
      return this.data.charCodeAt(this.byte_offset++) & 0xff;
    };

    this.getUI16LE = function() {
      this.byteAlign();
      return this.data.charCodeAt(this.byte_offset++) & 0xff |
        (this.data.charCodeAt(this.byte_offset++) & 0xff) << 8;
    };

    this.getUI32LE = function() {
      this.byteAlign();
      return this.data.charCodeAt(this.byte_offset++) & 0xff |
        (this.data.charCodeAt(this.byte_offset++) & 0xff |
          (this.data.charCodeAt(this.byte_offset++) & 0xff |
            (this.data.charCodeAt(this.byte_offset++) & 0xff) << 8
          ) << 8
        ) << 8;
    };

    this.getUI16BE = function() {
      this.byteAlign();
      return ((this.data.charCodeAt(this.byte_offset++) & 0xff) << 8) |
        (this.data.charCodeAt(this.byte_offset++) & 0xff);
    };

    this.getUIBit = function() {
      this.byteCarry();
      return (this.data.charCodeAt(this.byte_offset) >> (7 - this.bit_offset++)) & 0x1;
    }

    this.getUIBitsBE = function(n) {
      var value = 0;
      while (n--) {
        value <<= 1;
        value |= this.getUIBit();
      }
      return value;
    }

    this.getSIBitsBE = function(n) {
      var value = this.getUIBitsBE(n);
      var msb = value & (0x1 << (n - 1));
      if (msb) {
        var bitmask = (2 * msb) - 1;
        return -(value ^ bitmask) - 1;
      }
      return value;
    }

    this.getUIBitsLE = function(n) {
      var value = 0;
      for ( var i = 0; i < n; i++) {
        value |= (this.getUIBit() << i);
      }
      return value;
    }

    this.getSIBitsLE = function(n) {
      var value = this.getUIBitsLE(n);
      var msb = value & (0x1 << (n - 1));
      if (msb) {
        var bitmask = (2 * msb) - 1;
        return -(value ^ bitmask) - 1;
      }
      return value;
    }

    this.getString = function() {
      var tLength = this.getVUI30(),
      tReturn = this.data.substr(this.byte_offset, tLength);
      this.byte_offset += tLength;
      return tReturn;
    }

    this.getVUI30 = function() {
      this.byteAlign();
      var tValue = 0, tByte;
      for ( var i = 0; i < 6; i++) {
        tByte = this.data.charCodeAt(this.byte_offset++) & 0xff;
        tValue |= (tByte & 0x7f) << i;
        if (!(tByte >>> 7))
          return tValue;
      }
      return tValue;
    }

    this.getVUI32 = function() {
      this.byteAlign();
      var tValue = 0, tByte;
      for ( var i = 0; i < 6; i++) {
        tByte = this.data.charCodeAt(this.byte_offset++) & 0xff;
        tValue |= (tByte & 0x7f) << i;
        if (!(tByte >>> 7))
          return tValue;
      }
      return tValue;
    }

    this.getVSI32 = function() {
      this.byteAlign();
      var tValue = 0, tByte;
      for (var i = 0; i < 6; i++) {
        tByte = this.data.charCodeAt(this.byte_offset++) & 0xff;
        tValue |= (tByte & 0x7f) << i;
        if (!(tByte >>> 7))
          return tValue;
      }
      var msb = tValue & (0x1 << 31);
      if (msb) {
        var bitmask = (2 * msb) - 1;
        return -(tValue ^ bitmask) - 1;
      }
      return tValue;
    }

    this.getDouble = function() {
      this.byteAlign();
      var e,
          m,
          bBE = false,
          mLen = 52,
          nBytes = 8,
          eLen = nBytes * 8 - mLen - 1,
          eMax = (1 << eLen) - 1,
          eBias = eMax >> 1,
          nBits = -7,
          i = bBE ? 0 : (nBytes - 1),
          d = bBE ? 1 : -1,
          s = this.data.charCodeAt(this.byte_offset + 7);

      i += d;

      e = s & ((1 << (-nBits)) - 1);
      s >>= (-nBits);
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + this.data.charCodeAt(this.byte_offset + i), i += d, nBits -= 8) {}

      m = e & ((1 << (-nBits)) - 1);
      e >>= (-nBits);
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + this.data.charCodeAt(this.byte_offset + i), i += d, nBits -= 8) {}

      this.byte_offset += nBytes;

      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity);
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };

    this.getArray = function(pFunction, pLength) {
      var tReturn = new Array(pLength);
      for (var i = 0; i < pLength; i++) {
        tReturn[i] = pFunction.call(this);
      }
      return tReturn;
    };

    this.getArrays = function(pFunctions, pLength) {
      var tReturn = new Array(pLength),
      tFunctionsLength = pFunctions.length;
      for (var i = 0; i < pLength; i++) {
        tReturn[i] = new Array(tFunctionsLength);
        for (var j = 0; j < tFunctionsLength; j++) {
          tReturn[i][j] = pFunctions[j].call(this);
        }
      }
      return tReturn;
    };

    this.setOffset = function(byte_offset, bit_offset) {
      this.byte_offset = byte_offset;
      this.bit_offset = bit_offset;
    };

    this.getOffset = function() {
      return {
        byte_offset : this.byte_offset,
        bit_offset : this.bit_offset
      };
    };

    this.incrementOffset = function(byte_incr, bit_incr) {
      this.byte_offset += byte_incr;
      this.bit_offset += bit_incr;
      this.byteCarry();
    };
  }

  global['AlphabetJS']['IO'] = BitIO;

}(this));
