

/*
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



*/

// Want parts / definitions such as SOI.
//  Be able to say parts are optional.


// Simple definition of the parts and arrangements for different files will work well.
//  Assumption of streaming / raising events for the output rather than buffering.

const range = (i1, i2) => {
    const res = [];
    for(i = i1; i < i2; i++) {
        res.push(i);
    }
    return res;
}

const arr_jpeg_section_names = new Array(256);
arr_jpeg_section_names[216] = 'SOI';

// generate the app strings according to formula.


range(0, 15).map(i => {
    arr_jpeg_section_names[224 + i] = 'APP' + i;
});

//arr_jpeg_section_names[224] = 'APP0';
//arr_jpeg_section_names[225] = 'APP1';




arr_jpeg_section_names[219] = 'DQT';
arr_jpeg_section_names[196] = 'DHT';
arr_jpeg_section_names[192] = 'SOF0';
arr_jpeg_section_names[254] = 'COM';
arr_jpeg_section_names[218] = 'SOS';
arr_jpeg_section_names[217] = 'EOI';
arr_jpeg_section_names[221] = 'DRI'; // Response Interval


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

arr_jpeg_section_names[208] = 'RESET';
arr_jpeg_section_names[209] = 'RESET';
arr_jpeg_section_names[210] = 'RESET';
arr_jpeg_section_names[211] = 'RESET';
arr_jpeg_section_names[212] = 'RESET';
arr_jpeg_section_names[213] = 'RESET';
arr_jpeg_section_names[214] = 'RESET';
arr_jpeg_section_names[215] = 'RESET';

/*

208 - 215
 When you encounter a restart marker (FFD0-FFD7), reset the DC values (Y,Cr,Cb) to 0 and the bitstream is started on a byte boundary (after the FFDx). 
 It's simply a matter of counting through the restart interval over and over as you decode the image. 
 The restart marker values will increment from FFD0 to FFD7 and then start again at FFD0. 
 The marker value itself is not terribly important, but it can indicate if large chunks of data is missing. 
 Here's an example of how I do it in my decoder. 
 I throw away the restart markers in my bitstream reader.

*/

const dctZigZag = new Uint8Array([
    0,
    1,  8,
   16,  9,  2,
    3, 10, 17, 24,
   32, 25, 18, 11, 4,
    5, 12, 19, 26, 33, 40,
   48, 41, 34, 27, 20, 13,  6,
    7, 14, 21, 28, 35, 42, 49, 56,
   57, 50, 43, 36, 29, 22, 15,
   23, 30, 37, 44, 51, 58,
   59, 52, 45, 38, 31,
   39, 46, 53, 60,
   61, 54, 47,
   55, 62,
   63
 ]);



// seq_app0

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


// JPEG

// Split into 8x8 blocks
//  These 8 blocks get processed separately.


// DCT coefficient...?

// JPEG replacing 00 / ff / whatever sequences with just 1 byte...
//  Would be worth making a new array when this is the case?






// Want polycodec to be able to handle / use existing encoders and decoders.
//  Then be able to break down and use the code.
//  Provide a simple to use API, where possible.











