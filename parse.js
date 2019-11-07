const {Evented_Class, tm, def, tf, clone, each} = require('lang-mini');


const read_ui16 = (ta, pos) => ta[pos] * 256 + ta[pos+1];


const parse_binary_by_type = (binary, str_type) => {
    console.log('str_type', str_type);
    console.log('binary', binary);
    if (str_type === 'ui8') {
        return binary[0];
    } else if (str_type === 'ui16') {
        return binary[0] * 256 + binary[1];
    } else if (str_type === 'string') {
        return new TextDecoder("utf-8").decode(binary);
    } else {
        
        console.trace();
        throw 'NYI';
    }
}

const byteToHex = [];

for (let n = 0; n <= 0xff; ++n) {
    const hexOctet = n.toString(16).padStart(2, "0");
    byteToHex.push(hexOctet);
}

const hex = ta => {
    //const buff = new Uint8Array(arrayBuffer);
    const hexOctets = [], l = ta.length; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()
    for (let i = 0; i < l; ++i) hexOctets.push(byteToHex[ta[i]]);
    return hexOctets.join('');
}

const str_is_bracketed = str => str[0] === '(' && str[str.length - 1] === ')';
// str is hex?
//  assume it is?
const map_hex_chars = tm(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
//console.log('map_hex_chars', map_hex_chars);
const is_str_hex = str => {
    let c = 0;
    const l = str.length;
    while (c < l) {
        if (!map_hex_chars[str[c++]]) return false;
    }
    return true;
}
const str_remove_outer_chars = str => str.substr(1, str.length - 2);
// test if it's a number...
const is_number = obj => typeof obj === 'number';

const str_starts_with_and_the_rest = (str, search) => {
    if (str.substring(0, search.length) === search) return str.substring(search.length);
    return false;
}

const map_type_lengths = {
    'ui8': 1,
    'ui16': 2,
    'ui32': 4,
    'i8': 1,
    'i16': 2,
    'i32': 4
}

// These sequence items can be inside a section.
//  Want to be able to parse a sequence from binary.

const parse_sequence = (sequence) => {
    return sequence.map(i => parse_sequence_item(i));
}


// extract_between_strs

const extract_before_and_int_between_strs = (source, marker1, marker2) => {
    const pos1 = source.indexOf(marker1);
    if (pos1 > -1) {
        const pos2 = source.indexOf(marker2, pos1 + marker1.length);
        if (pos2 > -1) {
            return [source.substring(0, pos1), parseInt(source.substring(pos1 + marker1.length, pos2), 10)];
        }
    }
}

const extract_type_name_and_length = str_type => extract_before_and_int_between_strs(str_type, '[', ']');


const parse_sequence_item = (sequence_item) => {

    // Is this part using caching?

    const tsi = tf(sequence_item);
    console.log('tsi', tsi);

    

    if (tsi === 'o') {
        const tm_item_keys = tm(Object.keys(sequence_item));
        console.log('tm_item_keys', tm_item_keys);
        const res = clone(sequence_item);

        // parse the type...
        //  type has length
        
        // extract type name and length

        if (tm_item_keys.type) {
            const stype = sequence_item.type;
            console.log('stype', stype);

            const tal = extract_type_name_and_length(stype);
            console.log('tal', tal);

            if (tal) {
                res.type = tal[0];
                res.length = tal[1];
            }

            // is the length contained in square brackets?

            // type format?
            //  could check the string type format?

            // or extract its type name and the length...?
            // type_contains_length?

            // extract type from the length.

        }


        //get_type_name_and_length();


        if (tm_item_keys.hex_value) {
            if (!tm_item_keys.length) {
                res.length = sequence_item.hex_value.length / 2;
            }
        } else {


        }
        return res;
        
    } else if (tsi === 's') {
        console.log('sequence_item', sequence_item);

        // does the string make use of type[length] notation?

        if (str_is_bracketed(sequence_item)) {
            const si_inner = str_remove_outer_chars(sequence_item);
            console.log('si_inner', si_inner);

            const cs_inner = si_inner.split(', ').join(',').split(',');
            console.log('cs_inner', cs_inner);
            if (cs_inner.length === 1) {
                const str_single_param = cs_inner[0];
                const ss_sip = str_single_param.split(' ');
                if (ss_sip.length === 2) {
                    console.log('ss_sip', ss_sip);

                    const [str_type, param_name] = ss_sip;
                    const etl = extract_type_name_and_length(str_type);
                    //let type_name;


                    const res = {
                        
                        name: param_name
                    }
                    if (etl) {
                        res.type = etl[0];
                        res.length = etl[1]
                    } else {
                        res.type = str_type;
                    }

                    if (!res.length && map_type_lengths[res.type]) res.length = map_type_lengths[res.type];


                    return res;
                } else {
                    console.trace();
                    throw 'NYI';
                }
            } else {
                console.trace();
                throw 'NYI';
            }

        }
    }
}


// Have mathematical / pure functions that produce the parsing output.



const identify_format = (ta_first_chunk, map_format_names_by_hex4) => {
    const hex4 = hex(ta_first_chunk.subarray(0, 4));

    console.log('identify_format', identify_format);
    console.log('hex4', hex4);

    if (map_format_names_by_hex4[hex4]) return map_format_names_by_hex4[hex4];
}

const extract_input_sections = (ta_data_to_use, arr_section_markers) => {
    // full sections, partial sections.

    

    const res = [];
    const l = arr_section_markers.length;
    //console.log('arr_section_markers.length', arr_section_markers.length);
    if (arr_section_markers.length === 0) {
        // single continuation...

        res.push({
            byi_start: 0,
            byi_end: ta_data_to_use.length,
            data_length: ta_data_to_use.length,
            continuation_from_prev: true,
            continues_to_next: true
        });
    } else if (arr_section_markers.length === 1) {
        res.push(Object.assign({data: ta_data_to_use.subarray(arr_section_markers[0].byi_data_start), partial: true, continues_to_next: true}, arr_section_markers[0]));
    } else {
        for (let i_marker = 0; i_marker < l; i_marker++) {
            const {name, byi_data_start, byi_data_end} = arr_section_markers[i_marker];
            let l;
            if (def(byi_data_start) && def(byi_data_end)) {
                l = byi_data_end - byi_data_start;
            }

            //const 
            //console.log('l', l);

            // Partial, or that it continues from the previous?

            const o_res = {
                name: name
            };
    
            if (byi_data_end && !arr_section_markers[i_marker].partial) {
                //res.push(Object.assign(o_res, {data: ta_data_to_use.subarray(byi_data_start, byi_data_end), data_length: l}, arr_section_markers[i_marker]));
                o_res.data = ta_data_to_use.subarray(byi_data_start, byi_data_end);
            } else {
                //res.push(Object.assign(o_res, {data: ta_data_to_use.subarray(byi_data_start), partial: true, continues_to_next: true, data_length: l}, arr_section_markers[i_marker]));
                o_res.data = ta_data_to_use.subarray(byi_data_start);
                Object.assign(o_res, {partial: true, continues_to_next: true})
            }

            if (def(l)) {
                o_res.data_length = l;
            }

            res.push(o_res);
        }
    }
    return res;
}

const attempt_read_binary_from_rs_chunk_by_length = (rs_chunk, byi_within_rs_chunk, length) => {
    const read_start = byi_within_rs_chunk;
    const read_end = read_start + length;

    if (read_start > rs_chunk.length || read_end > rs_chunk.length) {
        console.trace();

        console.log('read_start', read_start);
        console.log('read_end', read_end);
        console.log('rs_chunk', rs_chunk);
        throw 'Out of bounds error'
    } else {
        const res = rs_chunk.subarray(read_start, read_end);

        byi_within_rs_chunk += length;
        return res;
    }

}



const attempt_read_item_from_rs_chunk = (rs_chunk, byi_within_rs_chunk, def_item) => {

    //console.log('attempt_read_item_from_rs_chunk byi_within_rs_chunk', byi_within_rs_chunk);
    //console.trace();
    const parsed_item = parse_sequence_item(def_item);
    //console.log('parsed_item', parsed_item);

    //const tm_item_keys = tm(Object.keys(def_item));
    //console.log('tm_item_keys', tm_item_keys);

    // use the parsed item - its' going to be an object.

    if (def(parsed_item.length)) {


        if (parsed_item.length === 0) {
            console.log('parsed_item.length === 0');
            return undefined;
        } else {
            const item_data = attempt_read_binary_from_rs_chunk_by_length(rs_chunk, byi_within_rs_chunk, parsed_item.length);
            console.log('item_data', item_data);

            if (parsed_item.hex_value) {
                const item_data_hex = hex(item_data);
                console.log('item_data_hex', item_data_hex);
                console.log('parsed_item.hex_value', parsed_item.hex_value);
                if (item_data_hex === parsed_item.hex_value) {
                    console.log('the hex matches the expected value');

                    // raise the event saying the read has succeeded.

                    // read-part-sequence-value
                    const res = {
                        part_name: part_name,
                        item_name: parsed_item.name,
                        value: item_data,
                        hex_value: item_data_hex
                    }

                    //data_event('read-part-item', res);
                    return res;
                }
            } else {
                if (def(item_data)) {
                    // Its value needs to be parsed / calculated / interpreted.

                    console.log('parsed_item', parsed_item);
                    // parse_binary_by_type

                    const parsed_value = parse_binary_by_type(item_data, parsed_item.type);
                    console.log('parsed_value', parsed_value);

                    const res = {
                        //part_name: part_name,
                        item_name: parsed_item.name,
                        data: item_data,
                        value: parsed_value,
                        length: parsed_item.length,
                        type: parsed_item.type
                    }
                    //data_event('read-part-item', res);
                    return res;
                }
            }
        }

        // read binary from rs chunk by length
        
    } else {

        // is it the last item in the chunk?
        //  Can we assume it's length is 'the rest'?
        //   Could use a length calculator function. Possibly earlier.

        // We can look to see if there is a length calculator for this part.

        // No length given...?

        const fnlc = get_part_item_length_calculator(format_name, part_name, parsed_item.name);
        //console.log('fnlc', fnlc);
        //console.log('current_part_cache', current_part_cache);


        if (fnlc) {
            const l = fnlc(current_part_cache);
            //console.log('l', l);

            if (l === 0) {
                // skip this item, nothing to read / read it as length 0.
                //  no data / empty ta data / undefined data?

                // / null data / value?

                return undefined;

            } else {

                console.trace();
                throw 'NYI';

            }

        } else {
            console.trace();
            throw 'NYI';
        }

        //console.trace();

        // Some jpeg / format specific system to calculate / derive values?
        //  Values which are to be used by the core algorithm.?

        // Need to be able to calculate the length of the part, given data that is provided with data specific to that format.
        //  So when it reads some data, when in a specific format, it will then interpret it / calculate other necessary data.

        // Needs to add some 'derived value' calculations.
        //  meaning it can calculated some vales from other values.

        // Something further in the JPEG setup so that once it has the JFIF APP0 part_length_from_here it will be able to calculate the length of the thumbnail item.

        // Or a feature where the length of the thumbnail item is given as a JS function.

        //throw 'NYI';
    }
}



const attempt_read_sequence_from_rs_chunk = (rs_chunk, def_sequence) => {
    // want to use the parsed sequence instead.

    //console.log('attempt_read_sequence_from_rs_chunk');
    //console.log('def_sequence', def_sequence);
    //console.log('rs_chunk', rs_chunk);
    //console.log('rs_chunk.length', rs_chunk.length);

    //console.trace();
    //throw 'stop';


    const l_sequence = def_sequence.length;
    let i_sequence = 0;

    let def_item = def_sequence[i_sequence];

    let byi = 0;

    //console.log('def_item', def_item);
    const o_first_item = attempt_read_item_from_rs_chunk(rs_chunk, byi, def_item);
    //console.log('o_first_item', o_first_item);


    if (o_first_item.length) {
        byi += o_first_item.length;
    } else {
        console.trace();
        throw 'NYI';
    }

    const res = {};
    

    

    // then put the item into the cache if use_part_caching

    /*
    if (use_part_caching) {
        console.log('use_part_caching', use_part_caching);
        cache_part_item(o_first_item);

    }
    */


    //console.trace();
    //throw 'stop';

    if (o_first_item) {
        i_sequence++;

        // Continue to read the sequence...

        while (i_sequence < l_sequence) {

            let def_item = def_sequence[i_sequence];

            // and need to advance they byte index within the sequence.
            //console.log('def_item', def_item);

            //console.log('byi', byi);

            // does it have length set?

            //console.log('def_item', def_item);

            //console.trace();
            let o_item;

            if(def_item.length) {
                o_item = attempt_read_item_from_rs_chunk(rs_chunk, byi, def_item);
            } else {

                if (i_sequence === l_sequence - 1) {
                    //console.log('i_sequence === l_sequence - 1', i_sequence === l_sequence - 1);
                    def_item.length = rs_chunk.length - byi;
                    o_item = attempt_read_item_from_rs_chunk(rs_chunk, byi, def_item);
                } else {
                    console.trace();
                    throw 'NYI';
                }

                
            }
            console.log('o_item', o_item);

            if (def(o_item)) {
                if (o_item.length) {
                    byi += o_item.length;
                } else {
                    
                }
                res[o_item.item_name] = o_item;
            }

            

            /*

            if (def(o_item)) {
                if (use_part_caching) {
                    //console.log('use_part_caching', use_part_caching);
                    cache_part_item(o_item);
                    //console.log('current_part_cache', current_part_cache);
                }
            }

            */

            

            //console.trace();
            //throw 'stop';


            i_sequence++;
        }
        return res;
    }

}



module.exports = {
    parse_binary_by_type: parse_binary_by_type,
    read_ui16: read_ui16,
    identify_format: identify_format,
    extract_input_sections: extract_input_sections,
    parse_sequence: parse_sequence,
    attempt_read_sequence_from_rs_chunk: attempt_read_sequence_from_rs_chunk
}