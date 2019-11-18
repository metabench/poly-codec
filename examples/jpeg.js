const PolyCodec = require('../poly-codec');
const polycodec = new PolyCodec();

/*
add_image_formats_to_polycodec: add_image_formats_to_polycodec,
add_png_format_to_polycodec: add_png_format_to_polycodec,
add_jpeg_format_to_polycodec: add_jpeg_format_to_polycodec
*/

const {add_image_formats_to_polycodec, add_jpeg_format_to_polycodec} = require('../images');


// Want to severely delay the stream - and can try just 10 byte chunks too, make sure it caches properly.







// want to get the input stream rather than load it to a complete buffer to start with.

// gfx.load(png_path)

/*
    Roadmap - towards 0.0.24
        Move tested and relevant algorithms to ta_math where appropriate.
        More resizing examples - could use Erte Ale.
        Perf Opt

        Also worth moving relevant inner working of VFPX into ta_math. ???
*/

const eg_mod_name = 'jpeg';

const {each} = require('lang-mini');
const fnlfs = require('fnlfs');
const {obs} = require('fnl');
const { PerformanceObserver, performance } = require('perf_hooks');

//const Encoded_Image_Buffer = require('../buffers/encoded/encoded-image-buffer/encoded-image-buffer');
//const JPEG_Image_Buffer = require('../buffers/encoded/jpeg-image-buffer/jpeg-image-buffer');


//console.log('ta_math', ta_math);
//throw 'stop';

// Could make into separate module as it seems generally useful. It would also help progress towards jsgui4, which will use more external references (still to my ecosystem).
//const Virtual_Float_Pixel = require('../virtual-float-pixel');

const run_examples = (gfx_server, erte_ale, westminster_bridge) => obs((next, complete, error) => {

    console.log('pre add_image_formats_to_polycodec');
    add_image_formats_to_polycodec(polycodec);
    console.log('post add_image_formats_to_polycodec');

    const examples = [
        // Ask the Pixel_Buffer which iteration algorithm to use?
        //  Want to present a simple API... will eventually have a resize_ta(ta_source, colorspace_source, dest_size), and won't use the Virtual_Pixel class their either.
        // resize_32x32_to_16x16_24bipp_pastel
        //  and resize it to other amounts.
        //   eg 13x13
        // then integrate resizing into codebase, and make an actual resize example.
        //  release 0.0.24 will have good resize support within the API.
        //   also lower level resizing functions on the ta / maths level.

        // erte ale jpeg.
        ['load_stream_erte_ale', async () => {
            console.log('load_stream_erte_ale (jpeg)');
            // simpler type of resizing, should make use of all having total pixel coverage special case.
            // will go over the 32x32 virtual pixel view...
            //  maybe virtual pixel view is a useful abstraction here too...?
            const s_in = fnlfs.load('../samples/Erte Ale Volcano.jpg', {stream: true});
            //const s_in = fnlfs.load('../samples/Snowy Swiss Alps.jpg', {stream: true});
            //const s_in = fnlfs.load('../samples/PARROTS.jpg', {stream: true});

            console.log('s_in', s_in);
            console.log('s_in.bufferSize', s_in.bufferSize);
            // new Encoded_Image_Buffer from the stream...

            // Make my own slow stream later...




            //const eib_erte_ale_volcano_jpeg = new JPEG_Image_Buffer(s_in);

            // get a decode stream?
            //  expect an observable result...?
            //   that would be best.

            performance.mark('A');
            const obs_decode_erte_ale = polycodec.decode(s_in);

            obs_decode_erte_ale.on('next', data => {
                // Decoder has reached a specific point...
                

                console.log('decode jpeg data:', data);
            });

            obs_decode_erte_ale.on('complete', () => {
                console.log('obs decode erte ale complete');
                performance.mark('B');
                performance.measure('A to B', 'A', 'B');
            })







            //eib_erte_ale_volcano_jpeg.on('parse-parameter', e_param => {
            //    console.log('on parse-parameter: e_param', e_param);
            //});
        }]
    ]
    

    const l_examples = examples.length;
    let eg_name, fn_example, res_eg;


    (async() => {
        const res_all_egs = {};

        for (let c = 0; c < l_examples; c++) {
            //console.log('examples[c]', examples[c]);
            if (examples[c] === false) {
                // means stop all running of examples.
                break;
            }

            [eg_name, fn_example] = examples[c];

            if (eg_name) {
                res_eg = fn_example();
                
                /*
                console.log('NYI - need to save non-pb results from examples / tests.');
                console.log('');
                console.log(eg_name);
                console.log('-'.repeat(eg_name.length));
                console.log('');
                console.log(res_eg);
                */
                console.log(res_eg);
                res_all_egs[eg_name] = res_eg;
            }
        }
        // console.log(JSON.stringify(myObject, null, 4));

        const json_res = JSON.stringify(res_all_egs, null, 4);
        console.log('res_all_egs', json_res);

        // Then processing for the examples...
        //  Want to compute the total weights for each of them.
        //   They should add up to 1.



        // Also, corners shouldn't have heigher 

        each(res_all_egs, (res, name) => {
            const {weights, pos, size} = res;

            console.log('[pos, size]', [pos, size]);
            console.log('name', name);
            //console.log('t_weight', t_weight);
            console.log('weights', weights);

            let t_weight = 0;
            each(weights, weight => t_weight += weight);

            console.log('t_weight', t_weight);

        })

    })();
});

if (require.main === module) {

    (async() => {
        const obs = new PerformanceObserver((items) => {
            console.log(items.getEntries()[0].duration, 'ms');
            performance.clearMarks();
        });
        obs.observe({ entryTypes: ['measure'] });
    
        //const gfx_server = gfx;

        //const erte_ale = await gfx_server.load_pixel_buffer('../source_images/Erte Ale Volcano.jpg');
        //const westminster_bridge = await gfx_server.load_pixel_buffer('../source_images/Ultimate-Travel-Guide-to-London.jpg');

    
        // load the Erte Ale image.
    
    
        const obs_run_examples = run_examples();
    
        obs_run_examples.on('next', e_example => {
    
        })
    })();

    

}