

/*


20/11/2019 - Also worth approaching this from the other end.
    Been working on the decoding, made breakthrough (in understanding) DHT structure - still not so clear yet though....
        see http://archive.is/NDND8
    Encoding of JPEG data would help in approaching this from the different direction.
    More work on Color_Space - the phrase 'color space' is used to mean setup of RGB etc and not the size of the image.
    // Change name? Critical_Image_Data? TA_Image_Data? ta_meta? PB_Meta may work better.

// rgb to cmyk is best in other codebase for the moment.

// ll-math as well?

// but maybe have img-math module under it?
//  ll-math supporting img-math.



The whole JPEG structure:


JFIF file structure
Segment	Code	Description
SOI	FF D8	Start of Image
JFIF-APP0	FF E0 s1 s2 4A 46 49 46 00 ...	see below
JFXX-APP0	FF E0 s1 s2 4A 46 58 58 00 ...	optional, see below
… additional marker segments
(for example SOF, DHT, COM)
SOS	FF DA	Start of Scan
compressed image data	
EOI	FF D9	End of Image




Binary_Object_Definition: Binary_Object_Definition,
    Binary_Object_Native_Type_Definition: Binary_Object_Native_Type_Definition,
    BOD_Ui8: BOD_Ui8,
    BOD_Ui16: BOD_Ui16,
    BOD_String: BOD_String,
    BOD_Utf8_String: BOD_Utf8_String,
    Binary_Object_Segment_Definition: Binary_Object_Segment_Definition


*/

// Want parts / definitions such as SOI.
//  Be able to say parts are optional.

/*


const jpeg_consts = {
    arr_jpeg_section_names: arr_jpeg_section_names,
    dctZigZag: dctZigZag
}

*/

const {arr_jpeg_section_names, dctZigZag} = require('./consts');
const jpeg_rs_scan = require('./rs-scan');
const {fn_parse_from_oo_type_def, parse_binary_by_type, read_ui16} = require('../../../parse');
// Another function / file for escape???

// ASCII string?
const {Binary_Object_Segment_Definition, BOD_Ui8, BOD_Ui16, BOD_Ui8_Array, BOD_Ui16_Array, BOD_Ascii_String, BOD_Utf8_String, BOD_Buffer} = require('../../../math/binary-object-definition');


const Huffman_Tree = require('../../../math/huffman-tree');

// Simple definition of the parts and arrangements for different files will work well.
//  Assumption of streaming / raising events for the output rather than buffering.

// Different depths (indexed with an int?) for each level of parsing?

// Reading parts....
//  But for the moment the main thing is having the description of the part(s)

// General parsing...

// (ui8a_data, byte_offset, instruction)

// want to avoid specific parsing instruction functions, except by auto-generating them.

// focus on defining the format(s) and object(s) within them now.
//  May still make use of a scanning algorithm but once it's through that, should not need other algo...?
//   Maybe it will, keep it extendable and fast.

const def_jpeg_part = {

    // as a sequence?
    //  sequence / array may make most sense.

    // length, the rest of the data
}

// Binary_Object_Data_Item_Definition
//  Name, type

// Or the binary data items in sequence.
//  The types here will help keep things strongly typed etc.

// Replacement of FFxx with what?
//  Single quick scanning function?

// Then sub-definitions with classes will be of use.
// Sequence can be used in function that does the parsing / deserialise.


// Be able to indicate binary section of unknown length.
//  Binary sections can then be used for another level of decoding.


// Some hooks? 2? for length calculation and validation functions?
//  such as for PNG's CRC.

// Hopefully will be part of the fastest JS JPEG decoder!


// Very much stick to making the definitions with this code.
//  With this code stable, other code can focus on parsing streams using these definitions.
//   Will make system that works with incoming asyncronous data.


// Not using the basic chunks right now.
//  Scanning will find out which specific typed chunks to use.

// BOD_X_Buffer class????


// May need to just define / model flexible types here.
//  This system will make it very clear, while other systems will make use of it.

class BOD_JPEG_Chunk extends Binary_Object_Segment_Definition {
    constructor(spec) {
        spec.format = 'JPEG';
        super(spec);

        const seq = this.sequence;
        // And a required value given...?
        // .required.value = ...

        seq.push(new BOD_Ui8({
            name: 'begin_code',
            required: {
                hex_value: 'FF'
            }
        }));
        seq.push(new BOD_Ui8({
            name: 'chunk_type_code'
        }));

        // BOD_Buffer
        // The 'x' Buffer :)
        // Can be length 0. Needs to be for the SOI which is only 2 bytes.
        //seq.push(new BOD_Buffer({
        //    name: 'x'
        //}));
        // Designated unknown / variable / continuous buffer.

        // Optional length?
        //  Better just to have the rest as well...?

        // then do they all have lengths?
        //  not all of them I think.
        // Then another part gets read, is still a UI 8 but we check against it's hex value? Can do that.

    }
}

