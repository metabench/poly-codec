// Some more general purpose / lower level functions that will be useful for the implementation of Huffman encoding and some other functionality in the future.

const {tof, def} = require('lang-mini');

var float64ToInt64Binary = (function () {
    // create union
    var flt64 = new Float64Array(1)
    var uint16 = new Uint16Array(flt64.buffer)
    // 2**53-1
    var MAX_SAFE = 9007199254740991
    // 2**31
    var MAX_INT32 = 2147483648
  
    function uint16ToBinary() {
      var bin64 = ''
  
      // generate padded binary string a word at a time
      for (var word = 0; word < 4; word++) {
        bin64 = uint16[word].toString(2).padStart(16, 0) + bin64
      }
  
      return bin64;
    }

    return function float64ToInt64Binary(number) {
        // NaN would pass through Math.abs(number) > MAX_SAFE
        if (!(Math.abs(number) <= MAX_SAFE)) {
          throw new RangeError('Absolute value must be less than 2**53')
        }
    
        var sign = number < 0 ? 1 : 0
    
        // shortcut using other answer for sufficiently small range
        if (Math.abs(number) <= MAX_INT32) {
          return (number >>> 0).toString(2).padStart(64, sign)
        }
    
        // little endian byte ordering
        flt64[0] = number
    
        // subtract bias from exponent bits
        var exponent = ((uint16[3] & 0x7FF0) >> 4) - 1022
    
        // encode implicit leading bit of mantissa
        uint16[3] |= 0x10
        // clear exponent and sign bit
        uint16[3] &= 0x1F
    
        // check sign bit
        if (sign === 1) {
          // apply two's complement
          uint16[0] ^= 0xFFFF
          uint16[1] ^= 0xFFFF
          uint16[2] ^= 0xFFFF
          uint16[3] ^= 0xFFFF
          // propagate carry bit
          for (var word = 0; word < 3 && uint16[word] === 0xFFFF; word++) {
            // apply integer overflow
            uint16[word] = 0
          }
    
          // complete increment
          uint16[word]++
        }
    
        // only keep integer part of mantissa
        var bin64 = uint16ToBinary().substr(11, Math.max(exponent, 0))
        // sign-extend binary string
        return bin64.padStart(64, sign)
    }
})();

var float64ToInt8Binary = n => float64ToInt64Binary(n).substring(56, 64);
var float64ToInt16Binary = n => float64ToInt64Binary(n).substring(48, 64);
var float64ToInt32Binary = n => float64ToInt64Binary(n).substring(32, 64);



// Tests / conventions on using 32 bit ints because they are what the bitwise operators use in JS?

class UpTo32Bits {
    constructor(number, num_bits) {
        // [number, number of bits]

        let num = number | 0;
        // then zero out the bits that don't fit within the number of bits.
        const max_num_bits = 32;
        let bits_under_max = max_num_bits - num_bits;
        num = (num << bits_under_max) >> bits_under_max;

        // get it left-aligned...
        // write it into a different alignment...?

        Object.defineProperty(this, 'value', {
            enumerable: true,
            configurable: false,
            //writable: false,
            //value: 'static'
            get: () => {
                return num;
            }
        });

        Object.defineProperty(this, 'num_bits', {
            enumerable: true,
            configurable: false,
            //writable: false,
            //value: 'static'
            get: () => {
                return num_bits;
            }
        });

        // Changing the number of bits?
        this.shift_left = n => {
            num = num << n;
            num_bits += n;
            return this;
        }
        this.shift_right = n => {
            num = num >> n;
            num_bits -= n;
            return this;
        }
        this.or = item => {
            if (item instanceof UpTo8Bits) {
                num = num | item.value;
            } else if (item instanceof UpTo8Bits) {
                num = num | item.value;
            } else {
                // number?
                num = num | item;

            }
            return this;
        }
    }
    

}

// reading values from a subsection of it, writing the values to another UpTo8Bits

// Reading a range from a number into this...

// read_bit_start offset?
//  So when reading a number, can read that number / binary sequence from within anothe number


class UpTo8Bits {
    // and a read_start_bit value?
    //  and specify the input num_bits?
    //  be able to use an OO binary helper as input?

    constructor(number, num_bits) {
        // [number, number of bits]

        let num = number & 255;
        // then zero out the bits that don't fit within the number of bits.
        const max_num_bits = 8;

        // Assuming we are reading from the right.
        let bits_under_max = max_num_bits - num_bits;
        num = (num << bits_under_max) >> bits_under_max;


        Object.defineProperty(this, 'value', {
            enumerable: true,
            configurable: false,
            //writable: false,
            //value: 'static'
            get: () => {
                return num;
            }
        });

        // num_bits

        Object.defineProperty(this, 'num_bits', {
            enumerable: true,
            configurable: false,
            //writable: false,
            //value: 'static'
            get: () => {
                return num_bits;
            }
        });

    }

    // concat to upto32
    //  concats it on the right.

    concat_to_upto32(upto32) {
        if (upto32.num_bits + this.num_bits <= 32) {
            upto32.shift_left(this.num_bits).or(this);
        } else {
            console.trace();
            throw 'Out of bounds';
        }
    }