const add_jpeg_format_to_polycodec = (polycodec) => {

    if (!polycodec.has_format('jpeg')) {
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
        polycodec.set_format_fn_input_scan('jpeg', (ta_data, o_from_last_scan) => {

            // redo the ta_data, dealing with the issue with value 255.
            //  means reallocating though :(

            
            



            //console.log('o_from_last_scan', o_from_last_scan);

            // Search for the JPEG markers.

            // May be better to raise immediate events?
            //  May not matter really, can have some JPEG stream-specific analysis here.

            //console.log('jpeg ta_data', ta_data);

            // identify sequnce markers.

            const arr_section_markers = [];

            // possible seuqnce markers in the last byte...
            //  Need to handle that in theory and practise.

            const l = ta_data.length;
            let last_byte, current_byte;

            let last_section_name, current_section_name;
            let byi_last_section, byi_current_section;

            if (o_from_last_scan && o_from_last_scan.current_section_name) current_section_name = o_from_last_scan.current_section_name;

            const res = {};

            let i_section_in_data_chunk = 0;

            // change 255, 255 to 255 in the process.

            //  create a new JPEG chunk buffer in that case?
            //   mark the appearance of a 255, 255?
            //    would help to escape it faster later on.




            for (let byi = 0; byi < l; byi++) {
                current_byte = ta_data[byi];

                //console.log('[byi, current_byte]', [byi, current_byte]);

                if (byi > 0) {
                    // identify if a marker has been read.

                    // deal with 255, 255...
                    //  or is it 255, 0?

                    // optional 0xFF fill bytes

                    


                    if (last_byte === 255 && current_byte !== 0) {
                        if (current_byte === 255) {
                            // fill byte.

                        } else {

                            // It's a new section....
                            //console.log('[byi, current_byte, last_byte]', [byi, current_byte, last_byte]);
                            //console.log('[byi, last_byte, current_byte]', [byi, last_byte, current_byte]);

                            if (arr_jpeg_section_names[current_byte]) {

                                last_section_name = current_section_name;
                                current_section_name = arr_jpeg_section_names[current_byte];
                                byi_last_section = byi_current_section;
                                byi_current_section = byi - 1;

                                if (last_section_name && current_section_name) {
                                    //console.log('last_section_name', last_section_name);
                                    //console.log('current_section_name', current_section_name);
                                    const o_section_marker = {
                                        name: last_section_name,
                                        byi_start: byi_last_section || 0,
                                        byi_end: byi_current_section,
                                        byi_data_end: byi_current_section
                                    };
                                    
                                    if (o_from_last_scan && o_from_last_scan.current_section_name && i_section_in_data_chunk === 0) {
                                        o_section_marker.continues_from_previous = true;
                                        o_section_marker.byi_data_start = 0;
                                    } else {
                                        o_section_marker.byi_data_start = (byi_last_section || 0) + 2;
                                    }
                                    arr_section_markers.push(o_section_marker);
                                    i_section_in_data_chunk++;
                                }

                            } else {
                                console.trace();

                                // Reset markers (0xD0 through 0xD7)

                                console.log('hex(current_byte) ' + current_byte.toString(16));

                                console.log('[byi, current_byte, last_byte]', [byi, current_byte, last_byte]);
                                throw 'Unsupported or nyi current_byte: ' + current_byte;

                                
                            }

                        }

                        
                        



                    }
                }

                //if (byi === l - 1) {
                    
                //}

                // In the last position - if it ends with a marker start (255), we need to carry that forward to the beginning of the next scan.
                //  Seems worth solving this thoeretical problem.

                last_byte = current_byte;
            }

            // Then the information to carry into the next scan call.

            if (current_byte === 255) {
                res.ta_carry_forward = new UInt8Array([current_byte]);
            }

            if (current_section_name) {
                arr_section_markers.push({
                    name: current_section_name,
                    byi_start: byi_current_section || 0,
                    byi_end: l
                });

                res.o_for_next_scan = {
                    current_section_name: current_section_name
                }
            }
            res.arr_section_markers = arr_section_markers;

            //console.log('res', res);

            //throw 'stop';

            

            



            return res;





        });


        // Then parsers for specific sections...
        //  These will be streaming?

        // a stream decoder? as in the stream can be split...?

        // To decode the full typed array.
        //  Could some of it be left over?
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
            const part_length = read_ui16(ta_dht, 0) - 2;
            byi += 2;
            let j;
            //console.trace();
            console.log('(read) part_length', part_length);

            // look at the 1st 16 bytes...

            const huffmanTableSpec = ta_dht[2];
            byi++;

            const ta_lengths = ta_dht.subarray(3, 19);
            const ta_data = ta_dht.subarray(19);
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

            })




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