const seq_app0 = [
    /*
    {
        name: 'APP0 marker',
        hex_value: 'ffe0'
    },
    
    {
        name: 'Identifier',
        type: 'string',
        hex_value: '4a46494600',
        length: 5
    },
    //,
    */
    '(ui16 part_length_from_here)',
    '(string[5] Identifier)',
    '(ui8 JFIF_ver_major)',
    '(ui8 JFIF_ver_minor)',
    '(ui8 Density_Units)',
    '(ui16 Xdensity)',
    '(ui16 Ydensity)',
    '(ui8 Xthumbnail)',
    '(ui8 Ythumbnail)',
    '(ui8a basic_thumbnail)' // its size is 'the rest' - it's known how much space is left in the sequence.
]


class BOD_JPEG_APP0 extends BOD_JPEG_Chunk {
    constructor(spec = {}) {
        spec.name = 'APP0';
        super(spec);
        const seq = this.sequence;
        seq.push(new BOD_Ui16({
            name: 'length'
        }));
        seq.push(new BOD_Ascii_String({
            name: 'identifier',
            length: 5
        }));
        seq.push(new BOD_Ui8({
            name: 'jfif_ver_major'
        }));
        seq.push(new BOD_Ui8({
            name: 'jfif_ver_major'
        }));
        seq.push(new BOD_Ui8({
            name: 'density_units'
        }));
        seq.push(new BOD_Ui16({
            name: 'x_density'
        }));
        seq.push(new BOD_Ui16({
            name: 'y_density'
        }));
        seq.push(new BOD_Ui8({
            name: 'x_thumbnail'
        }));
        seq.push(new BOD_Ui8({
            name: 'y_thumbnail'
        }));
        seq.push(new BOD_Buffer({
            name: 'buf_thumbnail'
        }));

        // BOD_Ascii_String

        // Be able to give the value of a string as well...
        //  Or read the value.

    }
}

// JPEG start and JFIF


// Then specific BODs for the objects within the JPEG.

// sequence tree?
//  sequence levels?

// Get the outer parsing working first.
// And this may be it for parsing definitions....


/*


Lh 
16 

length:
2 bytes
16 bits

17
1
+ ∑ + t=
n
mt c h
Tc 
4 bits
 0, 1 0
Th 
4 bits

0, 1 0-3
Li 8 0-255
Vi, j 18 0-255

Later part data gets into the 'Huffman Coding Model'.
These at least use data from single bytes.

*/




// BOD_Ui4
//  Be able to read 2 of them in a row at least.



class BOD_JPEG_DHT extends BOD_JPEG_Chunk {
    constructor(spec = {}) {
        spec.name = 'DHT';
        super(spec);
        const seq = this.sequence;

        seq.push(new BOD_Ui16({
            name: 'length'
        }));

        // Huffman table spec is a bit more complicated.
        //  See https://www.w3.org/Graphics/JPEG/itu-t81.pdf page 41.

        // 

        // Dividing up the Huffman Table Spec into 2x BOD_Ui4
        //  Then its values will make sense.
        // Better to have the 2 separate 4 bit values here defined, and poly-codec will support them too.






        seq.push(new BOD_Ui8({
            name: 'huffman_table_spec'
        }));

        // BOD_Ui8_Array
        seq.push(new BOD_Ui8_Array({
            name: 'code_counts',
            length: 16 // array items count also 16. array_length and byte_length...? need to be careful / explicit in cases that are not 8 bit.
        }));
        // BOD_Buffer
        // Length assumed to be the rest?
        seq.push(new BOD_Buffer({
            name: 'buf_huffman'
        }));


        // Could have more info about what the buf_huffman's OO type is...
        //  or rather make the oo-huffman using these two variables as input.
        //  describe this in the next level.

        // Then the remainder of the chunk is a binary section for now...?
        //  Buffer...?
        //   Or Binary_Type?

        // We will use our own buffer? Too confusing?
        //  A node buffer polyfill, as well as bit manipulation...
        //   Could work well.
        //   See if node buffer uses js anyway....

        // Then follows an array.
        //  Definitely want to be able to declare (typed) array types, not just binary.
    }
}



// Could create a DHT/HT/Huffman object using this parsed object.

// Then need to define further function / input for the OO DHT object.
//  Or could take the whole block and make it.
//  Next level processing?
//   Simple constructor function that references the JPEG block?
//   Create the object using a JPEG block as the constructor?