    write_to_ui32(ui32, start_bit) {
        // calculate the number of positions to shift it to the left before writing.

        //console.log('ui32', ui32);
        //logbits('t', t);

        /*
        const old = () => {
            const bits_size_diff = 32 - this.num_bits;
            const offset_l = bits_size_diff - start_bit;
            //let t = ui32;
            //logbits('t', t);

            let v = this.value << offset_l;
            //logbits('v', v);
            return v;
        }
        */
        return ui32 | (this.value << ((32 - this.num_bits) - start_bit));


    }
    // write to up to 32 bits space...
}
UpTo8Bits.from_byte_split = (ui8_1, ui8_2, bits_start, bits_length) => {
    console.log('bits_start, bits_length', [bits_start, bits_length]);

    if (bits_length > 8) {
        console.trace();
        throw 'bits_length must be an integer between 1 and 8'
    }

    const ui16 = (ui8_1 << 8) | ui8_2;
    console.log('ui16', ui16);
    logbits('ui16', ui16);

    const chosen_part_ui8 = (ui16 << (bits_start + bits_length)) >> (bits_length + bits_start + (16 - bits_length - bits_start)) & (Math.pow(2, bits_length) - 1);

    //const chosen_part_ui16 = (ui16 << (bits_start)) >> (bits_start + (16 - bits_length));
    //const chosen_part_ui8 = (ui16 << (16 + bits_start)) >> (bits_start + (16 - bits_length));
    //console.log('chosen_part_ui16', chosen_part_ui16);
    logbits('chosen_part_ui8', chosen_part_ui8);
    return new UpTo8Bits(chosen_part_ui8, bits_length);
    //console.trace();
    //throw 'stop';

    //const chosen_part_ui8 = 

    //return new UpTo8Bits(chosen_part_ui16, bits_length);;

    /*
    const ui16 = ((ui8_1 * 256 - 1) & ui8_2) & (256 * 256 - 1);
    const n_bi_start = bits_start;
    //const n_bi_end = n_bi_start + bits_length;
    const res = (ui16 << n_bi_start) >> (32 - (bits_length + n_bi_start));
    console.log('[bits_start, bits_length]', [bits_start, bits_length]);
    console.log('res', res);
    return new UpTo8Bits(res, bits_length);
    */
}

UpTo8Bits.from_byte = (ui8, bits_start, bits_length) => {
    if (bits_length > 8) {
        console.trace();
        throw 'bits_length must be an integer between 1 and 8'
    }

    const chosen_part_ui8 = ((ui8 << bits_start) >> bits_start) >> (8 - bits_length);
    return new UpTo8Bits(chosen_part_ui8, bits_length);

}

UpTo8Bits.from_ui8a = (uia8, bits_start, bits_length) => {
    if (bits_length > 8) {
        console.trace();
        throw 'bits_length must be an integer between 1 and 8'
    }
    const luia8 = ui8a.length;
    const bluia8 = ui8a.length * 8;
    const bwb_start = bits_start % 8;
    const by_start = (bits_start - bwb_start) / 8;
    const bits_end = bits_start + bits_length;
    const bwb_end = bits_end % 8;
    const by_end = (bits_end - bwb_end) / 8;
    const byte_range_length = by_end - by_start;

    if (byte_range_length === 1) {
        return UpTo8Bits.from_byte(uia8[by_start], bwb_start, bits_length);
    } else if (byte_range_length === 2) {
        return UpTo8Bits.from_byte_split(uia8[by_start], uia8[by_start], bwb_start, bits_length);
    } else {

        // read from 1st byte
        //  how many bits from 1st byte?
        // read from middle bytes
        //  all 8 bits
        // read from last byte
        //  how many bits?

        // write all of these (partial?) bytes into their relevant positions in the outputs.
        //  

        // 
        console.trace();
        throw 'stop';
    }

}

// from_ui8a

// parseInt('11100011', 2);

// Will be able to access and modify individual bits, as well as ranges of bits, within typed arrays.
//  Will use JS numbers to access 4 bytes at once.
//  Seems like we can't use 64 (right now) because we can only use the bitwise functions / operators using 32 bit ints.




// write_upto32bits_from_number(ui8a, bii, num, num_bits)
//  may be a bit of a tricky function to write.

// Set the individual bytes using masks to extract the bits from the input...?
//  Would make sense to go through the input byte by byte.

// Possibly access / use the underlying arraybuffer?
//  And get a new view on it at say 32bit integers?

// stick with the ui8a for the moment.


// read a word / ui32 from a position...?
//  can start with some more obvious / lower level functions.


// byte mask creation functions...
//  reading a partial byte will use a byte mask

// Consideration about where and when this is reading from the left in a larger binary stream.
//  The numbers themselves are read from the right...?

// Naming conventions concerning Little Endian Bytes?


// But at some stage we will need to process in the JS way.
// Want to be able to flexibly and quickly do manipulations of bits in a buffer.

const byte_bit_selection_mask = (bii_within_byte_start, bii_within_byte_end) => {
    // more param checking?

    // Could use powers of 2...
    let res = 0;
    //console.log('[bii_within_byte_start, bii_within_byte_end]', [bii_within_byte_start, bii_within_byte_end]);

    for (let p = bii_within_byte_start; p < bii_within_byte_end; p++) {

        //res += Math.pow(2, p);
        res += Math.pow(2, 7 - p);
    }
    //console.log('res', res);
    //console.log('float64ToInt8Binary(res)', float64ToInt8Binary(res));

    return res;
}


// Reading and writing 16 / 32 / upto16 / upto32 bit byte sequences


// Reading and writing up to 32 bits.
//  Be able to specify the alignment / alignment difference in bits?

// Reading and writing up to 16 bits...
//  Would make sense for reading and writing
//   (and copying?) various Huffman table values.

// And those 16 bits would be right-aligned in a JS number.


// Assuming binary streams are always aligned on the left?

