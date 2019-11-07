const bits = require('../math/bits');

const {UpTo32Bits, UpTo8Bits, logbits} = bits;

let bui8_1 = new UpTo8Bits(15, 4);
console.log('bui8_1', bui8_1.value);


let v = 0 | 0;

v = bui8_1.write_to_ui32(v, 0);

console.log('v', v);


// reading from a longer binary requence number
//  reading from a ui8
//   partial read from a ui8
//   partial read and realignment

// .shift(positive or negative int)

let n = parseInt('11100011', 2);
logbits('n', n);

let n2 = parseInt('00101100', 2);
logbits('n2', n2);

let bui8 = UpTo8Bits.from_byte_split(n, n2, 6, 6);
//let bui8 = new UpTo8Bits(n);
console.log('bui8.value', bui8.value);
console.log('bui8.num_bits', bui8.num_bits);

// reading a number (up to 16 or 32 bits) from a ui8a
//  reading the UpTo32Bits object
//   Then that will be a value referenced in the Huffman map / tree.

// Joining together 2 upto8 bit patterns.
//  .concat

// .concat_to_this
// .self_concat

// concat(ut8, ut8)
// bin_concat bconcat
// concat(ut32, ut8)