class BOD_JPEG_DQT extends BOD_JPEG_Chunk {
    constructor(spec = {}) {
        spec.name = 'DQT';
        super(spec);
        const seq = this.sequence;

        seq.push(new BOD_Ui16({
            name: 'length'
        }));

        seq.push(new BOD_Ui8({
            name: 'dqt_table_spec'
        }));
        // BOD_Buffer
        // Length assumed to be the rest?
        seq.push(new BOD_Buffer({
            name: 'buf_dqt'
        }));
        // Could have more info about what the buf_huffman's OO type is...
        //  or rather make the oo-huffman using these two variables as input.
        //  describe this in the next level.

        // Then the remainder of the chunk is a binary section for now...?
        //  Buffer...?
        //   Or Binary_Type?

        // We will use our own buffer? Too confusing?
        //  A node buffer polyfill, as well as bit manipulation...
        //   Could work well.
        //   See if node buffer uses js anyway....

        // Then follows an array.
        //  Definitely want to be able to declare (typed) array types, not just binary.
    }
}

class BOD_JPEG_SOS extends BOD_JPEG_Chunk {
    constructor(spec = {}) {
        spec.name = 'SOS';
        super(spec);
        const seq = this.sequence;

        seq.push(new BOD_Ui16({
            name: 'length'
        }));

        seq.push(new BOD_Ui8({
            name: 'selectors_count'
        }));
        // BOD_Buffer
        // Length assumed to be the rest?
        seq.push(new BOD_Buffer({
            name: 'buf_scan'
        }));
        // Could have more info about what the buf_huffman's OO type is...
        //  or rather make the oo-huffman using these two variables as input.
        //  describe this in the next level.

        // Then the remainder of the chunk is a binary section for now...?
        //  Buffer...?
        //   Or Binary_Type?

        // We will use our own buffer? Too confusing?
        //  A node buffer polyfill, as well as bit manipulation...
        //   Could work well.
        //   See if node buffer uses js anyway....

        // Then follows an array.
        //  Definitely want to be able to declare (typed) array types, not just binary.
    }
}

/*
SOS Start of Scan
const scanLength = readUint16(); // skip data length
          const selectorsCount = data[offset++];
*/

class BOD_JPEG_SOI extends BOD_JPEG_Chunk {
    constructor(spec = {}) {
        spec.start = true;
        spec.name = 'SOI';
        super(spec);
        
        // Then the remainder of the chunk is a binary section for now...?
        //  Buffer...?
        //   Or Binary_Type?

        // We will use our own buffer? Too confusing?
        //  A node buffer polyfill, as well as bit manipulation...
        //   Could work well.
        //   See if node buffer uses js anyway....

        // Then follows an array.
        //  Definitely want to be able to declare (typed) array types, not just binary.
    }
}

class BOD_JPEG_EOI extends BOD_JPEG_Chunk {
    constructor(spec = {}) {
        spec.end = true;
        spec.name = 'EOI';
        super(spec);
        
        // Then the remainder of the chunk is a binary section for now...?
        //  Buffer...?
        //   Or Binary_Type?

        // We will use our own buffer? Too confusing?
        //  A node buffer polyfill, as well as bit manipulation...
        //   Could work well.
        //   See if node buffer uses js anyway....

        // Then follows an array.
        //  Definitely want to be able to declare (typed) array types, not just binary.
    }
}

class BOD_JPEG_SOF0 extends BOD_JPEG_Chunk {
    constructor(spec = {}) {
        spec.name = 'SOF0';
        super(spec);
        const seq = this.sequence;

        seq.push(new BOD_Ui16({
            name: 'length'
        }));
        seq.push(new BOD_Ui8({
            name: 'precision'
        }));
        seq.push(new BOD_Ui16({
            name: 'height'
        }));
        seq.push(new BOD_Ui16({
            name: 'width'
        }));
        seq.push(new BOD_Ui8({
            name: 'num_components'
        }));

        // buffer of the rest of the components...
        seq.push(new BOD_Buffer({
            name: 'buf_components'
        }));


    }

}

/*

SOF0 (Start Of Frame 0) marker:


Field                                    Size                      Description



Marker Identifier                 2 bytes    0xff, 0xc0 to identify SOF0 marker



Length                                  2 bytes   This value equals to 8 + components*3 value



Data precision                      1 byte     This is in bits/sample, usually 8

                                                            (12 and 16 not supported by most software).



Image height                        2 bytes    This must be > 0



Image Width                        2 bytes    This must be > 0



Number of components        1 byte      Usually 1 = grey scaled, 3 = color YcbCr or YIQ

                                                                4 = color CMYK

Each component                   3 bytes     Read each component data of 3 bytes. It contains,

                                                    (component Id(1byte)(1 = Y, 2 = Cb, 3 = Cr, 4 = I, 5 = Q),   

                                                    sampling factors (1byte) (bit 0-3 vertical., 4-7 horizontal.),

                                                    quantization table number (1 byte)).

*/