// left_aligned_upto32bits?

// masks of up to 32 bits?
// writing right-aligned numbers, or treating those numbers just as arrangements of bits.

// byte_all_1s = 255

const byte_all_1s = 255 | 0;
const byte_all_0s = 0 | 0;

// function to get a sequence of 0s or sequence of 1s.
//  assuming 0s outside of what is specified

// constants of various powers?
//  put those powers into an intitial typed array?

//const byte4_all_1s = Number.MAX_SAFE_INTEGER | 0;
const byte4_all_1s = Math.pow(256, 4) - 1 | 0;
const byte4_all_0s = 0 | 0;

//console.log('Math.MAX_INT32', Math.MAX_INT32);

//console.log('byte4_all_1s', byte4_all_1s);
//console.log('float64ToInt32Binary(byte4_all_1s))', float64ToInt32Binary(byte4_all_1s));
//console.log('float64ToInt64Binary(byte4_all_1s))', float64ToInt64Binary(byte4_all_1s));


// left aligned up to 32 bits as well....

// and read it so that it's aligned to the right?
//  seems like the standard representation of some binary.

const read_aligned_left_upto16_bits_from_ui8a = (ui8a, bii_read_start, bit_length) => {
    // read up to 3 individual bytes...

    const bii_within_byte_start = bii_read_start % 8;
    const byi_start = (bii_read_start - bii_within_byte_start) / 8;
    const bii_read_end = bii_read_start + bit_length;
    const bii_within_byte_end = bii_read_end % 8;
    const byi_end = (bii_read_end - bii_within_byte_end) / 8;

}


const read_upto16_bits_from_ui8a = (ta, bit_pos, bit_length) => {
    // may need to read from 3 bytes total (subarray)

    // read it and align it to the right?

    // maybe reading it aligned to the left makes sense, but we need to be aware that the numbers work in a BE type system.

    const bii_within_byte = bit_pos % 8;
    const byi = (bit_pos - bii_within_byte) / 8;

    // create the masks for the end sections...?
    //  Will also need to shift some bits in the appropriate direction.

    if (bii_within_byte === 0) {

    } else {
        // Read three bytes into a typed array, then can shift all the bytes?

        // Read a 32bit 4byte number from the ta, then shift and mask as apprpriate...?

    }

    // worth putting together the mask.
    //  can use a 32 bit mask...
    //  3 8 bit masks

    // will return a single number.


}



// mask, and, shift
//  may be generally useful for reading




// Could be used for writing arbitrary number of bits to a ui8 array.

// copy mask and shift
//  left or right


const copy_ta_mask_shift_left = (ta, num_bits) => {
    const bbsm =  byte_bit_selection_mask(8 - num_bits, 8);
    return self_left_shift(copy_ta_get_byte_masked(ta, bbsm), num_bits);
}

const copy_ta_mask_shift_right = (ta, num_bits) => {
    const bbsm =  byte_bit_selection_mask(0, num_bits);
    return self_right_shift(copy_ta_get_byte_masked(ta, bbsm), num_bits);
}

// making a new result array... new object version.
const copy_ta_get_byte_masked = (ta, byte_mask) => {
    const byi_start = 0;
    const byi_end = ta.length;
    let byi = byi_start;
    const res = new ta.constructor(ta.length);
    while (byi < byi_end) {
        res[byi] = ta[byi] & byte_mask;
        byi++;
    }
    return res;
}



/*
const self_byte_mask = (ta, byte_mask) => {

}
*/

const self_left_shift = (ta, num_bits) => {
    const byi_start = 0;
    const byi_end = ui8a.length;
    let byi = byi_start;
    while (byi < byi_end) {
        ta[byi] = ta[byi] << num_bits;
        byi++;
    }
    return ta;
}
const self_right_shift = (ta, num_bits) => {
    const byi_start = 0;
    const byi_end = ui8a.length;
    let byi = byi_start;
    while (byi < byi_end) {
        ta[byi] = ta[byi] >> num_bits;
        byi++;
    }
    return ta;
}

// write a partial byte...?
/*
const read_ui16_left_aligned_within_ui32 = (ui8a, byi_read_start) => {

}
*/


const read_partial_byte_from_ui8a = (ui8a, byi, bii_within_byte_start, bii_within_byte_end) => {
    if (bii_within_byte_start < 0 || bii_within_byte_start > 8 || bii_within_byte_end < 0 || bii_within_byte_end > 8) {
        throw 'Out of bounds'
    } else {

        // Different ordering?
        //  As in the bit index we have given assumes starting on the left.

        const ui8 = ui8a[byi];
        // then create the bit mask.
        const mask1 = byte_bit_selection_mask(bii_within_byte_start, bii_within_byte_end);
        const selected_part_of_byte = ui8 & mask1;
        

        const log = () => {
            console.log('ui8', ui8);
            console.log('float64ToInt8Binary(ui8)', float64ToInt8Binary(ui8));
            console.log('mask1', mask1);
            console.log('float64ToInt8Binary(mask1)', float64ToInt8Binary(mask1));
            console.log('selected_part_of_byte', selected_part_of_byte);
            console.log('float64ToInt8Binary(selected_part_of_byte)', float64ToInt8Binary(selected_part_of_byte));
        }

        // then shift?
        //  maybe do so here?
        //  or can wind up more optimized not to do that?

        return selected_part_of_byte;
    }
}

// Read a byte from the ui8a, but specified with bii position.

