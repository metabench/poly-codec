


/*


// PNG starts:
        //  89 50 4E 47 0D 0A 1A 0A
        //   or just:
        //  89 50 4E 47
        //  89 P  N  G     it wouldn't be anything else.





        // Starts 	FF D8 FF E0 for JPEG it seems.
        // 'JFIF' at byte 6? for JPEG


*/



const read_ui32_from_ui8a = (ui8a, pos) => {
    return 16777216 * ui8a[pos] + 65536 * ui8a[pos + 1] + 256 * ui8a[pos + 2] + ui8a[pos + 3];
}

const read_ascii_from_ui8a = (ui8a, pos, length) => {
    return String.fromCharCode.apply(null, ui8a.subarray(pos, pos + length));
}


const add_png_format_to_polycodec = (polycodec) => {

    // The basics of the PNG file too.


    // Will be interesting to make / try more codecs, such as word document codecs, maybe CSV.





    if (!polycodec.has_format('png')) {
        //polycodec.add_format('png', {
        //    hex4by_sig: '89504e47'
        //});

        polycodec.add_format('png');
        polycodec.set_format_hex4sig('png', '89504e47');

        // Want it at first just be be able to process through the various parts.
        //  Will get into more detail about decoding / decompresing parts.
        //  Can use definitions, can use algorithms.

        // Will add in a specific scan function for this.

        // For each chunk, need to know the amount remaining from a previous chunk.

        // Need some more data going into the scan call.
        //  Maybe the scan call could set some data that goes into its next scan call.
        //  Can set a byi / length of a section that goes beyond the particular scan - so it's OK.

        // Needs to pass through a bytes_section_remaining value.
        //  That will be relatively general-purpose within 


        // scan options obj

        // Giving the scan function the results of the previous scan function could be of use.
        //  In the case of PNGs, the lengths of the parts (chunks in PNG vocab) will be known in advance.

        //  Will be fairly easy to read a chunk length from a PNG.
        //   Will determine if that PNG chunk ends within the input data chunk.


        // Passing data between the chunk scan calls...
        //  Would make sense.

        // Passing of data between JPEG scans...
        //  Would be able to use data retrieved in last scan - could keep the same object between scans..




        // Is the scan function going to be aware of the current stata?

        // byi_within_stream
        // current_section.



        polycodec.set_format_fn_input_scan('png', (ta_data, opts = {}) => {
            // Identify the chunks - but this time the scanning works according to length.
            //const chunk_bytes_remaining = chunk_bytes_remaining || 0;
            console.log('set_format_fn_input_scan opts', opts);

            const i_scan = opts.i_scan || 0;

            let current_section_name = opts.current_section_name;

            let i_section_in_data_chunk = 0;

            const arr_section_markers = [];

            // 


            let byi_start_chunk, byi_end_chunk;
            let chunk_length, chunk_type_name, chunk_crc;

            console.log('ta_data', ta_data);
            console.log('i_scan', i_scan);

            let byi = 0;

            // the position within the whole document.

            if (i_scan === 0 && byi === 0) {
                const hex_found_png_sig = hex(ta_data.subarray(0, 8));
                console.log('hex_found_png_sig', hex_found_png_sig);

                if (hex_found_png_sig === '89504e470d0a1a0a') {
                    // we have found the position of the signature (its always at pos 0 to 8);

                    const o_section_marker = {
                        name: 'signature',
                        byi_start: 0,
                        byi_end: 8
                    };

                    arr_section_markers.push(o_section_marker);
                    i_section_in_data_chunk++;

                    byi = 8;

                }

                // read the chunk type and name.

                // then it's 4 bytes as the format type.


                // attempt_read_png_chunk_from_input
                // read chunk start? at pos 8
                //  maybe it won't be complete in this chunk.

                const attempt_chunk_read_from_ta = (ta, byi) => {


                    if (byi === ta.length) {

                    } else {

                        console.log('');
                        console.log('attempt_chunk_read_from_ta');
                        console.log('byi', byi);

                        let l_chunk_data = read_ui32_from_ui8a(ta, byi);
                        console.log('l_chunk_data', l_chunk_data);

                        let next_ascii = read_ascii_from_ui8a(ta, byi + 4, 4);
                        console.log('next_ascii', next_ascii);
                        console.log('next_ascii.length', next_ascii.length);

                        // check whether this png chunk is still within the input ta.

                        let predicted_byi_png_chunk_end = byi + 8 + l_chunk_data;

                        console.log('predicted_byi_png_chunk_end', predicted_byi_png_chunk_end);
                        let predicted_byi_png_crc32_end = predicted_byi_png_chunk_end + 4;

                        console.log('predicted_byi_png_crc32_end', predicted_byi_png_crc32_end);

                        // Return the section info....

                        if (predicted_byi_png_crc32_end <= ta.length) {
                            // Then there will be inner data in these sections.
                            // o_section_info...

                            const o_section_info = {
                                name: next_ascii,
                                byi_start: byi,
                                //byi_end: 16,
                                byi_section_data_start: byi + 8,
                                byi_section_data_end: predicted_byi_png_chunk_end,
                                byi_crc32_start: predicted_byi_png_chunk_end,
                                byi_crc32_end: predicted_byi_png_crc32_end,
                                byi_end: predicted_byi_png_crc32_end
                            };

                            arr_section_markers.push(o_section_info);
                            i_section_in_data_chunk++;
                            

                            return o_section_info;

                        } else {

                            // Will be a partial section.

                            // it's incomplete within this input data chunk.
                            console.log('byi', byi);
                            console.log('predicted_byi_png_chunk_end', predicted_byi_png_chunk_end);
                            console.log('ta.length', ta.length);

                            console.trace();
                            throw 'stop';
                        }

                    }


                    
                    
                }

                let section_read = attempt_chunk_read_from_ta(ta_data, byi);
                console.log('section_read', section_read);

                while (section_read) {
                    byi = section_read.byi_end;
                    console.log('byi', byi);

                    section_read = attempt_chunk_read_from_ta(ta_data, byi);
                    console.log('section_read', section_read);
                }

                //const 



                // then extract it as a 'section' or 'part'.
            }

            if (!current_section_name) {
                // Look for the beginning of a section.


            }

            const res = {};

            res.arr_section_markers = arr_section_markers;

            return res;







            //console.trace();
            //throw 'stop';



        });


        // Then the PNG format as various 'parts'.

        /*
        A PNG file starts with an 8-byte signature (refer to hex editor image on the right):

        Values (hex)	Purpose
        89	Has the high bit set to detect transmission systems that do not support 8-bit data and to reduce the chance that a text file is mistakenly interpreted as a PNG, or vice versa.
        50 4E 47	In ASCII, the letters PNG, allowing a person to identify the format easily if it is viewed in a text editor.
        0D 0A	A DOS-style line ending (CRLF) to detect DOS-Unix line ending conversion of the data.
        1A	A byte that stops display of the file under DOS when the command type has been used—the end-of-file character.
        0A	A Unix-style line ending (LF) to detect Unix-DOS line ending conversion.

        */

        // Not saying what order the part is...
        //  Maybe it's worth having ordering properties here, such as first: true

        // or 'ordinal' property / order.

        // order: 0
        // order: '> 0';

        // Overall PNG reading is very simple like this.
        
        // Best to have another variable / seuqnce that defines / describes the format itself.

        /*


        polycodec.add_format_part('png', 'signature', {
            name: 'signature',
            hex_value: '89504e470d0a1a0a'
        });
        */

        /*
                
        Length  	Chunk type  	Chunk data  	CRC
        4 bytes 	4 bytes	        Length bytes	4 bytes

        */

        /*

        polycodec.add_format_data_type('png', 'chunk', {
            sequence: [
                '(ui32 self_length)',
                '(ascii[4] self_type)',
                '(ui8a[self_length - 12] data)',
                '(ui32 self_crc)'
            ]
        });

        polycodec.set_format_sequence('png', [
            'signature',
            'chunk[n]'
        ]);

        */

        // Should be enough for the basic reading through of PNGs.
        //  Want a simple way to read mp4, avi files soon, without decoding details.
        

    }
}