// Level 0 defs.
//  Extracts it using basic formats / number types.

const def_jpeg_dht = new BOD_JPEG_DHT();

// deeper type defs?
//  or object defs as level 1?





const def_jpeg_eoi = new BOD_JPEG_EOI();
const def_jpeg_app0 = new BOD_JPEG_APP0();
const def_jpeg_dqt = new BOD_JPEG_DQT();
const def_jpeg_sos = new BOD_JPEG_SOS();
const def_jpeg_soi = new BOD_JPEG_SOI();
const def_jpeg_sof0 = new BOD_JPEG_SOF0();

// http://lad.dsc.ufcg.edu.br/multimidia/jpegmarker.pdf

// SOFn

// n denotes different types of DCT and Huffman encoding.




const section_type_defs = {
    'DHT': def_jpeg_dht,
    'DQT': def_jpeg_dqt,
    'EOI': def_jpeg_eoi,
    'APP0': def_jpeg_app0,
    'SOS': def_jpeg_sos,
    'SOI': def_jpeg_soi,
    'SOF0': def_jpeg_sof0
}

// Direct construction usage, or could add a 'format' string, and have it in a 'value' or 'class' object.

// A function to arrange the constructors...?

const section_class_defs = {
    'DHT': Huffman_Tree
}

//console.log('section_type_defs', section_type_defs);


// Create the decode (stage) functions from the sig defs...

const fn_decode_dht = fn_parse_from_oo_type_def(def_jpeg_dht);
const fn_decode_dqt = fn_parse_from_oo_type_def(def_jpeg_dqt);
console.log('fn_decode_dht', fn_decode_dht);
const fn_decode_eoi = fn_parse_from_oo_type_def(def_jpeg_dht);
const fn_decode_app0 = fn_parse_from_oo_type_def(def_jpeg_app0);
const fn_decode_sos = fn_parse_from_oo_type_def(def_jpeg_sos);
const fn_decode_soi = fn_parse_from_oo_type_def(def_jpeg_soi);
const fn_decode_sof0 = fn_parse_from_oo_type_def(def_jpeg_sof0);

const section_decoder_fns = {
    'DHT': fn_decode_dht,
    'DQT': fn_decode_dqt,
    'EOI': fn_decode_eoi,
    'APP0': fn_decode_app0,
    'SOS': fn_decode_sos,
    'SOI': fn_decode_soi,
    'SOF0': fn_decode_sof0
}


//console.trace();
//throw 'stop';
/*
case 0xFFE0: // APP0 (Application Specific)
case 0xFFE1: // APP1
case 0xFFE2: // APP2
case 0xFFE3: // APP3
case 0xFFE4: // APP4
case 0xFFE5: // APP5
case 0xFFE6: // APP6
case 0xFFE7: // APP7
case 0xFFE8: // APP8
case 0xFFE9: // APP9
case 0xFFEA: // APP10
case 0xFFEB: // APP11
case 0xFFEC: // APP12
case 0xFFED: // APP13
case 0xFFEE: // APP14
case 0xFFEF: // APP15


case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)

*/

/*
arr_jpeg_section_names[208] = 'RESET0';
arr_jpeg_section_names[209] = 'RESET1';
arr_jpeg_section_names[210] = 'RESET2';
arr_jpeg_section_names[211] = 'RESET3';
arr_jpeg_section_names[212] = 'RESET4';
arr_jpeg_section_names[213] = 'RESET5';
arr_jpeg_section_names[214] = 'RESET6';
arr_jpeg_section_names[215] = 'RESET7';
*/


/*

208 - 215
 When you encounter a restart marker (FFD0-FFD7), reset the DC values (Y,Cr,Cb) to 0 and the bitstream is started on a byte boundary (after the FFDx). 
 It's simply a matter of counting through the restart interval over and over as you decode the image. 
 The restart marker values will increment from FFD0 to FFD7 and then start again at FFD0. 
 The marker value itself is not terribly important, but it can indicate if large chunks of data is missing. 
 Here's an example of how I do it in my decoder. 
 I throw away the restart markers in my bitstream reader.

*/

/*

 Specific object definitions. JPEG parts.
 // General JPEG Binary Object Def

*/


// seq_app0

// JPEG

// Split into 8x8 blocks
//  These 8 blocks get processed separately.


// DCT coefficient...?

// JPEG replacing 00 / ff / whatever sequences with just 1 byte...
//  Would be worth making a new array when this is the case?






// Want polycodec to be able to handle / use existing encoders and decoders.
//  Then be able to break down and use the code.
//  Provide a simple to use API, where possible.








// Some kind of Format object?
//  Extends BOD?
//   But these definitions don't contain custom functions.


// Format object containing functions / values to help the PolyCodec?
// An escape-read-copy?