const read_bii_byte_from_ui8a = (ui8a, bii) => {
    // Needs to do 2 partial reads...?

    const length = ui8a.length;
    const bit_length = length * 8;

    const bii_read_start = bii;
    const bits_read_length = 8;
    const bii_read_end = bii_read_start + bits_read_length;

    if (bii_read_end > bit_length) {
        throw 'Out of bounds';
    }

    const bii_within_byte = bii % 8;
    console.log('bii_within_byte', bii_within_byte);

    if (bii_within_byte === 0) {
        return ui8a[bii / 8];
    } else {
        const byte_bii = bii - bii_within_byte;
        const byi_start = byte_bii / 8;
        console.log('byi_start', byi_start);

        // bounds checking would make sense.

        const partial_first = read_partial_byte_from_ui8a(ui8a, byi_start, bii_within_byte, 8);
        const partial_second = read_partial_byte_from_ui8a(ui8a, byi_start + 1, 0, 8 - bii_within_byte);

        console.log('partial_first', partial_first);
        console.log('partial_second', partial_second);

        console.log('float64ToInt8Binary(partial_first)', float64ToInt8Binary(partial_first));
        console.log('float64ToInt8Binary(partial_second)', float64ToInt8Binary(partial_second));

        const combined = partial_first | partial_second;
        console.log('combined', combined);
        console.log('float64ToInt8Binary(combined)', float64ToInt8Binary(combined));
        // 

        // then do 2 partial reads...?
    }

}


// split masks...
//  could use two masks to get partial read, combine, then write back.

// Think we basically need to be very careful and certain.
// If the function needs to be different, consider making a different version.


// Want the first half or the second half?
//  Returning an array with them both makes sense...
//   Or a ta 

/*
const shift_split_ui8 = (ui8, bii) => {
    const res = new Uint8Array([ui8 << bii, ui8 >> bii]);
    return res;
}
*/


// shift in the other direction?
//  mask shift?
//  shift back?

const shift_split_ui8 = (ui8, bii) => new Uint8Array([ui8 << bii, ui8 >> bii]);


const shift_split_ui8a_shift_back = (ui8, bii) => {
    const res = shift_split_ui8(ui8, bii);
    res[0] = res[0] >> bii;
    res[1] = res[1] << bii;
    return res;
}


// function to get the byte and the byte after.
//  could use subarray....

const read_2by = (ui8a, byi) => ui8a.subarray(byi, byi + 1);


const log_ui8a_bits = (ui8a) => {
    const l = ui8a.length;
    for (var c = 0; c < l; c++) {
        const binary = float64ToInt8Binary(ui8a[c]);
        console.log('[c, ui8a[c], binary]', [[c, ui8a[c], binary]]);
    }
}


// 
const split_ui8byte_at_bii_noshift = (ui8, bii) => {

    console.log('ui8', ui8);


    const res = new Uint8Array(2);

    // Need 2 byte masks.

    const bm1 = byte_bit_selection_mask(0, bii);
    const bm2 = byte_bit_selection_mask(bii, 8);

    console.log('bm1', bm1);
    console.log('bm2', bm2);

    console.log('float64ToInt8Binary(bm1)', float64ToInt8Binary(bm1));
    console.log('float64ToInt8Binary(bm2)', float64ToInt8Binary(bm2));

    // get the first part...

    res[0] = ui8 & bm1;
    res[1] = ui8 & bm2;

    return res;





}


// Looks like we need to treat the bytes logically as big-endian, in terms of bit positions.



// A more basic implementation that sets all the bits separately...?

// JPEG will need to use binary sequences up to 2 bytes long from the Huffman Table / Tree


// reading 4 different bytes from a UI / I 32?

// 32 bit int values could be one of the faster ways of doing binary processing in JS, using the bitwise operations as well.

// byte masks...?

// write a 32 bit value to a specific position in a typed array...?
//  to a ui8 typed array...
// writing up to 32 bits.
// 

// Functions for reading and writing binary data, length in bits, from other data structures.
//  Getting this working well will enable Huffman Table and JPEG-specific Huffman table.
//  Will work on optimized scanning to compute the HT.


// Bit shifting a whole typed array....








// separating 32 bit into ui8[4]?
//  extracting a single byte from ui8[4]?
//  seems like it could best be done with a mask and and.

const split_ui32_into_ui8a = (ui32) => {
    const m1 = 255;
    const m2 = (m1 << 8);
    const m3 = (m2 << 8);
    const m4 = (m3 << 8);

    const res = [(ui32 & m4) >> 24];

    console.log('split_ui32_into_ui8a res', res);
}




