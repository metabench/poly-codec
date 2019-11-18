
// Constants that are useful / relevant for JPEGs.





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

arr_jpeg_section_names[192] = 'SOF0';
arr_jpeg_section_names[196] = 'DHT';

arr_jpeg_section_names[208] = 'RESET';
arr_jpeg_section_names[209] = 'RESET';
arr_jpeg_section_names[210] = 'RESET';
arr_jpeg_section_names[211] = 'RESET';
arr_jpeg_section_names[212] = 'RESET';
arr_jpeg_section_names[213] = 'RESET';
arr_jpeg_section_names[214] = 'RESET';
arr_jpeg_section_names[215] = 'RESET';

arr_jpeg_section_names[217] = 'EOI';
arr_jpeg_section_names[218] = 'SOS';
arr_jpeg_section_names[219] = 'DQT';
arr_jpeg_section_names[221] = 'DRI'; // Response Interval
arr_jpeg_section_names[254] = 'COM';


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





const jpeg_consts = {
    arr_jpeg_section_names: arr_jpeg_section_names,
    dctZigZag: dctZigZag
}

module.exports = jpeg_consts;