// const escape_jpeg_ta = (ta_data, arr_escape_positions)

const escape_jpeg_ta = (ta_data, byi_start, byi_end, arr_escape_positions) => {

    //console.log('escape_jpeg_ta', escape_jpeg_ta);
    //console.log('arr_escape_positions.length', arr_escape_positions.length);

    // Will do fairly simple character copying / writing.

    const l_res = byi_end - byi_start - arr_escape_positions.length;

    //console.log('byi_start, byi_end', [byi_start, byi_end]);

    //console.log('escape_jpeg_ta l_res', l_res);

    let wbyi = 0;

    const ta_escaped = new Uint8Array(l_res);

    // the next expected escape position.
    //  the index in the escape positions array.

    let i_escape_positions = 0;
    let next_escape_position = arr_escape_positions[i_escape_positions++];

    // Copying the chunks between them would be more efficient.

    for (let byi = byi_start; byi < byi_end; byi++) {
        // When we have an escape position, skip it.
        // Skip the character after the escape BYI...?

        if (byi === next_escape_position) {
            //console.log('have escape position at rs chunk byi ' + byi);
            //console.log('ta_data[byi - 1]', ta_data[byi - 1]);
            //console.log('ta_data[byi]', ta_data[byi]);
            ta_escaped[wbyi++] = ta_data[byi - 1]; // would be 255.
            next_escape_position = arr_escape_positions[i_escape_positions++];
        } else {
            ta_escaped[wbyi++] = ta_data[byi];
        }
    }

    return ta_escaped;

    // will read / copy the ta into new parts....
}