// Maybe got too abstract? Could continue elsewhere?
//  Or it's a useful component to Huffman encoding etc?
const write_bii_byte_to_ui8a = (ui8a, bii, value) => {

    // Its positions etc.

    // Will need to read the existing components.
    // Overwrite a part of each of the existing components.
    //  (use masks, and appropriate bitwise operations)
    console.log('bii', bii);

    const length = ui8a.length;
    const bit_length = length * 8;

    const bii_start = bii;
    const bits_length = 8;
    const bii_end = bii_start + bits_length;

    if (bii_end > bit_length) {
        throw 'Out of bounds';
    }
    const bii_within_byte = bii % 8;
    console.log('bii_within_byte', bii_within_byte);

    if (bii_within_byte === 0) {

        // Check value is just 1 byte?
        ui8a[bii / 8] = value;

        //return ui8a[bii / 8] = value;
    } else {


        const byte_bii = bii - bii_within_byte;
        const byi_start = byte_bii / 8;
        console.log('byi_start', byi_start);
        const byi_end = byi_start + 1;

        let av = shift_split_ui8a_shift_back(value, bii_within_byte);
        console.log('value', value);
        console.log('av', av);

        const ml = byte_bit_selection_mask(bii_within_byte, 8);
        const mr = byte_bit_selection_mask(0, bii_within_byte);

        console.log('float64ToInt8Binary(ml)', float64ToInt8Binary(ml));
        console.log('float64ToInt8Binary(mr)', float64ToInt8Binary(mr));

        ui8a[byi_start] = (ui8a[byi_start] & mr) | (av[0] & ml);
        //const m2 = byte_bit_selection_mask(4, 8);
        //b1 = b1 & m1;
        //b1 = b1 | av[1];
        //console.log('bii_within_byte', bii_within_byte);
        //console.log('byte_bit_selection_mask(bii_within_byte, 8)', ml);
        ui8a[byi_end] = (ui8a[byi_end] & ml) | (av[1] & mr);

        // Read partial of byte 1 and byte 2...
        //  Or can we do some kind of direct write?
        //  Not so sure what steps are needed here.

        // Split the value byte somehow?

        // ie at pos 3
        //  extract the first 5 from that byte

        // Or no need for split - write the bits to each of the bytes in question.
        // could have 7 more code branches....

        // A system to move bits left and right within a full typed array?
        //  Constructing a bit-transposed typed array?
        //  Use this to get a bit sequence aligned on the byte.

        // Other functionality to deal with 32 bit and up to 32 bit values being put into the typed arrays?
        //  Optimizations to move things over to the correct boundaries for typed arrays of int32s?







        /*



        const svalue = split_ui8byte_at_bii_noshift(value, bii_within_byte);
        console.log('svalue', svalue);
        console.log('svalue.map(svalue)', Array.prototype.slice.call(svalue).map(x => float64ToInt8Binary(x)));

        svalue[0] = svalue[0] >> bii_within_byte;
        svalue[1] = svalue[1] << bii_within_byte;
        console.log('svalue', svalue);
        console.log('svalue.map(svalue)', Array.prototype.slice.call(svalue).map(x => float64ToInt8Binary(x)));

        //var floatarr = new Float32Array(12);
        //var sarray =  Array.prototype.slice.call(svalue);
        //console.log('svalue.map(sarray)', sarray.map(x => float64ToInt8Binary(x)));
        console.log('bii_within_byte (write)', bii_within_byte);

        let byte0 = ui8a[byi_start];
        let byte1 = ui8a[byi_start + 1];

        console.log('[byte0, byte1]', [byte0, byte1]);

        // Then get the masks for the remaining parts / parts to copy over.

        const b0_preceeding_write_mask = byte_bit_selection_mask(0, bii_within_byte);
        const b1_proceeding_write_mask = byte_bit_selection_mask(bii_within_byte, 8);

        console.log('[b0_preceeding_write_mask, b1_proceeding_write_mask]', [b0_preceeding_write_mask, b1_proceeding_write_mask]);

        byte0 = (byte0 & b0_preceeding_write_mask) | svalue[0];
        byte1 = (byte1 & b1_proceeding_write_mask) | svalue[1];

        console.log('[byte0, byte1]', [byte0, byte1]);

        ui8a[byi_start] = byte0;
        ui8a[byi_start + 1] = byte1;

        */



        // write the first part of it at the beginning...?
        //  Do need to shift it over...?
        //   

        // Use 'or' to write the value?
        //  Apply zeros to that part of the bit sequence, then do or...?


        //set_bits_to_0_in_ui8a(bii_start, bii_end)
        // masks and AND...?

    }

}




// Transposing a byte from a ui8 typed array to a bit specified position in another ui8 ta.
//  Would require possibly carrying out a byte split and then writing the value there.
//   Using some kind of and / other boolean logic.

// Reading a bit-position specified value from a ui8a - that will be useful in decoding / reading the Huffman trees.

// Writing 1 byte, but given by the bit index?
//  Which of the bits to overwrite?

// Probably use bit shifts?
//  Multiple masks, copies etc?

// multiple read and write bit calls?
//  could be more optimized than that.






// write n bits at position n...?


// partial write function...

// Want some powerful and general purpose read and write bits functions.
//  May be simpler to do paying more attention to a generalised bit shift quantity?

//  Do a bit shift on the whole input?
//   Then overwrite / copy the central bytes
//    Need to do some kind of mask/merge on the first and last byte.

// Could work on some arithmetic bit shifting.

// Compose a byte out of first n of a byte then the remainder from another byte...?





// Also consider the 32 bit numbers. They will be useful with the bitwise operations.


// Could make versions that make multiple calls of get_bit / set_bit rather than make use of byte or 32bit optimizations.









const read_i32_from_ui8a = (ui8a, bii) => {
    // reads 64 bytes, starting at the given point.

    const read_bits_length = 32;
    const ui8a_length = ui8a.length;
    const ui8a_bits_length = ui8a_length * 8;

    const last_readable_bii = ui8a_bits_length - read_bits_length;

    if (bii < 0 || bii > last_readable_bii) {
        throw 'Out of bounds'
    } else {
        const bii_start = bii;
        const bii_end = bii_start + read_bits_length;

        // How many bits into the first byte does it start?

        // read_partial_byte_from_ui8a(ui8a, byi, bii_within_byte_start, bii_within_byte_end);
        //  Can it construct / look up / access some kind of a bit / byte mask?

    }
}


