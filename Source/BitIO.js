/*
 * 2012/01/03- (c) yoya@awm.jp
 */

var BitIO = function() {
	this.data = '';
	this.byte_offset = 0;
	this.bit_offset = 0;
	this.input = function(data) {
		this.data = data;
	}
	this.byteAlign = function() {
		if (this.bit_offset) {
			this.byte_offset += ((this.bit_offset + 7) / 8) | 0;
			this.bit_offset = 0;
		}
	}
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
	}

	/*
	 * get function
	 */
	this.getData = function(n) {
		this.byteAlign();
		var bo = this.byte_offset;
		var ret = this.data.substr(bo, n);
		this.byte_offset = bo + n;
		return ret;
	}
	this.getDataUntil = function(delim) {
		this.byteAlign();
		var bo = this.byte_offset;
		var delim_offset;
		var n;
		if ((delim === null) || (delim === false)) {
			delim_offset = -1;
		} else {
			delim_offset = this.data.indexOf(delim, bo);
		}
		if (delim_offset === -1) {
			n = this.data.length - bo;
		} else {
			n = delim_offset - bo;
		}
		var ret = this.data.substr(bo, n);
		this.byte_offset = bo + n;
		if ((delim_offset !== -1) && (delim.length > 0)) {
			this.byte_offset += delim.length;
		}
		return ret;
	}
	this.getUI8 = function() {
		this.byteAlign();
		return this.data.charCodeAt(this.byte_offset++) & 0xff;
	}
	this.getUI16LE = function() {
		this.byteAlign();
		return (this.data.charCodeAt(this.byte_offset++) & 0xff | (this.data
				.charCodeAt(this.byte_offset++) & 0xff) << 8);
	}
	this.getUI32LE = function() {
		this.byteAlign();
		return (this.data.charCodeAt(this.byte_offset++) & 0xff | (this.data
				.charCodeAt(this.byte_offset++) & 0xff | (this.data
				.charCodeAt(this.byte_offset++) & 0xff | (this.data
				.charCodeAt(this.byte_offset++) & 0xff) << 8) << 8) << 8);
	}
	this.getUI16BE = function() {
		this.byteAlign();
		return (((this.data.charCodeAt(this.byte_offset++) & 0xff) << 8) | (this.data
				.charCodeAt(this.byte_offset++) & 0xff));
	}

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
		var value = 0;		for (var i = 0; i < n; i++) {
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
	}	this.getVUI30 = function() {		this.byteAlign();
		var tValue = 0,
			tByte;
		for (var i = 0; i < 6; i++) {
			tByte = this.data.charCodeAt(this.byte_offset++) & 0xff;
			tValue |= (tByte & 0x7f) << i;
			if (!(tByte >>> 7)) return tValue;
		}
		return tValue;
	}
	this.getVUI32 = function() {
		this.byteAlign();
		var tValue = 0,
			tByte;
		for (var i = 0; i < 6; i++) {
			tByte = this.data.charCodeAt(this.byte_offset++) & 0xff;
			tValue |= (tByte & 0x7f) << i;
			if (!(tByte >>> 7)) return tValue;
		}
		return tValue;
	}
	this.getVSI32 = function() {
		this.byteAlign();
		var tValue = 0,
			tByte;
		for (var i = 0; i < 6; i++) {
			tByte = this.data.charCodeAt(this.byte_offset++) & 0xff;
			tValue |= (tByte & 0x7f) << i;
			if (!(tByte >>> 7)) return tValue;
		}		var msb = tValue & (0x1 << 31);
		if (msb) {
			var bitmask = (2 * msb) - 1;
			return -(tValue ^ bitmask) - 1;
		}
		return tValue;
	}

	this.getDouble = function() {
        var isNeg = (this.data.charCodeAt(this.byte_offset + 3) & 0x80) >>> 7,
            exp = (((this.data.charCodeAt(this.byte_offset + 3) & 0x7F) << 1) + ((this.data.charCodeAt(this.byte_offset + 2) & 0x80) >>> 7)) - 127,
            mantissa = ((this.data.charCodeAt(this.byte_offset + 2) & 0x7F) * 65536) + ((this.data.charCodeAt(this.byte_offset + 1) & 0xFF) * 256) + (this.data.charCodeAt(this.byte_offset) & 0xFF);
        this.byte_offset += 4;
        if (exp === -127) {
            if (mantissa === 0) {
                return 0;
            }
            return (isNeg ? -1 : 1) * Math.pow(2, exp - 22) * mantissa;
        } else if (exp === (255 - 127)) {
            if (mantissa) {
                return Number.NaN;
            }
            if (isNeg) {
                return Number.NEGATIVE_INFINITY;
            }
            return Number.POSITIVE_INFINITY;
        }
        return (isNeg ? -1 : 1) * Math.pow(2, exp - 23) * (0x800000 + mantissa);
    }
	
	/*
	 * seek
	 */
	this.setOffset = function(byte_offset, bit_offset) {
		this.byte_offset = byte_offset;
		this.bit_offset = bit_offset;
	}
	this.getOffset = function() {
		return {
			byte_offset : this.byte_offset,
			bit_offset : this.bit_offset
		};
	}
	this.incrementOffset = function(byte_incr, bit_incr) {
		this.byte_offset += byte_incr;
		this.bit_offset += bit_incr;
		this.byteCarry();
	}
}