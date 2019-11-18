const Poly_Codec = require('./poly-codec');
const {parse_binary_by_type, read_ui16} = require('./parse');
//const codec = new Poly_Codec();

//codec.add_format_hex_sig('jpeg', '...');
//codec.add_format_hex_sig('png', '...');

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

const bits = require('./math/bits');
const {get_upto32bit_ui32_from_ui8a_at_bii, UpTo8Bits, UpTo32Bits} = bits;
//const {each} = require('lang-mini');

// add_encoder(...);

const jpeg_decoder = require('./formats/jpeg/modified1/mdecoder1');

// deocder outside of polycodec?
//  use the polycodec's decode function?

const {add_jpeg_format_to_polycodec} = require('./formats/jpeg/new/jpeg');




//const new_jpeg_decoder = require('./formats/jpeg/new/jpeg').decoder;


const add_image_formats_to_polycodec = polycodec => {
    //add_png_format_to_polycodec(polycodec);
    //add_jpeg_format_to_polycodec(polycodec);
    

    const use_single_decoder_fn = () => {
        polycodec.add_format('jpeg');
        polycodec.set_format_hex4sig('jpeg', 'ffd8ffe0');
        polycodec.add_format_fn_decoder('jpeg', 'mod1', jpeg_decoder);
    }
    //use_single_decoder_fn();

    const use_polycodec_decoding = () => {
        //console.log('use_polycodec_decoding polycodec', polycodec);
        add_jpeg_format_to_polycodec(polycodec);
    }
    use_polycodec_decoding();

    //


}


const module_res = {
    add_image_formats_to_polycodec: add_image_formats_to_polycodec,
    //add_png_format_to_polycodec: add_png_format_to_polycodec,
    //add_jpeg_format_to_polycodec: add_jpeg_format_to_polycodec
}

module.exports = module_res;

