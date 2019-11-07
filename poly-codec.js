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

        this.decode = (rs) => {
            return obs((next, complete, error) => {
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
                    //format_sequence = o_formats[format_name].sequence;
                    //console.log('format_sequence', format_sequence);

                    //console.log('o_formats[format_name]', o_formats[format_name]);
                    //throw 'stop';

                    /*

                    format_uses_byte_section_markers = !!o_formats[format_name].using_section_byte_markers;

                    if (o_formats[format_name].section_byte_markers) {
                        format_byte_section_markers = o_formats[format_name].section_byte_markers;
                    } else {
                        format_byte_section_markers = undefined;
                    }
                    using_fn_scan = !!o_formats[format_name].using_fn_scan;
                    format_part_decoders = o_formats[format_name].part_decoders || {};
                    */
                    data_event('set-format-name', str_name);
                }

                /*

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
                */

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

                /*

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
                */
                // read_part???
                // Peek ahead?
                // Will use input_scan instead.

                /*

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

                */


                // Won't rely on sequences so much at this level.
                //  Will extract the sequence data from it's chunk, then parse it.

                

                

                // make this the old digest function.

                // will make a new version that is based around markers and scans.
                //  this is going to be optimized for JPEGs. It may be useful for other types.

                // Sequences will be read once the part has been identified / the data provided.

                // Need correct handling of chunk overlaps etc.
                //  When marker the last byte, better to add it to the buffer that gets joined before the beginning of the next chunk data.

                

                let o_for_next_scan;

                let byi_within_rs_chunk, byi_current_rs_chunk_start, byi_current_rs_chunk_end;
                let last_rs_chunk_length;
                let i_chunk = 0;

                let format_name;

                let ta_unprocessed;


                // Different codec modes...
                //  Does the codec support streaming?

                // See if the codec supports an input stream.
                //  could be true or false.

                // Once the format has been detected, we need to choose the codec.

                let fn_decode;
                let fn_decode_supports_stream_input;
                const chunks = [];


                const recieve_binary_data = rs_chunk => {

                    //ta_current_rs_chunk = rs_chunk;
                    byi_within_rs_chunk = 0;
                    byi_current_rs_chunk_start += last_rs_chunk_length;
                    byi_current_rs_chunk_end += rs_chunk.length;

                    // Use the new data scan specific to the format now.
                    console.log('i_chunk', i_chunk);
                    console.log('rs_chunk.length', rs_chunk.length);

                    // Only processing it as a sinlge buffer...?
                    //  Not as good as streaming input but may be necessary to start with.




                    if (i_chunk === 0) {
                        // A first chunk specific function.
                        //recieve_first_binary_data(rs_chunk);
                        const identified_format = identify_format(rs_chunk, map_format_hex4sigs);

                        //console.log('identified_format', identified_format);

                        if (identified_format) {

                            // Select the decoder.

                            const format_decoders = o_formats[identified_format].decoders;

                            const decoder0 = Object.entries(format_decoders)[0];
                            //console.log('decoder0', decoder0);
                            const [decoder_name, _fn_decode] = decoder0;

                            //console.log('_fn_decode', _fn_decode);
                            //console.log('_fn_decode.supports_stream_input', _fn_decode.supports_stream_input);

                            fn_decode = _fn_decode;
                            fn_decode_supports_stream_input = !!_fn_decode.supports_stream_input;


                            //console.log('format_decoders', format_decoders);


                            set_format_name(identified_format);

                            
                        } else {
                            console.trace();
                            throw 'Format identification failed';
                        }
                    }

                    // then send it to the decoder.
                    //  if the decoder can only handle buffers?

                    if (fn_decode_supports_stream_input) {

                    } else {
                        chunks.push(rs_chunk);
                    }




                    // What to do depends on what we are expecting next.
                    byi_current_rs_chunk_end += rs_chunk.length;
                    last_rs_chunk_length = rs_chunk.length;
                    i_chunk++;
                }

                function concatenate(resultConstructor, arrays) {
                    let totalLength = 0;
                    //console.log('arrays', arrays);
                    for (let arr of arrays) {
                        //console.log('arr.length', arr.length);
                        totalLength += arr.length;
                    }
                    let result = new resultConstructor(totalLength);
                    let offset = 0;
                    for (let arr of arrays) {
                        result.set(arr, offset);
                        offset += arr.length;
                    }
                    return result;
                }

                const end_binary_stream = () => {

                    if (fn_decode_supports_stream_input) {

                    } else {
                        //console.log('chunks', chunks);
                        const ta_all = concatenate(Uint8Array, chunks);
                        //console.log('ta_all', ta_all);

                        const decoded = fn_decode(ta_all);

                        // Do we get an observable or a stream back?
                        //  Observable is more flexible / powerful.

                        //const td = tf(decoded);
                        //console.log('type of decoded', td);


                        //console.log('decoded', decoded);
                        //console.log('decoded.data.length', decoded.data.length);

                        // metadata frames produced by observable, as well as data frames?

                        complete(decoded);


                    }

                }

                rs.on('data', rs_chunk => {
                    //console.log('rs_chunk', rs_chunk);
                    recieve_binary_data(new Uint8Array(rs_chunk));
                    // Then we need to treat this as data coming into the finite state machine.
                })

                rs.on('end', () => {
                    console.log('rs_chunk ended');
                    end_binary_stream();
                    
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
