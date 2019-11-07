// A JPEG can use multiple Huffman tables / trees.

// A 'bits' module?
//  ta-bits?

// 



// Separate Bit Processing? Bit_Buffer?
// BitArray???
//  with .get and .set?
//  using [n] notation?






// Each node can just be an object. Maybe an array would be ok?

// object.left, object.right

// Could make the tree using only numeric references too.
//  Want fast lookup however that's possible.


// Should be usefully generally for Huffman tree? Optimized for JPEGs?


// And a Table?


// System on a lower level that will enable bit-level reads and writes?

//  Reading and writing bit sequences using bytes...?

// Using masking to show / filter the specific bits from a byte.

// read_bit_from_byte(ta, byi, biiwby)

// read_bit(ui8a, bii)


// const read_binary_as_bytes()


// Should be usable for doing my own compression / encoding.


// Range within an original buffer.
//  Use a subarray?
//  Restricted so that it will only interact with its specified bit range.
//   Other operations to apply that bit range elsewhere?


// Definitely want to create huffman trees from binary data / data to compress.





//Bit_Range_Buffer?

// Will help to avoid OOB errors while still keeping things fast.

/*

&	AND	Sets each bit to 1 if both bits are 1
|	OR	Sets each bit to 1 if one of two bits is 1
^	XOR	Sets each bit to 1 if only one of two bits is 1
~	NOT	Inverts all the bits
<<	Zero fill left shift	Shifts left by pushing zeros in from the right and let the leftmost bits fall off
>>	Signed right shift	Shifts right by pushing copies of the leftmost bit in from the left, and let the rightmost bits fall off
>>>	Zero fill right shift	Shifts right by pushing zeros in from the left, and let the rightmost bits fall off


*/
class Bit_Range {
    constructor(ui8a, bii_start, bii_end) {


        // Spec is a buffer, and its bit positions.
        //  These bit ranges will be used to access / use the values in the Huffman table.


        // Then be able to access the individual bits in this range by position.







    }
}


class Huffman_Tree {
    constructor(spec) {


        // Want efficient storage of the internal data

        // Need to be able to give it the binary JPEG definition of the Huffman Tree / Table?

        // Expecting the spec as an object makes most sense right now.

        // Function to decode JPEG-encoded Huffman tree / block data
        //  Initial part: The lengths (counts) at each number of bits
        //  Next part: the values at each number of bits.
        //   Requires reading sub-8-bit / non-byte separated values from the typed array.

        // Create the Huffman tree from JPEG DHT block...



    }
}

Huffman_Tree.from_JPEG_DHT = (ta_dht_data) => {

}

module.exports = Huffman_Tree;


if (require.main === module) {

    const test_bits = () => {
        const ui8a = new Uint8Array([21, 245]);

        let bii = 0;

        let bi = read_bit(ui8a, bii);
        console.log('bii', bii);
        console.log('bi', bi);

        bii = 1;

        bi = read_bit(ui8a, bii);
        console.log('bii', bii);
        console.log('bi', bi);

        bii = 4;

        bi = read_bit(ui8a, bii);
        console.log('bii', bii);
        console.log('bi', bi);

        console.log('ui8a', ui8a);

        write_bit(ui8a, 0, 0);

        console.log('ui8a', ui8a);

        write_bit(ui8a, 1, 1);
        console.log('ui8a', ui8a);




        // Examples using genuine JPEG Huffman Tree data...?


    }
    test_bits();
    



}