const add_jpeg_format_to_polycodec = (polycodec) => {
    // Keep working on this.

    // Add a JPEG codec.
    //  Polycodec will be able to hold multiple codecs / codec versions.

    const has_jpeg = polycodec.has_format('jpeg');
    console.log('has_jpeg', has_jpeg);

    if (!has_jpeg) {
        //polycodec.add_format('jpeg', {
        //    hex4by_sig: 'ffd8ffe0'
        //});

        polycodec.add_format('jpeg');
        polycodec.set_format_hex4sig('jpeg', 'ffd8ffe0');

        // section_markers


        // Length	Chunk type	Chunk data	CRC
        
        // But the 'chunk type' is the marker?
        //  Or marker gets defined as a few fields.

        // length_type_data_crc_chunk

        //  and sections can be defined in this kind of a way.
        //  an algorithm that is not specific to the section type will scan through it.

        // polycodec.set_format_fn_input_scan(format_name, fn_input_scan(ta_data))
        //  Then it provides information about the various sections / chunks that get found within the input.
        //   Also will have handling of incomplete sections / chunks.

        // Providing a format-specific input scan function would be very useful.

        // And less JPEG-specific in the polycodec.
        //  Clearer how to integrate substantially different PNG parsing.


        // Input scan function definitely seems important.
        //  But can / how can generic parsing do it with the description it is given?

        // Format markers make sense!
        //  Won't be as chaotic to implement as before when using the OO def classes.


        // Polycodec should support different means and methods where possible.
        //  Level0 imput scan function definitely makes sense.

        // Generalise scanning elsewhere?
        //  Markers behaviour?
        //  Need to handle the escaping too.
        //   Always escape what is between the markers?
        
        // scan_and_escape?
        //  or do scan, it will find the characters to unescape / replace

        // jpeg_recieved_chunk_scan
        // rchunk rather than chunk or jpeg chunk.

        // a 'state' object may be better API. more flexi.
        //  the state of the FSM.
        // rs_scan.js?
        polycodec.set_format_fn_input_scan('jpeg', jpeg_rs_scan);
        // set_format_fn_escape

        polycodec.set_format_fn_escape('jpeg', escape_jpeg_ta);
        polycodec.set_format_section_type_defs('jpeg', section_type_defs);
        // section_decoder_fns
        polycodec.set_format_section_decoder_fns('jpeg', section_decoder_fns);

        // the class defs with a preparation function...?
        //  .set_format_class_defs

        // set_format_section_classes

        // section_class_defs
        polycodec.set_format_section_classes('jpeg', section_class_defs);




        // section_class_defs

        // set the type def decoders?
        //  have them already...? Set them all at once?
        //  And they are just the autodecoders / parsers.
        //   1st stage decoding 

        // Then using the type defs, it should be possible to parse / encode / ser / deser.
        //  Or those functions would be generated already in the source code above.

        // 2 or more stage decoding...

        // decoding chains...
        // functional decoding chains.

        // Then parsers for specific sections...
        //  These will be streaming?

        // a stream decoder? as in the stream can be split...?

        // To decode the full typed array.
        //  Could some of it be left over?

        // decoding chains... not having to specify the whole decoder.
        // parse, then decode, but much is a combination of both. maybe direct decoding from the parsed data etc.
        // want modular decoding, ie specific functions for decoding that get created and parsed etc.

        // readers, stream readers, stream data / metadata generators.

        // const parse_APP0 = fn_parse_binary_seq(seq_app0)

        // streaming parser...?

        // decoding in layers...
        //  multiple transformations...

        // Asyncronous read functions.
        //  Will wait until there is enough in the read-ahead?
        //  Continuously read all bits that come in...
        //   Continuous reading, specifying available data
        //    Then async reading could look at this data?
        //   



        // For the moment will see what milage I get with the Def classes, and functions that get generated to do the parsing / writing binary.
        //  And the DQT part was not working here - will further split the parsing and decoding / further parsing into layers.


        const _old_add_part_decoders = () => {


            polycodec.add_format_part_decoder('jpeg', 'APP0', ta_app0 => {
                console.log('ta_app0', ta_app0);
                // Binary parsing functions...
                //  parse_binary(ta, schema)
    
                const res = Poly_Codec.parse_binary(ta_app0, seq_app0);
                //console.log('res', res);
                //console.trace();
                //throw 'stop';
                return res;
            });
    
            // And can have the quantization table decoder too.
    
            polycodec.add_format_part_decoder('jpeg', 'DQT', ta_dqt => {
                console.log('ta_dqt', ta_dqt);
                console.log('ta_dqt.length', ta_dqt.length);
    
                const part_length = read_ui16(ta_dqt, 0) - 2;
                console.log('part_length', part_length);
    
                let byi = 0, j, z;
                const res = {};
    
                while (byi < part_length) {
                    console.log('byi', byi);
                    let quantizationTableSpec = ta_dqt[byi++];
                    console.log('quantizationTableSpec', quantizationTableSpec);
                    let tableData = new Int32Array(64);
    
                    if ((quantizationTableSpec >> 4) === 0) { // 8 bit values
                        for (j = 0; j < 64; j++) {
                          z = dctZigZag[j];
                          tableData[z] = ta_dqt[byi++];
                        }
                      } else if ((quantizationTableSpec >> 4) === 1) { //16 bit
                        for (j = 0; j < 64; j++) {
                          z = dctZigZag[j];
                          tableData[z] = ta_dqt[byi++] * 256 + ta_dqt[byi++];
                        }
                      } else
                        throw new Error("DQT: invalid table spec");
                    
                    console.log('tableData', tableData);
                    res[quantizationTableSpec & 15] = tableData;
                }
                return res;
    
                //for (let c = 2; c < part_length; c++) {
    
                //}
    
                /*
    
    
                var quantizationTablesLength = readUint16();
                var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                while (offset < quantizationTablesEnd) {
                  var quantizationTableSpec = data[offset++];
                  var tableData = new Int32Array(64);
                  if ((quantizationTableSpec >> 4) === 0) { // 8 bit values
                    for (j = 0; j < 64; j++) {
                      var z = dctZigZag[j];
                      tableData[z] = data[offset++];
                    }
                  } else if ((quantizationTableSpec >> 4) === 1) { //16 bit
                    for (j = 0; j < 64; j++) {
                      var z = dctZigZag[j];
                      tableData[z] = readUint16();
                    }
                  } else
                    throw new Error("DQT: invalid table spec");
                  quantizationTables[quantizationTableSpec & 15] = tableData;
                }
                break;
    
                */
    
    
    
                // Binary parsing functions...
                //  parse_binary(ta, schema)
    
    
                //const res = Poly_Codec.parse_binary(ta_app0, seq_app0);
                //console.log('res', res);
    
                console.trace();
                throw 'stop';
                return res;
            });
    
    
            // dht...
    
    
    
            /*
    
            case 0xFFC4: // DHT (Define Huffman Tables)
                var huffmanLength = readUint16();
                for (i = 2; i < huffmanLength;) {
                  var huffmanTableSpec = data[offset++];
                  var codeLengths = new Uint8Array(16);
                  var codeLengthSum = 0;
                  for (j = 0; j < 16; j++, offset++)
                    codeLengthSum += (codeLengths[j] = data[offset]);
                  var huffmanValues = new Uint8Array(codeLengthSum);
                  for (j = 0; j < codeLengthSum; j++, offset++)
                    huffmanValues[j] = data[offset];
                  i += 17 + codeLengthSum;
    
                  ((huffmanTableSpec >> 4) === 0 ?
                    huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] =
                    buildHuffmanTable(codeLengths, huffmanValues);
                }
                break;
    
            */
    
            polycodec.add_format_part_decoder('jpeg', 'DHT', ta_dht => {
                console.log('JPEG decode DHT');
                console.log('ta_dht', ta_dht);
                console.log('ta_dht.length', ta_dht.length);
    
                // will use try/catch for block decoding.
                //  be able to deal fith failed block decodes better.
                //  need to look into when a block fails to decode.
                //   ignore it? deal with errors better.
    
                let byi = 0;
    
                // the length 
    
                const part_length = read_ui16(ta_dht, 0) - 2;
                byi += 2;
                let j;
                //console.trace();
                console.log('(read) part_length', part_length);
    
                // look at the 1st 16 bytes...
    
                // no huffman table spec?
                //  did not see it in jpeg-js decoder.
    
                //const huffmanTableSpec = ta_dht[2];
                //byi++;
    
                const ta_lengths = ta_dht.subarray(2, 18);
                const ta_data = ta_dht.subarray(18);
                console.log('ta_dht.length', ta_dht.length);
    
                console.log('ta_lengths', ta_lengths);
                console.log('ta_data', ta_data);
                console.log('ta_lengths.length', ta_lengths.length);
                console.log('ta_data.length', ta_data.length);
                console.log('ta_data.length * 8', ta_data.length * 8);
    
                let sum = 0;
                const l_lengths = ta_lengths.length;
                //console.log('l_lengths', l_lengths);
    
                for (let c = 0; c < l_lengths; c++) {
                    sum += ta_lengths[c] * (c + 1);
                }
                console.log('sum', sum);
                console.log('sum / 8', sum /8);
    
                if (sum > (ta_data.length * 8)) {
                    console.trace();
                    console.log('ta_lengths', ta_lengths);
                    throw 'Huffman data does not fit in array';
                } else {
    
                    // then lift the codes out of the ta_data.
                    let bii = 0;
    
                    for (let c = 0; c < l_lengths; c++) {
                        const length_in_bits = c + 1;
                        const num_bit_sequences_at_length = ta_lengths[c];
                        //console.log('length_in_bits', length_in_bits);
                        //console.log('num_bit_sequences_at_length', num_bit_sequences_at_length);
                        //sum += ta_lengths[c] * (c + 1);
    
                        for (let d = 0; d < num_bit_sequences_at_length; d++) {
                            //console.log('bii', bii);
                            //console.log('length_in_bits', length_in_bits);
                            //console.log('ta_data.length', ta_data.length);
                            //console.log('ta_data.length * 8', ta_data.length * 8);
    
                            const num_bit_sequence = get_upto32bit_ui32_from_ui8a_at_bii(ta_data, bii, length_in_bits);
                            //console.log('num_bit_sequence', num_bit_sequence);
    
                            bii += length_in_bits;
                        }
                    }
    
                    //console.log('bii', bii);
                    //console.log('');
    
                    //throw 'stop';
    
                    // could use some functions later to lookup / reference Huffman table data.
                    //  may be stored in tree? obj? map?
    
                    // then can extract the individual values at those lengths...
                    //  but worth storing them in the Huffman Table object.
                    //  read the various values at those lengths
                    //   not sure how they would get looked up though.
    
                    // a list of bit sequences at each length.
    
    
                    // Then should be able to go through the data, reading out the specific bit patterns.
    
                    // Tracking the bit position, and reading the values as JS numbers...?
                    //  JS numbers do make the most sense for many operations.
                    //  double-precision 64-bit binary format
                    //   and these numbers can have & operations etc applying to them.
    
                    // Ability to read up to 64 bits from the data, starting at any point.
    
                    // Quite a lot will be possible with the 64bit 'word' or 'sentence' type of bit data
                    //  alongside the length in bits - this could be a 64bit number, or 8 bit using a ta.
    
                    /*
                    each(ta_lengths, (c, i) => {
                        console.log('[c, parseInt(i)]', [c, parseInt(i)]);
                        sum += (parseInt(i) + 1) * c;
                    })
                    */
                    // Does seem best to use an OO Huffman Table.
                    //throw 'stop';
    
                    /*
                    for (let c = 0; c < part_length;) {
                        const huffmanTableSpec = ta_dht[byi++];
                        const codeLengths = new Uint8Array(16);
                        let cl_sum = 0;;
                        for (j = 0; j < 16; j++, byi++) cl_sum += (codeLengths[j] = ta_dht[byi]);
                        var huffmanValues = new Uint8Array(cl_sum);
                        for (j = 0; j < cl_sum; j++, byi++)
                        huffmanValues[j] = ta_dht[byi];
    
                        c += 17 + cl_sum;
    
                        // use the data to create a Huffman_Table.
                        // An OO Huffman_Table would probably make sense.
                        // Could use a Huffman_Table module, huffman-table on npm?
                    }
                    */
                }
            });
        }


        // Don't need the format parts for the moment.
        //  They will be found within the input scan function.
        //  A single input scan function that generalises the input data into what the general purpose parser will be able to use.

        const not_in_use = () => {





                // For JPEGs.
            polycodec.define_format_section_marker_byte('jpeg', 'ff', '00', {
                'e0': 'APP0',
                'db': 'DQT',
                'c4': 'DHT',
                'c0': 'SOF0',
                'd8': 'SOI',
                'da': 'SOS',
                'd9': 'EOI'
            });

            // Then set the possible different headers for different formats.

            // JFIF APP0 part

            // Then the thumb

            // JFIF, followed by null

            polycodec.add_format_part('jpeg', 'signature_intro', {
                name: 'signature_intro',
                hex_value: 'ffd8'
            });

            polycodec.add_format_part('jpeg', 'JFIF APP0', {
                sequence: [
                    /*
                    {
                        name: 'APP0 marker',
                        hex_value: 'ffe0'
                    },
                    '(ui16 part_length_from_here)',
                    {
                        name: 'Identifier',
                        type: 'string',
                        hex_value: '4a46494600',
                        length: 5
                    },
                    
                    */
                    //'(string[5] Identifier)',
                    '(ui8 JFIF_ver_major)',
                    '(ui8 JFIF_ver_minor)',
                    '(ui8 Density_Units)',
                    '(ui16 Xdensity)',
                    '(ui16 Ydensity)',
                    '(ui8 Xthumbnail)',
                    '(ui8 Ythumbnail)',
                    '(ui8a basic_thumbnail)' // its size is 'the rest' - it's known how much space is left in the sequence.
                ]
            });

            polycodec.use_format_part_caching('jpeg', 'JFIF APP0');


            polycodec.add_format_part_item_length_calculator('jpeg', 'JFIF APP0', 'basic_thumbnail', (map_part_item_values) => {
                // Get info on the decoding (fsm) as a param?

                //  We need the part_length_from_here value
                //   map_part_item_values

                //console.log('map_part_item_values', map_part_item_values);
                //console.trace();
                //throw 'stop';

                return map_part_item_values.part_length_from_here.value - 16;

                //const plfh = polycodec.get_

            });

            /*
            APP0 marker	2	FF E0
            Length	2	Length of segment excluding APP0 marker
            Identifier	5	4A 46 58 58 00 = "JFXX" in ASCII, terminated by a null byte
            Thumbnail format	1	Specifies what data format is used for the following embedded thumbnail:
            10 : JPEG format
            11 : 1 byte per pixel palettized format
            13 : 3 byte per pixel RGB format
            Thumbnail data	variable	Depends on the thumbnail format, see below
            */



            polycodec.add_format_part('jpeg', 'JFIF extension APP0', {
                optional: true,
                sequence: [
                    {
                        name: 'APP0 marker',
                        hex_value: 'ffe0'
                    },
                    '(ui16 part_length_from_here)',
                    {
                        name: 'Identifier',
                        type: 'string',
                        hex_value: '4a46585800',  // 4A 46 58 58 00
                        length: 5
                    },
                    '(ui8 Thumbnail_Format)',
                    '(ui8a thumbnail_data)'
                ]
            });


            // ffdb - DQT
            //  it's a required JPEG part.








            // Then define the 'scan' part.
            // Can treat the ui8 of unknown length? as a stream.

            // Will need some buffering in some cases, but in other cases, the data will be used as it's available, and passed through.

            // Denfinitely worth making the definitions system general enough to handle a variety of formats.
            //  Parsing the different formats by taking the first stage of identifying and extracting the encoded data.

            //  Then the encoded data may be split up onto objects such as key frames and other frames.
            //   Animated GIF can have frames too.
            //   Dont know about animated PNG.





            /*


            polycodec.add_format_part('jpeg', 'scan', {
                sequence: [
                    {
                        name: 'SOS',
                        hex_value: 'ffda'
                    },
                    '(ui8a compressed_image_data)',
                    {
                        name: 'EOI',
                        hex_value: 'ffd9'
                    }
                ]
            })
            */


            /*
            // Define some as being optional here?
            polycodec.set_format_sequence('jpeg', [
                'signature_intro',
                'JFIF APP0',
                'JFIF extension APP0',
                'scan'
            ]);
            */

            



        }
        

        // At least will know it's reading the compressed image data


        // By making the data and the processing very explicit, we'll be able to go in stages to decode it.


        // First do anything that can parse the whole thing.

        // Want it at first just be be able to process through the various parts.
        //  Will get into more detail about decoding / decompresing parts.
        //  Can use definitions, can use algorithms.

        // and can add definitions for various parts of the JPEG.


        // Declarative info that will be used to encode and decode such an image.

        // polycodec.add_format_type('jpeg', 'APP0')

        // polycodec.add_format_part()

        

    }

}
module.exports = {
    add_jpeg_format_to_polycodec: add_jpeg_format_to_polycodec
}