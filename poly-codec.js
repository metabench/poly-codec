// The base part of the codec system.

const {Evented_Class, tm, def, tf, clone, each} = require('lang-mini');
const {obs} = require('fnl');

//const {tm} = require('lang-mini');
const {fn_parse_from_oo_type_def, parse_binary_by_type, read_ui16, identify_format, extract_input_sections, parse_sequence, attempt_read_sequence_from_rs_chunk} = require('./parse');


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


        // Format decoders
        //  Then sub-decoders
        //  Scanners / recognisers / metadata parsers
        //   Deeper parsing / decoding.

        // New API...
        //  Decoding binary items (where we already have info on them?)

        // Outline reader / parser
        //  Definitely want more of a general and platform level parser / scanner.
        //  Needs to be able to handle the ends / crossings of recieved chunks.
        //   Different ways to solve this problem.

        // Easiest way so far:
        //  Platform: make API that makes dealing with / identifying completed / incomplete blocks easier.
        //   Event based system makes sense, as recieving and completing interpreation are events.



        // Lets have many of the functions used written in other files, named in accordance with what they do, and referred to here.





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
        // The full decoder function. Useful when we have a non-polycodec function to load and use.
        //  A Format class could make sense.
        //   Help to make sense of the data coming in.

        // And / or combination of object descriptions.
        //  Polycodec holds / uses the object descriptions.
        
        // Format_Binary_Object
        //  Name / code
        //  Signature
        //  Structure

        // Format_Binary_Object such as Huffman_Tree? Or that's the bridge between the JPEG encoded Huffman Tree and a Huffman Tree with general principles.



        // Poly_Codec will hold a bunch of encoding and decoding mechanisms.
        //  Patterns / objects...

        // Serialization and deserialization as well - that's often what happens.

        // Define the object / subobject / subsubobject spec / def. Then generate encode and decode functions from that.

        this.set_format_fn_input_scan = (format_name, fn_scan) => {
            o_formats[format_name].using_fn_scan = true;
            o_formats[format_name].fn_scan = fn_scan;
        }

        // Escape only goes with scan?
        //  Will adapt it to suit more formats, but need a simple api.
        //   escape_hints object would be more flexible API.
        //    hints not quite right.
        //   prepared_escape_info
        //   escape_helpful_info
        //   obj_help_escape


        this.set_format_fn_escape = (format_name, fn_escape) => {
            //console.trace();
            //console.log('fn_escape', fn_escape);
            //throw 'stop';
            o_formats[format_name].fn_escape = fn_escape;
        }


        this.set_format_section_type_defs = (format_name, section_type_defs) => {
            o_formats[format_name].section_type_defs = section_type_defs;

        }

        this.set_format_section_decoder_fns = (format_name, section_decoder_fns) => {
            o_formats[format_name].section_decoder_fns = section_decoder_fns;
        }

        this.set_format_section_classes = (format_name, section_classes) => {
            o_formats[format_name].section_classes = section_classes;
        }

        // section_classes




        // Different levels of parsing and processing.
        //  Will use the whole OO sections and types definition classes and automatically generated section level0 parsing functions.
        //  Use automated parsing first, then get into more specific decoding, much of which will be handled by general purpose data structures (eg Huffman Tree) with necessary wrapping / mode selection / extension.

        // The format binary object parsing needs to be set up using the definition classes / instances of them.






        // set_format_section_fn_parse???




        // the priorities of the codecs for the formats...
        //  


        this.add_format_version = (format_name, version_name) => {

        }
        // And different versions of a format part..

        this.decode = (rs) => {
            return obs((next, complete, error) => {

                let using_fn_scan, fn_scan, section_type_defs, section_decoder_fns, section_classes;

                const data_event = (name, value) => {
                    next({
                        'name': name,
                        'value': value
                    })
                }

                const set_format_name = str_name => {

                    console.log('set_format_name', str_name);

                    format_name = str_name;

                    // maybe do need to set local using_fn_scan variable.
                    //  and then the function itself.
                    using_fn_scan = !!o_formats[format_name].using_fn_scan;

                    if (using_fn_scan) {
                        fn_scan = o_formats[format_name].fn_scan;
                    } else {
                        fn_scan = undefined;
                    }

                    //console.log('fn_scan', fn_scan);

                    fn_escape = o_formats[format_name].fn_escape;


                    section_type_defs = o_formats[format_name].section_type_defs;

                    // Create the decode function(s) from the type defs...

                    // Or would be available before?
                    //  Pre-made?

                    section_decoder_fns = o_formats[format_name].section_decoder_fns;

                    section_classes = o_formats[format_name].section_classes || {};

                    


                    //


                    //console.log('section_type_defs', section_type_defs);
                    //console.log('section_decoder_fns', section_decoder_fns);

                    //console.trace();
                    //throw 'stop';




                    // definitions of the sections....
                    //  this will be quite a clever part.
                    //  have some 2-way uses.

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
                let byi_within_rs_chunk, byi_current_rs_chunk_start = 0, byi_current_rs_chunk_end = 0;
                let last_rs_chunk_length = 0;
                let i_chunk = 0;

                let format_name;
                let ta_unprocessed;


                // Different codec modes...
                //  Does the codec support streaming?

                // See if the codec supports an input stream.
                //  could be true or false.

                // Once the format has been detected, we need to choose the codec.

                let fn_decode, fn_escape;
                let fn_decode_supports_stream_input;
                const chunks = [];
                // maintain the 'state' object.
                const state = {};


                const section_parsed = item => {

                    //console.log('section parsed', item);
                    //console.log('item.name', item.name);
                    //console.log('item.items', item.items);
                    //console.log('item.items.length', item.items.length);

                    data_event('section-parsed', item);



                }


                const recieve_binary_data = rs_chunk => {



                    //ta_current_rs_chunk = rs_chunk;
                    byi_within_rs_chunk = 0;
                    byi_current_rs_chunk_start += last_rs_chunk_length;
                    byi_current_rs_chunk_end += rs_chunk.length;

                    // Use the new data scan specific to the format now.
                    console.log('i_chunk', i_chunk);
                    console.log('rs_chunk.length', rs_chunk.length);

                    state.i_chunk = i_chunk;
                    state.offset_chunk = byi_current_rs_chunk_start;
                    state.l_chunk = rs_chunk.length;

                    // Only processing it as a sinlge buffer...?
                    //  Not as good as streaming input but may be necessary to start with.

                    // Different if using_fn_scan - but need to see where to incorparate / change to that scanning fn.

                    if (i_chunk === 0) {
                        // A first chunk specific function.
                        //recieve_first_binary_data(rs_chunk);
                        const identified_format = identify_format(rs_chunk, map_format_hex4sigs);
                        console.log('identified_format', identified_format);
                        if (identified_format) {
                            // Select the decoder.
                            const format_decoders = o_formats[identified_format].decoders;
                            console.log('Object.entries(format_decoders)', Object.entries(format_decoders));
                            const decoder0 = Object.entries(format_decoders)[0];

                            // Decoder would / should have been generated?
                            //  Do want to get a streaming decode function...
                            //  
                            // These decoders could be full-function decoders, not closely integrated poly-codec decoding.
                            if (decoder0) {
                                console.log('decoder0', decoder0);
                                const [decoder_name, _fn_decode] = decoder0;

                                //console.log('_fn_decode', _fn_decode);
                                //console.log('_fn_decode.supports_stream_input', _fn_decode.supports_stream_input);

                                fn_decode = _fn_decode;
                                fn_decode_supports_stream_input = !!_fn_decode.supports_stream_input;
                            } else {
                                console.log('No (full?) decoder declared for format ' + identified_format + ', will use polycodec-integrated decoding if available.');
                            }

                            // But if we have not been given a 'fn_decode'?
                            //  'fn_decode' is a simple interface. Polycodec will do some parsing and decoding tasks itself, and coordinate them with an expandable and simple API.
                            //console.log('format_decoders', format_decoders);
                            set_format_name(identified_format);
                        } else {
                            console.trace();
                            throw 'Format identification failed';
                        }
                    }

                    // then send it to the decoder.
                    //  if the decoder can only handle buffers?

                    if (using_fn_scan) {
                        //console.log('using_fn_scan', using_fn_scan);

                        // Run the recieved chunk through the scan function.
                        // state needs to include offset(s?)?
                        //  offsets from the start of data (file or stream) will help too.

                        // The scan function should definitely identify escape positions.
                        //  Possibly - no escaping needed while in some states, like reading the binary Huffman data?
                        //   Did not see any other codebases escaping this.
                        //    Check the marker / escape rules. Probably / likely where the Huffman decoding previously went wrong.

                        const res_scan = fn_scan(rs_chunk, state);
                        // the scan will have the characters to escape.
                        //  an array of escape positions?

                        console.log('typeof res_scan', typeof res_scan);

                        const {escape_positions, arr_section_markers} = res_scan;
                        //console.log('escape_positions', escape_positions);
                        // then run the escapes using the escape positions, along with extraction into single buffers...?
                        //  and can use subarray where there are no escapes.
                        //   can't splice out the escapes though. quickly reconstruct a smaller ta makes sense? or shifting...?
                        //console.log('res_scan', res_scan);
                        // Remember - event driven decode will work well.
                        // event 'rchunk-scan-complete' ...

                        // Not complete until it's been escaped?
                        data_event('chunk-scan-complete', res_scan);
                        // chunk-scanned?

                        // .tbc property. to be continued.
                        // poly_decode_chunk_from_scan???

                        const l_asm = arr_section_markers.length;
                        let section_info;

                        for (let i_sm = 0; i_sm < l_asm; i_sm++) {
                            section_info = arr_section_markers[i_sm];

                            //console.log('section_info', section_info);
                            // A section 'code' or 'signature'?
                            // Using the identified name for the moment.
                            //  ui8_type may help / be faster for processing function lookup???
                            const {name, complete, byi_start, byi_end, escape_byis} = section_info;

                            if (escape_byis && escape_byis.length > byi_end - byi_start) {
                                throw 'Too many escape_byis';
                            }


                            let ta_extracted_escaped_section;

                            //console.log('escape_byis', escape_byis);
                            //if (escape_byis) console.log('escape_byis.length', escape_byis.length);

                            if (escape_byis && escape_byis.length > 0) {
                                if (fn_escape) {
                                    //console.log('need to escape the data escape_byis.length', escape_byis.length);
                                    // escape_extract...?
                                    //console.log('fn_escape', fn_escape);

                                    const fn_escape_extract = fn_escape;
                                    //console.log('pre escape [byi_start, byi_end]', [byi_start, byi_end]);
                                    ta_extracted_escaped_section = fn_escape_extract(rs_chunk, byi_start, byi_end, escape_byis);

                                    //console.log('ta_extracted_escaped_section', ta_extracted_escaped_section);
                                    //console.log('ta_extracted_escaped_section.length', ta_extracted_escaped_section.length);

                                    //console.trace();
                                    //throw 'NYI';
                                } else {
                                    console.log('missing fn_escape. need to escape the data escape_byis.length', escape_byis.length);
                                    console.trace();
                                    throw 'NYI';
                                }

                            } else {
                                if (complete) {

                                    ta_extracted_escaped_section = rs_chunk.subarray(byi_start, byi_end);
                                    //console.log('ta_extracted_escaped_section.length', ta_extracted_escaped_section.length);

                                    // And call the format-specific escape function.

                                    // escape_chunk function. Should be part of the format-specific code.
                                    //  The scan has just said the positions of the escapes.
    
    
                                } else {
                                    ta_extracted_escaped_section = rs_chunk.subarray(byi_start, byi_end);

                                    // Raise section events here???
                                    //  


                                    //console.log('ta_extracted_escaped_section', ta_extracted_escaped_section);
                                    //console.log('ta_extracted_escaped_section.length', ta_extracted_escaped_section.length);
    
                                    //console.log('section ' + name + ' incomplete');
                                    //console.trace();
    
                                    // section-partial event?
                                    //  some streaming systems will be able to deal with these partial sections.
    
                                    //throw 'NYI';
                                }
                            }

                            //console.log('ta_extracted_escaped_section', ta_extracted_escaped_section);
                            if (ta_extracted_escaped_section) {
                                // next stage is the autoparsing of that section.

                                // Send it to the relevant processor (if we have it.)
                                //  As in we have the def of the section.
                                //  Use the (generated) decoder.

                                // Typed sections by format make the most sense right now.
                                //  May share them later...?
                                //   Not sure where there are the same parsers / processors in different formats. Maybe JPEG inside something else, eg JPEG thumbnail inside JPEG.
                                
                                //console.log('name, complete', [name, complete]);

                                //console.log('section_type_defs', section_type_defs);

                                // section_decoder_fns
                                //console.log('section_decoder_fns', section_decoder_fns);

                                if (section_decoder_fns[name]) {
                                    //console.log('have section_decoder_fn for ' + name);

                                    // then decode the section according to the decoder function.
                                    //  will be decode level 0 really.
                                    
                                    const fn_section_decoder = section_decoder_fns[name];
                                    const decoded_section = fn_section_decoder(ta_extracted_escaped_section);
                                    //console.log('decoded_section', decoded_section);
                                    //console.log('decoded_section.name', decoded_section.name);
                                    //console.log('decoded_section.items', decoded_section.items);

                                    const log_section_items = () => {
                                        each(decoded_section.items, item => {
                                            const {index, name, value, length, type} = item;
                                            console.log('[index, name, value, length, type]', [index, name, value, length, type]);
                                            // Raise an item parsed event?
                                            // item parsed function (first?) within this scope?
                                        });
                                    }
                                    //log_section_items();

                                    const o_decoded = {};

                                    each(decoded_section.items, item => {
                                        const {index, name, value, length, type} = item;
                                        //console.log('[index, name, value, length, type]', [index, name, value, length, type]);
                                        o_decoded[name] = value;
                                        // Raise an item parsed event?
                                        // item parsed function (first?) within this scope?
                                    });
                                    console.log('o_decoded', o_decoded);

                                    // then give o_decoded to the OO class if it's available.
                                    //  that would be level 1 decoding.

                                    //const cls_section = section_classes[name];

                                    const section_class = section_classes[name];

                                    //console.log('section_classes', section_classes);
                                    console.log('section_class', section_class);

                                    if (section_class) {
                                        const oo_class = new section_class({
                                            format: format_name,
                                            value: o_decoded
                                        });
                                        console.log('oo_class', oo_class);

                                        //throw 'stop';
                                    } else {

                                    }




                                    

                                    // or decoding level 0 complete.
                                    //  level 0 will be done with the spec description + objects.
                                    //  then level 1 can also deserialise some data into specific objects.
                                    //   those objects can then have ways to do the calculations.



                                    section_parsed(decoded_section);


                                } else {

                                    console.log('missing section_decoder_fn for ' + name);

                                }


                                // x-buffer gets removed when we know what's in it.
                                //  or don't have it.
                                //   it can be implicit when needed???

                                //const fn_decode_format_section = 

                                

                                //console.trace();
                                //throw 'NYI';



                            } else {
                                console.trace();
                                throw 'Section not extracted / escaped correctly.';
                            }


                            // section extracted.
                            //  then there will (likely / possibly be a parsing / decoding function)

                            // top level section auto parsing.
                            //  then there can be some more specific decoders that get called on the variables (incl tas) extracted;
                            

                            // Then further process it.
                            // extract the section data....

                            //const ta_section_data = 
                            // Consider escaping!
                        }

                        // however, should (here I think) go through the parts and run the decoders.
                        //  will have automatically generated encoders and decoders for the parts specified with the OO classes.








                        // Then run escaping. ??????
                        //  escaping.js ???
                        
                        // Events with each of the found sections?
                        //  Maybe could have such events earlier and not even return an array.
                        //  But sync chunk-level scan analysis is OK.

                        // Validate chunk?
                        //  Could be useful for testing too.
                        //   Incorporate input validation / metadata gathering as part of codec?



                        //console.trace();
                        //throw 'NYI';


                    } else {
                        if (fn_decode_supports_stream_input) {
                            console.trace();
                            throw 'NYI';
                        } else {
                            chunks.push(rs_chunk);
                        }
                    }


                    // What to do depends on what we are expecting next.
                    byi_current_rs_chunk_end += rs_chunk.length;
                    last_rs_chunk_length = rs_chunk.length;
                    i_chunk++;
                }

                const concatenate = (resultConstructor, arrays) => {
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
                    console.log('end_binary_stream');

                    if (using_fn_scan) {

                        console.log('need to stop / make sure end has been noticed.');
                        

                        //console.trace();
                        //throw 'stop';

                    } else if (fn_decode) {
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
                    } else {

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

/*
Poly_Codec.parse_binary = (ta, schema_def) => {
    // parse the schema def...
    //  should be parsed already?

    //console.log('schema_def', schema_def);

    // Moving to a more OO and class-name defined system for defining sequences.

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
*/

module.exports = Poly_Codec;