const read_bit = (ui8a, bii) => {
    // as true / false?
    //  0 or 1 would work better with various parts of math logic.

    // can use masks and bit shifting...?

    // masks and comparison to 0...

    const biwbyi = bii % 8, byi = (bii - biwbyi) / 8;
    console.log('[byi, biwbyi]', [byi, biwbyi]);
    const bit_mask = Math.pow(2, biwbyi);
    console.log('bit_mask', bit_mask);
    const masked = ui8a[byi] & bit_mask;
    console.log('masked', masked);
    return masked === 0 ? 0 : 1;
}

const write_bit = (ui8a, bii, value) => {
    const biwbyi = bii % 8, byi = (bii - biwbyi) / 8;
    console.log('[byi, biwbyi]', [byi, biwbyi]);
    const bit_mask = Math.pow(2, biwbyi);

    if (value === 0 || value === 1) {
        if (value === 0) {
            ui8a[byi] = ui8a[byi] ^ bit_mask;
            // use xor???
        } else {
            ui8a[byi] = ui8a[byi] | bit_mask;
        }
    } else {
        throw 'unexpected value - must be 0 or 1'
    }
    //ui8a[byi] = ui8a[byi] || 
}

const logbits = (str, value) => {

    if (!def(value)) {
        value = str;
        str = undefined;
    }
    

    // Look at the type of the value...?
    // Get the hex code of the value...

    const tval = tof(value);

    if (tval === 'number') {

        // log it in binary form
        //  32 bit
        //  64 bit?

        const b = float64ToInt32Binary(value);
        console.log(str + ' [value, b]', [value, b]);



    } else {

        if (tval === 'object') {
            if (def(value.value)) {
                const b = float64ToInt32Binary(value.value);
                console.log(str + ' [value, b]', [value.value, b]);
            } else {
                console.log('tval', tval);
                console.log('value', value);
                console.trace();
                throw 'NYI';
            }
        } else {
            console.log('tval', tval);
            console.trace();
            throw 'NYI';
        }

        

    }
    

}

