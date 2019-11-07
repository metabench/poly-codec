// The base part of the codec system.

const {Evented_Class, tm, def, tf, clone, each} = require('lang-mini');
const {obs} = require('fnl');

//const {tm} = require('lang-mini');
const {parse_binary_by_type, read_ui16, identify_format, extract_input_sections, parse_sequence, attempt_read_sequence_from_rs_chunk} = require('./parse');


/*
    Notes
    Polycodec will be expanded so that it allows multiple codecs to be loaded that apply to the same objects.
    Will allow comparison of codecs.



    // add_encoder(format_name, encoder_name, fn_encoder);
    //  add_buffer_encoder
    //  add_stream_encoder

    // decoder etc...

    // can modify existing encoders / decoders so they parse the files properly.
    //  have problems right now with it.



    // .add_codec(format, codec_name, encoder, decoder)

    // .add_decoder(format, codec_name, fn_decode, options?)
    //   optionally say it accepts streams.

    // .add_fn_decode(format, codec_name, fn_decode);



*/


// Could use a Format_Info object.




class Poly_Codec extends Evented_Class {
    constructor(spec) {
        super(spec);
        const o_formats = {};
        const map_format_hex4sigs = {};

        this.add_format = (format_name) => {
            o_formats[format_name] = {
                'name': format_name,
                'decoders': {},
                'encoders': {}
            }

            // can have multiple encoders and decoders per format.
            //  some modes of usage will run 2 together for comparison.
            //   


        }
        this.has_format = format_name => !!o_formats[format_name];




        this.set_format_hex4sig = (format_name, str_hex4_sig) => {
            o_formats[format_name].sig = o_formats[format_name].sig || {};
            o_formats[format_name].sig.hex4 = str_hex4_sig;

            map_format_hex4sigs[str_hex4_sig] = format_name;
        }
        // allow different sigs for different versions?

        // list of priorities for the various codecs...?


        this.add_format_fn_decoder = (format_name, codec_name, fn_decode) => {
            // decoder function returns an observable?
            console.log('o_formats[format_name]', o_formats[format_name]);

            o_formats[format_name].decoders[codec_name] = fn_decode;
        }

        // the priorities of the codecs for the formats...
        //  


        this.add_format_version = (format_name, version_name) => {

        }
        // And different versions of a format part..

        this.add_format_part = (format_name, part_name, part_def) => {

            //console.log('format_name, part_name, part_def', [format_name, part_name, part_def]);
            //console.trace();
            //throw 'stop';
            o_formats[format_name].parts = o_formats[format_name].parts || {};
            part_def.name = part_name;
            //console.log('part_def', part_def);

            if (!def(part_def.length)) {
                if (part_def.hex_value) {

                    //console.log('part_def.hex_value', part_def.hex_value);

                    part_def.length = part_def.hex_value.length / 2;

                }
            }
            o_formats[format_name].parts[part_name] = part_def;
        }

        this.add_format_version_part = (format_name, part_name, version_name, part_def) => {
            // Should do some king of parsing / looking into signatures / match functions / read functions.
            console.trace();
            throw 'stop';
        }

        this.add_format_data_type = (format_name, type_name, type_def) => {
            o_formats[format_name].data_types = o_formats[format_name].data_types || {};
            o_formats[format_name].data_types[type_name] = type_def;
        }

        this.set_format_sequence = (format_name, sequence) => {
            // Main sequence that applies to the format.
            //  May be really simple, as the format is then subdivided by other logic.

            // And the format iteration system will make use of the data saved here.
            o_formats[format_name].sequence = sequence;
            // parse the sequence into objects that have their own helper functions?
            // Not so sure about the need to parse anything here.
        }

        this.use_format_part_caching = (format_name, part_name) => {
            o_formats[format_name].parts[part_name].use_caching = true;
            //o_formats[format_name].parts[part_name].cache = {};
        }

        this.add_format_part_item_length_calculator = (format_name, part_name, item_name, fn_calc_length) => {
            console.log('add_format_part_item_length_calculator [format_name, part_name, item_name, fn_calc_length]', [format_name, part_name, item_name, fn_calc_length]);
            console.log('o_formats[format_name].parts[part_name]', o_formats[format_name].parts[part_name]);

            o_formats[format_name].parts[part_name].part_item_length_calculators = o_formats[format_name].parts[part_name].part_item_length_calculators || {};
            o_formats[format_name].parts[part_name].part_item_length_calculators[item_name] = fn_calc_length;

            //console.trace();
            //throw 'stop';

        }

        const get_part_item_length_calculator = (format_name, part_name, item_name) => {
            return o_formats[format_name].parts[part_name].part_item_length_calculators[item_name];
        }

        // Section marker bytes look like the best way for JPEGs.
        //  And helps to make sense of the binary data as well, how it's specifically encoded into JPEGs. Maybe other formats?


        // section = part.

        const define_format_section_marker_byte = (format_name, hex_section_marker_byte, hex_next_byte_prevents_section_marker, map_next_next_byte_section_types) => {
            // Written with JPEG in mind.

            // Will enable fast scans for sections.
            //  Better than expecting them to be in a sequence.

            // Should not take all that longer to make the general purpose and specific instructions for decoding JPEGs and PNGs.
            //  Main thing will be plugging in the specific encoding / decoding / objects that get used in the encoding and decoding.

            // hex to number...

            let ui8_start = parseInt(hex_section_marker_byte, 16);
            let ui8_prevent = parseInt(hex_next_byte_prevents_section_marker, 16);

            o_formats[format_name].using_section_byte_markers = true;
            //o_formats[format_name].section_byte_markers = o_formats[format_name].section_byte_markers || new Array(256);
            
            o_formats[format_name].section_byte_markers = {
                start: ui8_start,
                prevent: ui8_prevent,
                next_byte_section_types: new Array(256)
            }

            /*
            ,
                next_byte_section_types: 
            */

            if (map_next_next_byte_section_types) {
                console.log('map_next_next_byte_section_types', map_next_next_byte_section_types);
                console.trace();
                // translate this byte value to number
                const nbsts = o_formats[format_name].section_byte_markers.next_byte_section_types;

                each(map_next_next_byte_section_types, (v, k) => {
                    const ui8_section_type = parseInt(k, 16);
                    console.log('ui8_section_type', ui8_section_type);
                    nbsts[ui8_section_type] = v;
                });
                console.log('nbsts', nbsts);
                //throw 'stop';
                //o_formats[format_name].section_byte_markers.map_next_next_byte_section_types
            }
        }
        this.define_format_section_marker_byte = define_format_section_marker_byte;

        // Separate encoders / decoders per format will be available (here)
        //  may make a gfx-mini version later on.

        // .codecs?
        // .encoders
        // .decoders





        this.set_format_fn_input_scan = (format_name, fn_scan) => {
            o_formats[format_name].using_fn_scan = true;
            o_formats[format_name].fn_scan = fn_scan;
        }

        this.add_format_part_decoder = (format_name, part_name, fn_decode) => {
            o_formats[format_name].part_decoders = o_formats[format_name].part_decoders || {};
            o_formats[format_name].part_decoders[part_name] = fn_decode;

        }
        // and different versions in some ways...?

        // add_format_decision?
        // add_format_varient.

        // Have it set up so that codecs get ordered by priority.
        //  Enable both codecs to be used side-by-side for testing in some instances.

        // May be worth modifying the existing encoder to create the Huffman table myself.
        //  Further work on that, making it fit within a streaming API would be very useful.
        //  See about expansion points from within that.

        this.decode = (rs) => {
            // check if it's a stream or a buffer.
            // Will identify parts..

            // Finite state machine here.
            return obs((next, complete, error) => {
                // Variables to do with the decoding state here.
                let byi_decode = 0;
                // Where it has decoded to so far.
                // Could know it's parsing items on different levels.
                //  Could do a parse of one format from inside another even.

                let byi_current_rs_chunk_start = 0;
                let byi_current_rs_chunk_end = 0;

                // just a byi_within_rs_chunk
                //  

                let byi_within_rs_chunk;



                let byi_current_item_start;
                let byi_current_item_end;

                let byi_next_item_start;
                let ta_current_rs_chunk;
                //  l_current_rs_chunk?



                let last_rs_chunk_length = 0;

                let i_chunk = 0;
                let i_part = 0;


                let expected_part_name, expected_part_def;
                //let next_part_name;

                let part_name;
                let use_part_caching = false;

                let format_name;
                let format_uses_byte_section_markers = false;
                let format_byte_section_markers;

                let format_sequence;

                let current_part_cache = {};
                // Will make use of simpler and more optimized ways to identify and extract sections from the stream.

                let using_fn_scan;

                //let buffer_left_over;
                let ta_carry_forward;

                let last_section_name;
                let format_part_decoders;



                // With JPEGs it's faster to scan and then pick out the specific items.
                const cache_part_item = (o_part_item) => {

                    //console.log('cache_part_item o_part_item', o_part_item);
                 
                    //console.log('part_name', part_name);
                    //console.log('i_part', i_part);

                    //console.trace();


                    //console.log('o_part_item', o_part_item);

                    const {item_name} = o_part_item;
                    //console.log('item_name', item_name);
                    current_part_cache[item_name] = o_part_item;
                }

                const get_cached_part_item = (item_name) => {
                    return current_part_cache[item_name];
                }

                // Have own buffer here? Or optional / temporary?
                //  Could have a buffer size where it always buffers 64K?

                // Not right now, raise the events as necessary.
                //  maybe recieve_chunk_part rather than buffering in the core part.

                // Look at the 4 byte sig from the very start of the data.
                //  Maybe 8 byte sig will be better in the future.

                // Maybe always buffer 1024 bytes?
                //  Not worth it right now. Proceed through the stream, raising events from the input.

                // Should fully load the header?

                // Own buffer for very small chunk sizes, if they happen...?

                const data_event = (name, value) => {
                    next({
                        'name': name,
                        'value': value
                    })
                }

                const set_format_name = str_name => {
                    format_name = str_name;

                    // Then setting up further things to do with the parsing?
                    //  Could try to interpret the first item within the format.

                    // see what part we expect...
                    format_sequence = o_formats[format_name].sequence;
                    console.log('format_sequence', format_sequence);

                    console.log('o_formats[format_name]', o_formats[format_name]);
                    //throw 'stop';

                    format_uses_byte_section_markers = !!o_formats[format_name].using_section_byte_markers;

                    if (o_formats[format_name].section_byte_markers) {
                        format_byte_section_markers = o_formats[format_name].section_byte_markers;
                    } else {
                        format_byte_section_markers = undefined;
                    }

                    using_fn_scan = !!o_formats[format_name].using_fn_scan;
                    format_part_decoders = o_formats[format_name].part_decoders || {};

                    data_event('set-format-name', str_name);

                }

                const starting_part = (str_part_name) => {
                    part_name = str_part_name;
                    current_part_cache = {};
                }

                const ending_part = (str_part_name) => {
                    current_part_cache = undefined;
                    part_name = undefined;
                    use_part_caching = false;
                    i_part++;
                }

                // Want to get JPEG right then make it work in some other formats too.
                //  There will be some similarities.
                //  JPEG could even be a type within another format (or within JPEG as the thumbnail).

                // There will also be the functionality to do with multiple incoming chunks.
                //  Probably worth buffering incomplete sections between the chunks, rather than raising events for partial sections.
                //   May depend on section length though.

                // Could have an option to send incomplete data.
                //  Or specify the buffering system.

                // Want to make it easy to plug in the decoders.
                //  Specific objects and specific types for specific formats.


                const identify_section_type_beginning_at_current_byi = () => {
                    if (format_uses_byte_section_markers) {
                        const {start, prevent, next_byte_section_types} = format_byte_section_markers;

                        //let tbyi = byi_within_rs_chunk;

                        if (ta_current_rs_chunk[byi_within_rs_chunk] === start && ta_current_rs_chunk[byi_within_rs_chunk + 1] !== prevent) {
                            const str_section_type = next_byte_section_types[ta_current_rs_chunk[byi_within_rs_chunk + 1]];
                            console.log('str_section_type', str_section_type);

                            if (str_section_type) {
                                return str_section_type;
                            }
                        }
                    } else {
                        console.trace();
                        throw 'NYI - Maybe we should not use identify_section_type_beginning_at_current_byi in this format?'
                    }
                }

                const peek_ahead_in_rs_chunk_to_next_section = () => {
                    // Should get some info on the next section.
                    if (format_uses_byte_section_markers) {
                        const {start, prevent, next_byte_section_types} = format_byte_section_markers;

                        let tbyi = byi_within_rs_chunk + 2;

                        const l = ta_current_rs_chunk.length - 1;
                        let found = false;

                        while (!found && tbyi < l) {
                            if (ta_current_rs_chunk[tbyi] === start && ta_current_rs_chunk[tbyi + 1] !== prevent) {
                                console.log('found start of new section at tbyi', tbyi);

                                if (next_byte_section_types[ta_current_rs_chunk[tbyi + 1]]) {
                                    console.log('next_byte_section_types[ta_current_rs_chunk[tbyi + 1]]', next_byte_section_types[ta_current_rs_chunk[tbyi + 1]]);
                                    found = true;

                                    const res = {
                                        byi_next_section: tbyi,
                                        section_type: next_byte_section_types[ta_current_rs_chunk[tbyi + 1]]
                                    }
                                    return res;




                                }
                            }
                            tbyi++;
                        }
                    } else {
                        console.trace();
                        throw 'NYI - Maybe we should not use peek_ahead in this format?'
                    }
                }
                // read_part???
                // Peek ahead?
                // Will use input_scan instead.
                

                const handle_part_read_from_rs_chunk = (ta_part) => {


                    const o_part = {
                        name: part_name,
                        ta_part: ta_part,
                        i_part: i_part
                    }

                    //if (use_part_caching) {
                    //    cache_part_item()
                   // }


                    data_event('read-part', o_part);

                    byi_next_item_start = byi_current_item_end;
                    byi_within_rs_chunk += ta_part.length;

                    // Check if the rs chunk is complete?

                    byi_current_item_start = undefined; //-1 may be more portable.
                    byi_current_item_end = undefined;
                    part_name = undefined;
                    i_part++;
                }

                // Chunk digestion method:

                //  A function digest_chunk.

                //  Reads through the chunk, looking for what it can extract.
                //   Could be recursive, acting on a subarry that excludes what it's already digested...?


                // Same / similar effect by using byte indexes within the chunk would be better.

                let chunk_digested = false;

                // Need to activate / parse / interpret / compile the sequence definition.

                

                const get_format_sequence_item_name = () => {
                    return format_sequence[i_part];
                }

                // identify_next_part_type

                // Better if it looks at the stream data rather than the expected item.
                //  Be more flexible with what the system expects, where possible.



                const peek_verify_read_part_parsed_sequence_item = (rs_chunk, parsed_item_def) => {

                    console.log('parsed_item_def', parsed_item_def);

                    if (parsed_item_def.length) {
                        if (parsed_item_def.hex_value) {
                            const byi_start = byi_within_rs_chunk;
                            const byi_end = byi_start + parsed_item_def.length;

                            if (byi_end < rs_chunk.length) {
                                const sa = rs_chunk.subarray(byi_start, byi_end);
                                console.log('sa', sa);
                                const sa_hex = hex(sa);
                                console.log('sa_hex', sa_hex);
                                if (sa_hex === parsed_item_def.hex_value) {
                                    return true;
                                } else {
                                    return false;
                                }  
                            } else {
                                console.trace();
                                throw 'Out of bounds read attempt';
                            }
                            

                        } else {
                            console.trace();
                            throw 'NYI';
                        }
                    } else {
                        console.trace();
                        throw 'NYI';
                    }
                }


                // Won't rely on sequences so much at this level.
                //  Will extract the sequence data from it's chunk, then parse it.

                

                

                // make this the old digest function.

                // will make a new version that is based around markers and scans.
                //  this is going to be optimized for JPEGs. It may be useful for other types.

                // Sequences will be read once the part has been identified / the data provided.

                // Need correct handling of chunk overlaps etc.
                //  When marker the last byte, better to add it to the buffer that gets joined before the beginning of the next chunk data.

                

                let o_for_next_scan;



                const recieve_binary_data = rs_chunk => {
                    ta_current_rs_chunk = rs_chunk;
                    byi_within_rs_chunk = 0;
                    byi_current_rs_chunk_start += last_rs_chunk_length;
                    byi_current_rs_chunk_end += rs_chunk.length;

                    // Use the new data scan specific to the format now.
                    console.log('i_chunk', i_chunk);
                    console.log('rs_chunk.length', rs_chunk.length);

                    if (i_chunk === 0) {
                        // A first chunk specific function.
                        //recieve_first_binary_data(rs_chunk);

                        const identified_format = identify_format(rs_chunk, map_format_hex4sigs);

                        console.log('identified_format', identified_format);

                        if (identified_format) {
                            set_format_name(identified_format);
                        } else {
                            console.trace();
                            throw 'Format identification failed';
                        }
                    }

                    // Then put it into the scan function.
                    //  The scan function will also identify the signature of the file, but could do so in more detail than just looking at the first 4 bytes.
                    /*


                    if (i_chunk === 0) {
                        // A first chunk specific function.
                        recieve_first_binary_data(rs_chunk);



                    } else {
                        recieve_subsequent_binary_data(rs_chunk);
                    }
                    */

                    //console.log('using_fn_scan', using_fn_scan);

                    if (using_fn_scan) {
                        console.log('using_fn_scan');

                        // Maybe raising events as soon as it discovers anything would be more effective?
                        //  Data could then be extracted more quickly and sent to the processor.

                        // The scan function could return an observable.
                        //  But returning an array with info on the parts and their byte indexes would work well.

                        // [part_name, byi_start, byi_end?]

                        let ta_data_to_use;

                        if (ta_carry_forward) {
                            ta_data_to_use = new rs_chunk.constructor(ta_carry_forward.length + rs_chunk.length);
                            ta_data_to_use.set(ta_carry_forward, 0);
                            ta_data_to_use.set(rs_chunk, ta_carry_forward.length);
                        } else {
                            ta_data_to_use = rs_chunk;
                        }

                        console.log('rs_chunk', rs_chunk);
                        console.log('format_name', format_name);
                        console.log('o_for_next_scan', o_for_next_scan);


                        const res_scan = o_formats[format_name].fn_scan(ta_data_to_use, o_for_next_scan);
                        // JPEG not using CRC checks anyway.

                        // have byi_data_start
                        //  byi_data_end

                        console.log('res_scan', res_scan);
                        //console.trace();
                        //throw 'stop';


                        if (res_scan) {

                            o_for_next_scan = res_scan.o_for_next_scan;


                            // then can extract the part tas, and raise separate events...
                            //  could raise the parse events all at once.
                            //   makes sense speed-wise.
                            // extracted sections.

                            const arr_extracted_sections = extract_input_sections(ta_data_to_use, res_scan.arr_section_markers);
                            console.log('arr_extracted_sections', arr_extracted_sections);
                            
                            let byi = 0;
                            each(arr_extracted_sections, extracted_section => {
                                console.log('extracted_section', extracted_section);
                                byi = extracted_section.byi_data_start;
                                //console.log('extracted_section.name', extracted_section.name);

                                if (format_part_decoders[extracted_section.name]) {
                                    //console.log('have part decoder ' + extracted_section.name);

                                    const decoded_part = format_part_decoders[extracted_section.name](extracted_section.data, byi);
                                    //console.log('decoded_part', decoded_part);

                                    //console.trace();
                                    //throw 'stop';

                                } else {
                                    console.log('lacks decoder for part ' + extracted_section.name);
                                }
                            });

                            //console.trace();
                            //throw 'stop';


                            data_event('sections-data', {data: arr_extracted_sections});

                            // find the first sections...

                            // is the first section a continuation from the others?

                            // The full and partial organisation may not be best.

                            // or need to better work out which of them continues from before?
                            //  would be better just to have them in sequential order and not split into full, partial.


                            // .continued_from_prev
                            // .full
                            // .continued_to_next





                            // Can decode the sections when they are ready.
                            //  Or before they are ready in some cases.

                            // then run the decoders on that section data.

                            ta_carry_forward = res_scan.ta_carry_forward;

                        } else {
                            console.trace();
                            throw 'Expected: res_scan';
                        }
                        //console.log('res_scan', res_scan);

                        //console.trace();
                        //throw 'stop';

                    } else {
                        console.trace();
                        throw 'NYI';
                    }

                    // What to do depends on what we are expecting next.
                    byi_current_rs_chunk_end += rs_chunk.length;
                    last_rs_chunk_length = rs_chunk.length;
                    i_chunk++;
                }

                rs.on('data', rs_chunk => {
                    //console.log('rs_chunk', rs_chunk);
                    recieve_binary_data(new Uint8Array(rs_chunk));
                    // Then we need to treat this as data coming into the finite state machine.
                })
            })
        }
    }
}

Poly_Codec.parse_binary = (ta, schema_def) => {
    // parse the schema def...
    //  should be parsed already?

    //console.log('schema_def', schema_def);

    const parsed_sequence = parse_sequence(schema_def);
    //console.log('parsed_sequence', parsed_sequence);

    //console.log('ta', ta);

    // could go through it parsing and extracting item by item from the input.

    const parsed_ta = attempt_read_sequence_from_rs_chunk(ta, parsed_sequence);

    return parsed_ta;

    // parse it to a map object, with different variables / values there?
    //console.log('parsed_ta', parsed_ta);
    // then go through the ta, parsing the individual items.

    //work out where they start and finish.

    // parsing to an object would work best.

    //console.trace();
    //throw 'stop';
}


module.exports = Poly_Codec;
