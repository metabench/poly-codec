// And a 'consts' file for jpeg...

//  Would help!

const {arr_jpeg_section_names, dctZigZag} = require('./consts');


// It could know that the EOI means it's the end of the image, and how many bytes that EOI takes.



const rs_scan = (ta_data, state = {}) => {
    // chunk_byte_offset

    console.log('rs_scan state', state);
    const {i_chunk, l_chunk, offset_chunk} = state;
    let {current_section_name} = state;


    console.log('[i_chunk, l_chunk, offset_chunk]', [i_chunk, l_chunk, offset_chunk]);




    // State should have:
    //  chunk_offset / offset_chunk.



    // SMPA etc.

    // redo the ta_data, dealing with the issue with value 255.
    //  means reallocating though :(


    // {...} = state.
    //  Then refer to the state variables to know what to do (context).
    //  Also handle no state variables set.



    //console.log('o_from_last_scan', o_from_last_scan);
    // Search for the JPEG markers.

    // May be better to raise immediate events?
    //  May not matter really, can have some JPEG stream-specific analysis here.

    //console.log('jpeg ta_data', ta_data);
    // identify sequnce markers.


    // Immediate event-based scanning will be best.
    //  Most/many sections would need to be completely read to be used.
    //  Some won't.


    // The parser state variable makes a lot of sense to use.



    
    // possible seuqnce markers in the last byte...
    //  Need to handle that in theory and practise.
    const l = ta_data.length;



    let last_byte, current_byte;
    //let last_section_name, current_section_name;


    let byi_last_section, byi_current_section;
    //if (o_from_last_scan && o_from_last_scan.current_section_name) current_section_name = o_from_last_scan.current_section_name;
    const res = [];
    let i_section_in_data_chunk = 0;
    //const arr_section_markers = [];


    // Need to make better use of reading state variables.
    //  


    // Could have trouble with this??? When already in a DHT (or other?) need to read through its full length.



    const extract_section_markers = () => {
        console.log('extract_section_markers ta_data.length', ta_data.length);
        // And find escape characters.
        //  Find their indexes (up to 32 bit int???)
        // Escape positions array within each of the section markers would make sense.
        let byi;
        const res = [];

        let last_section_marker;


        let section_escape_byis = [];
        //   But want the escape byis within the specific sections.

        // A 'complete' property would be easier to put in place than finding incomplete ones.

        for (byi = 0; byi < l; byi++) {
            current_byte = ta_data[byi];
            //console.log('[byi, current_byte]', [byi, current_byte]);
            if (byi > 0) {
                // identify if a marker has been read.
                // deal with 255, 255...
                //  or is it 255, 0?
                // optional 0xFF fill bytes
                // current byte of 0 means escape???
                // Or stream gets escaped earlier on...?
                if (last_byte === 255) {
                    // 
                    // if (last_byte === 255 && current_byte !== 0)
                    if (current_byte === 0) {
                        // Probably need to escape this - but it's not within the DHT at least.
                        // Add to the array of escape positions.

                        //console.log('last_byte', last_byte);
                        //console.log('current_byte', current_byte);
                        //console.log('last_section_marker', last_section_marker);
                        // Don't know if it's an escape or not....
                        // Can we ignore it for now???
                        //console.log('current_section_name', current_section_name);
                        //console.log('byi_current_section', byi_current_section);

                        //console.log('byi', byi);

                        // Think this requires an escape here.
                        //  Not sure in all contexts though, like the Huffman Table binary.
                        // fill byte.????
                        // report the escape character...?

                        // A list of all escape BYIs???



                        section_escape_byis.push(byi);

                        //console.trace();
                        //throw 'NYI';
                        //console.log('(depending on parsing state??) repeating 255 characters - fill bytes... ???');
                    } else if (current_byte === 255) {
                        // fill byte.????
                        //console.trace();
                        //throw 'NYI';
                        console.log('(depending on parsing state??) repeating 255 characters - fill bytes... ???');
                    } else {

                        // Will need to complete the previous section even if we don't find the completion of the current one.

                        // It's a new section....
                        //console.log('[byi, current_byte, last_byte]', [byi, current_byte, last_byte]);
                        //console.log('[byi, last_byte, current_byte]', [byi, last_byte, current_byte]);
                        if (arr_jpeg_section_names[current_byte]) {
                            last_section_name = current_section_name;
                            current_section_name = arr_jpeg_section_names[current_byte];
                            byi_last_section = byi_current_section;
                            byi_current_section = byi - 1;
                            section_escape_byis = [];
                            

                            //console.log('1) last_section_name', last_section_name);
                            //console.log('2) current_section_name', current_section_name);

                            if (last_section_name && current_section_name) {
                                //console.log('last_section_name', last_section_name);
                                //console.log('current_section_name', current_section_name);
                                //console.log('1) last_section_marker', last_section_marker);
                                if (last_section_marker) last_section_marker.complete = true;
                                //console.log('2) last_section_marker', last_section_marker);

                                const o_section_marker = {
                                    name: last_section_name,
                                    byi_start: byi_last_section || 0,
                                    byi_end: byi_current_section,
                                    byi_data_end: byi_current_section,//,
                                    //escape_byis: section_escape_byis
                                };
                                if (section_escape_byis.length > 0) o_section_marker.escape_byis = new Uint32Array(section_escape_byis);
                                if (state.current_section_name && i_section_in_data_chunk === 0) {
                                    o_section_marker.continues_from_previous = true;
                                    o_section_marker.byi_data_start = 0;
                                } else {
                                    o_section_marker.byi_data_start = (byi_last_section || 0) + 2;
                                }
                                res.push(o_section_marker);
                                last_section_marker = o_section_marker;
                                // mark the last section complete now...?
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

        console.log('current_section_name', current_section_name);
        if (current_section_name) {
            console.log('3) last_section_marker', last_section_marker);
            if (last_section_marker) last_section_marker.complete = true;

            // ultimate? previous rather than last?
            const o_last_section = {
                name: current_section_name,
                byi_start: byi_current_section || 0,
                byi_end: l
            };

            if (section_escape_byis.length > 0) o_last_section.escape_byis = new Uint32Array(section_escape_byis);
            res.push(o_last_section);

            //res.o_for_next_scan = {
            //    current_section_name: current_section_name
            //}
        }
        return res;
    }
    //const arr_section_markers = 
    // change 255, 255 to 255 in the process.

    //  create a new JPEG chunk buffer in that case?
    //   mark the appearance of a 255, 255?
    //    would help to escape it faster later on.

    // Then the information to carry into the next scan call.
    
    res.arr_section_markers = extract_section_markers();

    if (current_byte === 255) {
        // a pending buffer / ta in the state object?
        // Not so sure about modifying the state here.
        //  May be OK?
        res.ta_carry_forward = new UInt8Array([current_byte]);
    }
    //console.log('res', res);
    //throw 'stop';
    return res;
}

module.exports = rs_scan;