const get_upto32bit_ui32_from_ui8a_at_bii = (ui8a, bii, bit_length) => {

    // Align the result to the right?
    //  Makes sense in terms of reading the data.

    // then number of bits...?
    const bii_start = bii;
    const bii_end = bii_start + bit_length;

    //console.log('');
    //console.log('get_upto32bit_ui32_from_ui8a_at_bii [bii_start, bii_end]', [bii_start, bii_end]);

    const bii_start_within_byte = bii % 8;
    const byi_start = (bii - bii_start_within_byte) / 8;

    const bii_end_within_byte = bii_end % 8;
    const byi_end = (bii_end - bii_end_within_byte) / 8;

    //console.log('byi_start', byi_start);
    //console.log('bii_start_within_byte', bii_start_within_byte);
    //console.log('byi_end', byi_end);
    //console.log('bii_end_within_byte', bii_end_within_byte);

    const ui8a_length = ui8a.length;
    const ui8a_bits_length = ui8a_length * 8;

    //console.log('ui8a_length', ui8a_length);
    //console.log('ui8a_bits_length', ui8a_bits_length);

    if (bii_end > ui8a_bits_length) {
        console.trace();
        throw 'Out of bounds';
    } else {

        // Need to arrange these as a JS right-aligned number (ui32).

        // could read the subarray
        //  mask out all of the numbers not within the range.
        //  shift then copy the result values into place.

        let res = 0 | 0; // ui32

        // may be worth looking at the subarray...


        // Extract the value aligned to the left?
        //  Maybe hex codes for numbers make a lot of sense too?
        //  Align it to the right instead, but extract it...

        // Can try with different methods and see what works (best).

        // could call an inner function to extract a specific sequence.

        // read individual byte.
        //  split and merge it into two other bytes?

        // maybe need to do more work on ./bits.js
        


        
        if (bit_length <= 8) {
            if (bii_start_within_byte === 0) {
                // read a single byte.
                res = res | ui8a[byi_start];

                //console.log('1) res', res);
                //console.log('bit_length', bit_length);

                const bits_to_shift_right = 8 - bit_length;
                //console.log('bits_to_shift_right', bits_to_shift_right);
                res = res >> bits_to_shift_right;
                //console.log('2) res', res);


                //console.trace();
                //throw 'stop';
                return res;

            } else {

                //console.log('[byi_start, byi_end]', [byi_start, byi_end]);

                // 
                if (byi_start === byi_end) {
                    res = res | ui8a[byi_start];
                    //console.log('3) res', res);
                    res = res << bii_start_within_byte;
                    res = (res >> bii_start_within_byte) >> (8 - bii_end_within_byte);
                    //console.log('4) res', res);

                    return res;
                } else {

                    if (byi_end - byi_start === 1) {
                        // Spans two bytes..
                        const b0 = ui8a[byi_start] | 0;
                        const b1 = ui8a[byi_start + 1] | 0;

                        //console.log('b0', b0);
                        //console.log('b1', b1);
                        //logbits('b0', b0);
                        //logbits('b1', b1);
                        //console.log('bit_length', bit_length);

                        // and the numbers to shift...?
                        // shift the bits into place...
                        // the length in bits to extract from the first...
                        // the length in bits to extract from the second...

                        // Do this by bit shifting with 0s as replacement rather than using a mask.

                        // Would be better to always work in BE alignment?
                        const b0a = (b0 << bii_start_within_byte) >> bii_start_within_byte;
                        //console.log('b0a', b0a);
                        //logbits('b0a',b0a);

                        const byi_ends_below_8 = 8 - bii_end_within_byte;
                        //console.log('byi_ends_below_8', byi_ends_below_8);
                        //console.log('bii_end_within_byte', bii_end_within_byte);

                        // 00000000 00000000
                        // .......x xx......
                        //        7  2      
                        //          do shift it over to the right. leave it there.


                        //logbits('b1', b1);
                        const b1a = b1 >> byi_ends_below_8;
                        //console.log('b1a', b1a);
                        //logbits('b1a', b1a);

                        const bres = (b0a << bii_end_within_byte) | b1a;
                        //logbits('bres', bres);
                        return bres;

                        //const b1a = (b1 >> byi_ends_below_8) << byi_ends_below_8;
                        //console.log('b1a', b1a);

                        //logbits('b1a', b1a);

                        // shift them into place....

                        // logbits function.
                        //  will log a value with its bits to the console.







                        //res = res | 

                    }
                    console.trace();
                    throw 'stop';
                }



                //console.trace();
                //throw 'stop';
            }

        } else {
            //console.log('bit_length', bit_length);

            // May need to be similar to earlier...
            // go through each of the source bits.
            //  ??? too slow?
            // go through each of the source bytes.
            //  zero out any that are unused, shift them so they align with the result.

            // Calculate where the bits & bit ranges start, and where they end up.

            // shift the last byte first?
            //  probably the same algo as above....

            if (byi_end - byi_start === 1) {


                // Spans two bytes..

                // But where within the results do each of the bits go?
                //const bits_under_16 = 16 - bit_length;

                // Ranges within each of the bytes, where it gets copied to the correct position in the result.

                // result_bit_start_pos
                //  position from the right / from the left?
                //   from the left in this case.

                //const bii_from_left_start = 32 - bit_length;
                //console.log('bii_from_left_start', bii_from_left_start);

                // read the 2 bytes, mask to the particular part to read, 



                //const b0 = ((ui8a[byi_start] | 0) << bii_start_within_byte) >> bii_start_within_byte;
                const b0 = ((ui8a[byi_start] | 0) << bii_start_within_byte) >> bii_start_within_byte;
                //const b0a = ((b0 << bii_start_within_byte) >> bii_start_within_byte) << (8 - bii_start_within_byte);
                //const b0b = b0 >> (8 - bii_start_within_byte);
                // 

                //logbits('b0', b0);
                //logbits('b0a', b0a);
                //logbits('b0b', b0b);

                //logbits('ui8a[byi_start + 1]', ui8a[byi_start + 1]);
                
                const b1 = ((ui8a[byi_start + 1] | 0)) >> (8 - bii_end_within_byte);
                //logbits('b1', b1);

                //let r0 = ((b0 << (15 - bit_length)) | b1);
                let r0 = b0 << (bit_length - 8);
                //logbits('r0', r0);


                //console.trace();
                //throw 'stop';


                /*

                const b0 = ui8a[byi_start] | 0;
                const b1 = ui8a[byi_start + 1] | 0;
                
                const b0a = (b0 << bii_start_within_byte) >> bii_start_within_byte;
                const byi_ends_below_8 = 8 - bii_end_within_byte;
                const b1a = b1 >> byi_ends_below_8;
                const bres = (b0a << bii_end_within_byte) | b1a;

                */


                //logbits('b0', b0);
                //logbits('b1', b1);
                //logbits('b0a', b0a);
                //logbits('b1a', b1a);
                //logbits('bres', bres);


                return r0;
                

            } else {

                // extract binary data from 1st byte...

                // system to store bit length values...
                //  values up to 32 bit...
                //  the number, as well as the number of bits.
                // eg extract 2 bits from 1st byte, starting at 7.
                //  then the next byte, then a single bit from the next one.

                // go over each of the bytes in the bytes we are extracting from.

                // an UpTo32Bits object makes sense here.
                //  Can be extracted from bytes etc.

                let res = new UpTo32Bits(0, 0);
                // first byte...
                console.log('bii_start_within_byte', bii_start_within_byte);
                const b0 = new UpTo8Bits(((ui8a[byi_start] << bii_start_within_byte) & 255) >> bii_start_within_byte, 8 - bii_start_within_byte);
                console.log('b0', b0);
                console.log('b0.num_bits', b0.num_bits);
                logbits('b0', b0);

                b0.concat_to_upto32(res);
                logbits('res', res);
                console.log('res.num_bits', res.num_bits);

                // then concat the complete intervening bits.
                for (let i = byi_start + 1; i < byi_end; i++) {
                    const bi = new UpTo8Bits(ui8a[i], 8);
                    bi.concat_to_upto32(res);
                }
                logbits('res', res);
                console.log('res.num_bits', res.num_bits);

                // then the last bit...
                const blast = new UpTo8Bits(ui8a[byi_end] >> bii_end_within_byte, bii_end_within_byte);
                blast.concat_to_upto32(res);
                logbits('res', res);
                console.log('res.num_bits', res.num_bits);

                return res.value;









                //console.trace();
                //throw 'stop';
            }







            
        }

    }

    
    

}


// read the bits from a JS number....
//  64 bits in each number....
//  Seems not... The operands of all bitwise operators are converted to signed 32-bit integers in two's complement format, except for zero-fill right shift which results in an unsigned 32-bit integer.

// So can only have words that are 4 bytes long?

// Bitwise operations on the typed array values themselves?

module.exports = {
    read_bit: read_bit,
    write_bit: write_bit,
    get_upto32bit_ui32_from_ui8a_at_bii: get_upto32bit_ui32_from_ui8a_at_bii,
    UpTo32Bits: UpTo32Bits,
    UpTo8Bits: UpTo8Bits,
    logbits: logbits
}


if (require.main === module) {

    const test_bits = () => {
        //const l2_ui8a = new Uint8Array([21, 245]);
        const l2_ui8a = new Uint8Array([1, 128]);

        const l4_0 = new Uint8Array(4);

        const single_bits_1 = () => {
            let bii = 0;
            let bi = read_bit(l2_ui8a, bii);
            console.log('bii', bii);
            console.log('bi', bi);

            bii = 1;

            bi = read_bit(l2_ui8a, bii);
            console.log('bii', bii);
            console.log('bi', bi);

            bii = 4;

            bi = read_bit(l2_ui8a, bii);
            console.log('bii', bii);
            console.log('bi', bi);

            console.log('l2_ui8a', l2_ui8a);

            write_bit(l2_ui8a, 0, 0);

            console.log('l2_ui8a', l2_ui8a);

            write_bit(l2_ui8a, 1, 1);
            console.log('l2_ui8a', l2_ui8a);
        }

        //single_bits_1();

        const num_bin_1 = () => {

            const all1 = ~0;
            //const all1 = 0 ^;
            console.log('all1', all1);

            // float64ToInt64Binary

            console.log('float64ToInt64Binary(all1)', float64ToInt64Binary(all1));
            console.log('float64ToInt64Binary(0)', float64ToInt64Binary(0));
            console.log('float64ToInt64Binary(0).length', float64ToInt64Binary(0).length);
            // 64 bit???

            // But the numbers will be converted to 32 bit integers.



        }
        //num_bin_1();

        const partial_bytes = () => {
            // read_partial_byte_from_ui8a

            let partial_read = read_partial_byte_from_ui8a(l2_ui8a, 0, 4, 8);
            console.log('partial_read', partial_read);
            console.log('float64ToInt64Binary(partial_read)', float64ToInt64Binary(partial_read));

        }
        //partial_bytes();

        const bii_read = () => {
            console.log('bii_read\n');

            let res_bii_read = read_bii_byte_from_ui8a(l2_ui8a, 4);
            console.log('res_bii_read', res_bii_read);
            // write_bii_byte_to_ui8a = (uia8, bii, value) 
            //write_bii_byte_to_ui8a(l2_ui8a, 2, 255);
            //console.log('l2_ui8a', l2_ui8a);

        }
        //bii_read();

        const bii_write = () => {

            write_bii_byte_to_ui8a(l4_0, 4, 132);

            console.log('l4_0', l4_0);


        }
        //bii_write();

        const test_misc = () => {
            // 255
            console.log('l4_0', l4_0);
            log_ui8a_bits(l4_0);

            /*

            let av = shift_split_ui8(170, 4);
            // function to get a split couple of masks?



            console.log('av', av);
            log_ui8a_bits(av);

            // then let's rey writing this 255 (11111111) into a position in the array.
            console.log('l4_0', l4_0);
            log_ui8a_bits(l4_0);

            // Read-and-write masked merges?
            // Could shift bits out, then do and merge to put them in place.

            // write_1s(ui8a, bii_start, bii_end)
            // write_0s

            av[0] = av[0] >> 4;
            av[1] = av[1] << 4;

            */

            write_bii_byte_to_ui8a(l4_0, 4, 170);

            // Needs to be fixed....
            write_bii_byte_to_ui8a(l4_0, 17, 255);


            // Test splitting of a ui32 number / i32 number into 4 different bytes.

            // Being able to run the same mask on every item in the ta

            // write_upto32_bits_to_ui8a?

            //  shifting all of the bits left...?
            //  shifting them all right?


            // writing multiple bytes is easy when they are aligned.
            //  seems like a question about realigning a typed array...?
            //   shifting bytes left or right...
            //   maybe adding 1 or 128.

            // Writing 7 bits? 31 bits?
            //  Need to be able to write these from a single numeric value.







            // Ability to write multiple bytes...



            const test_write = () => {

                let av = shift_split_ui8a_shift_back(170, 4);

                console.log('av', av);
                log_ui8a_bits(av);

                //let b0 = l4_0[0];
                //let b1 = l4_0[1];

                //console.log('[b0, b1]', [b0, b1]);

                // mask include the first part of b0.

                //const m1 = byte_bit_selection_mask(0, 4);
                //b0 = b0 & m1;
                //b0 = b0 | av[0];
                l4_0[0] = (l4_0[0] & byte_bit_selection_mask(0, 4)) | av[0];
                //const m2 = byte_bit_selection_mask(4, 8);
                //b1 = b1 & m1;
                //b1 = b1 | av[1];
                l4_0[1] = (l4_0[1] & byte_bit_selection_mask(4, 8)) | av[1];

                //console.log('[b0, b1]', [b0, b1]);

                //l4_0[0] = b0;
                //l4_0[1] = b1;

            }
            //test_write();

            

            console.log('l4_0', l4_0);
            log_ui8a_bits(l4_0);




            // partial reads, then | or merges, then set the value
            //  could do deletion mask, and then | or merge
            //  deletion mask being XOR (yes I think so)

            // delete in place? operations in place? or reassignment / assignment to other variables is quick?

            // Think mapping and correct or usage will be good enough for many situations.
            // Then can write algos that use the 32 bit values.
            // Then when optimizing to SIMD can use wider calculations still.









        }
        test_misc();

        

        




        // Examples using genuine JPEG Huffman Tree data...?





    }
    test_bits();
    



}