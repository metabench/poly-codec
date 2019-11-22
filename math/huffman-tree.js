// A JPEG can use multiple Huffman tables / trees.

// A 'bits' module?
//  ta-bits?

// 



// Separate Bit Processing? Bit_Buffer?
// BitArray???
//  with .get and .set?
//  using [n] notation?



const {def} = require('lang-mini');
const {ro} = require('obext')();



var float64ToInt64Binary = (function () {
    // create union
    var flt64 = new Float64Array(1)
    var uint16 = new Uint16Array(flt64.buffer)
    // 2**53-1
    var MAX_SAFE = 9007199254740991
    // 2**31
    var MAX_INT32 = 2147483648
  
    function uint16ToBinary() {
      var bin64 = ''
  
      // generate padded binary string a word at a time
      for (var word = 0; word < 4; word++) {
        bin64 = uint16[word].toString(2).padStart(16, 0) + bin64
      }
  
      return bin64;
    }

    return function float64ToInt64Binary(number) {
        // NaN would pass through Math.abs(number) > MAX_SAFE
        if (!(Math.abs(number) <= MAX_SAFE)) {
          throw new RangeError('Absolute value must be less than 2**53')
        }
    
        var sign = number < 0 ? 1 : 0
    
        // shortcut using other answer for sufficiently small range
        if (Math.abs(number) <= MAX_INT32) {
          return (number >>> 0).toString(2).padStart(64, sign)
        }
    
        // little endian byte ordering
        flt64[0] = number
    
        // subtract bias from exponent bits
        var exponent = ((uint16[3] & 0x7FF0) >> 4) - 1022
    
        // encode implicit leading bit of mantissa
        uint16[3] |= 0x10
        // clear exponent and sign bit
        uint16[3] &= 0x1F
    
        // check sign bit
        if (sign === 1) {
          // apply two's complement
          uint16[0] ^= 0xFFFF
          uint16[1] ^= 0xFFFF
          uint16[2] ^= 0xFFFF
          uint16[3] ^= 0xFFFF
          // propagate carry bit
          for (var word = 0; word < 3 && uint16[word] === 0xFFFF; word++) {
            // apply integer overflow
            uint16[word] = 0
          }
    
          // complete increment
          uint16[word]++
        }
    
        // only keep integer part of mantissa
        var bin64 = uint16ToBinary().substr(11, Math.max(exponent, 0))
        // sign-extend binary string
        return bin64.padStart(64, sign)
    }
})();

var float64ToInt8Binary = n => float64ToInt64Binary(n).substring(56, 64);
var float64ToInt16Binary = n => float64ToInt64Binary(n).substring(48, 64);
var float64ToInt32Binary = n => float64ToInt64Binary(n).substring(32, 64);



// Each node can just be an object. Maybe an array would be ok?

// object.left, object.right

// Could make the tree using only numeric references too.
//  Want fast lookup however that's possible.

// Should be usefully generally for Huffman tree? Optimized for JPEGs?


// And a Table?


// System on a lower level that will enable bit-level reads and writes?

//  Reading and writing bit sequences using bytes...?

// Using masking to show / filter the specific bits from a byte.

// read_bit_from_byte(ta, byi, biiwby)

// read_bit(ui8a, bii)


// const read_binary_as_bytes()


// Should be usable for doing my own compression / encoding.


// Range within an original buffer.
//  Use a subarray?
//  Restricted so that it will only interact with its specified bit range.
//   Other operations to apply that bit range elsewhere?


// Definitely want to create huffman trees from binary data / data to compress.





//Bit_Range_Buffer?

// Will help to avoid OOB errors while still keeping things fast.

/*

&	AND	Sets each bit to 1 if both bits are 1
|	OR	Sets each bit to 1 if one of two bits is 1
^	XOR	Sets each bit to 1 if only one of two bits is 1
~	NOT	Inverts all the bits
<<	Zero fill left shift	Shifts left by pushing zeros in from the right and let the leftmost bits fall off
>>	Signed right shift	Shifts right by pushing copies of the leftmost bit in from the left, and let the rightmost bits fall off
>>>	Zero fill right shift	Shifts right by pushing zeros in from the left, and let the rightmost bits fall off


*/

// May use this to read the Huffman data?
//  Not sure.
//  Need the right tools for a variety of LL jobs.

// .ll may be a useful notation.

class Bit_Range {
    constructor(ui8a, bii_start, bii_end) {


        // Spec is a buffer, and its bit positions.
        //  These bit ranges will be used to access / use the values in the Huffman table.


        // Then be able to access the individual bits in this range by position.







    }
}

// TaOptimizedTree

// nodes are made out of points within the tree

// left pointer index, value, right pointer index

// Coming up with own and more understandable (lower level?) implementation of this will help a lot.
//  Higher level too, making use of relevant Huffman classes and functions.


// May be a bit inefficient / unclear with this push and pop?

// Can reverse engineer below function to understand it.

// https://www.w3.org/Graphics/JPEG/itu-t81.pdf
//  page 41


// https://koushtav.me/jpeg/tutorial/c++/decoder/2019/03/02/lets-write-a-simple-jpeg-library-part-2/#huffman-tree


// class Graph
//  Ui32Graph
//   Ui32ArrayGraph? Ui32VectorGraph?

// Ui32BinaryTree...?
//  As in a node can only have 2 connections: down-left, down-right.

const mask_bools = (...args) => {
    console.log('args.length', args.length);
    console.log('args', args);

    let res = 0 | 0;

    const l = args.length;
    let multiple = 1;
    for (let c = 0; c < l; c++) {
        //console.log('args[c] === true * multiple', (args[c] === true ? 0 : 1 ) * multiple);
        //res += args[c] === true ? 0 : multiple;

        if (args[c] === true) {
            res += multiple;
        }

        multiple *= 2;
    }

    //console.log('res', res);

    //console.trace();
    //throw 'stop';
    return res;
}





// Maybe best in its own file / module.





// Key and value association in a tree.
//  And will be fast when using TAs. Stable memory usage.
class Ui32BinaryTree {

    constructor(spec = {}) {
        // number of nodes.
        let i_max_nodes = spec.max_nodes || 64;
        



        // Each node takes 3 ui32 positions.
        // 0: left, 1: right, 2: self value

        // Or: 0: self index, 1: self value, 2: left index, 3: right index



        // add item with code?
        //  just add item.

        // (index?), left, right, value.

        // one of the 32 bit values for each node as a mask?
        //  saying if it is using the value, left, right.

        // or have 0 signify nowhere?
        //  may want 'no value' as well as value '0'.

        // index 0 could mean does not point anywhere.

        let i_next_new_node = 0;
        const ta_items_per_node = 6;
        let ta = new Uint32Array(i_max_nodes * ta_items_per_node);

        // add_node may be a better API?

        // .set

        // .get

        // where appropriate.

        /// ????  ------------------------------------
        const set = (key, value) => {

        }

        const get = (key) => {

        }
        // ??????? ------------------------------------

        // Set everything in a single node?
        let num_nodes = 0;
        let i_root_node;

        const node_exists = (i_node) => {
            return i_node < i_next_new_node;
        }

        this.node_exists = node_exists;

        const create_root_node = () => {
            if (i_root_node === undefined) {
                i_root_node = i_next_new_node++;
                num_nodes++;

                let p = i_root_node * ta_items_per_node;
                //if (!def(i_parent)) {

                //}
                const is_root = true;
                //
                const has_key = false;
                const has_value = false;
                const has_l_child = false;
                const has_r_child = false;
                const has_parent = false;
                //console.log('i_parent', i_parent);
                //console.log('has_parent', has_parent);

                const is_leaf = true;
                // root and lead together to start with.


                //throw 'stop';

                // mask, key, value, parent, left, right
                // mask: is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent

                // read various values from the mask.
                // read_mask(value, schema)

                // masking and unmasking functions.

                // m = mask(boolean1, boolean2...)

                //  10 in total there.
                //   don't need is_root...
                //   don't need is_leaf???
                
                // Can do this with 40 bytes per node, not too large a memory requirement I think, and it will be fast.

                // A masking function will be clearer.
                //  Can optimize later.
                //   Can make my own JS inliner / JS->JS compiler.

                const mask = mask_bools(is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent);

                console.log('[is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent]', [is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent]);

                //const mask = def(value) | (def(left) * 2) | (def(right) * 4);
                console.log('mask', mask);

                //throw 'stop';

                ta[p++] = mask;

                if (has_key) {
                    ta[p++] = key;
                } else {
                    p++;
                }
                if (has_value) {
                    ta[p++] = value;
                } else {
                    p++;
                }
                if (has_l_child) {
                    ta[p++] = i_left;
                } else {
                    p++;
                }
                if (has_r_child) {
                    ta[p++] = i_right;
                } else {
                    p++;
                }
                if (has_parent) {
                    ta[p++] = i_parent;
                } else {
                    p++;
                }
                return i_root_node;


                
                //set_node(i_root_node = i_next_new_node++, undefined, undefined, undefined, undefined);

                //num_nodes++;
                //return i_root_node;
            } else {
                if (typeof i_root_node === 'number') {
                    console.trace();
                    throw 'NYI - Cannot create more than 1 root node.'
                }
            }
        }

        ro(this, 'ta', () => ta);
        ro(this, 'num_nodes', () => num_nodes);

        // insert_node may work better?

        // set_node_l_child
        // set_node_r_child

        const set_node_mask_bit = (i_node, i_bit, value) => {
            const p_node = i_node * ta_items_per_node;
            const p_node_mask = p_node;
            if (value === 1 || value === true) {
                ta[p_node_mask] = ta[p_node_mask] | (1 << i_bit);
            } else {
                // xor may do this. ^
                //  but really want to set specific bit to 0.
                //   think xor is the one.

                // This could be wrong....
                //  Use an inverse mask with and?

                //console.log('[i_node, i_bit, value]', [i_node, i_bit, value]);

                // XOR maybe isnt the right way.
                //console.log('1) ta[p_node_mask]', ta[p_node_mask]);

                ta[p_node_mask] = ta[p_node_mask] & (~(1 << i_bit));
                //console.log('2) ta[p_node_mask]', ta[p_node_mask]);
                //throw 'stop';
            }
            //const i_value = (value === true) ? 1 | 0 : 0 | 0;
        }

        const get_node_mask_bit = (i_node, i_bit) => ((1 << i_bit) & (ta[i_node * ta_items_per_node])) !== 0

        const _get_node_mask_bit = (i_node, i_bit) => {
            const mask_val = ta[i_node * ta_items_per_node];
            //console.log('mask_val', mask_val);
            //const i_match = Math.pow(2, i_bit);
            const i_match = 1 << i_bit;
            //console.log('i_bit', i_bit);
            //console.log('i_match', i_match);
            const has_match = (i_match & mask_val) !== 0;
            //console.log('i_match & mask_val', i_match & mask_val);
            //console.log('has_match', has_match);
            return has_match;
        }

        /*
        const set_node_parent = (i, i_parent) => {
            const p_node = i * ta_items_per_node;
            const p_node_i_parent = p_node + 5; //i_parent
            ta[p_node_i_parent] = i_parent;
            set_node_mask_bit(i, 6, true); //has_parent
        }
        */

        const get_node_parent = (i_node) => {
            //console.log('get_node_parent i_node', i_node);

            const has_parent = get_node_mask_bit(i_node, 6);
            //console.log('has_parent', has_parent);

            if (has_parent) {
                const p_node = i_node * ta_items_per_node;
                const p_node_i_parent = p_node + 5; //i_parent as 5
                return ta[p_node_i_parent];
            }

            //const p_node = i * ta_items_per_node;
            //const p_node_i_parent = p_node + 5;

        }

        const get_node_value = (i_node) => {
            const has_value = get_node_mask_bit(i_node, 3);
            if (has_value) {
                const p_node = i_node * ta_items_per_node;
                const p_node_i_value = p_node + 2;
                return ta[p_node_i_value];
            }
        }

        const get_node_l_child = (i_node) => {
            const has_l_child = get_node_mask_bit(i_node, 4);

            console.log('[i_node, has_l_child]', [i_node, has_l_child]);
            if (has_l_child) {
                const p_node = i_node * ta_items_per_node;
                const p_node_i_l_child = p_node + 3;
                //console.log('ta[p_node_i_l_child]', ta[p_node_i_l_child]);
                return ta[p_node_i_l_child];
            }
        }
        const get_node_r_child = (i_node) => {
            const has_r_child = get_node_mask_bit(i_node, 5);

            console.log('[i_node, has_r_child]', [i_node, has_r_child]);
            if (has_r_child) {
                const p_node = i_node * ta_items_per_node;
                const p_node_i_r_child = p_node + 4;
                return ta[p_node_i_r_child];
            }
        }

        /*

        const set_node_l_child = (i, i_left) => {
            const p_node = i * ta_items_per_node;
            const p_node_l_child = p_node + 3;
            ta[p_node_l_child] = i_left;
            set_node_mask_bit(i, 1, false); // is_leaf = false
            set_node_mask_bit(i, 4, true);  // has_l_child = true

            set_node_parent(i_left, i);
            //set_node_mask_bit(i_left, 6, true); // Child has a parent

            // then set the has_l_child to true and is_leaf to false.

            // const mask           = mask_bools(is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent);
            // need to set node mask / bit values.

            //const change_mask_to_or = mask_bools();
        }
        // Parent?

        const set_node_r_child = (i, i_right) => {
            const p_node = i * ta_items_per_node;
            const p_node_r_child = p_node + 4;
            ta[p_node_r_child] = i_right;
            set_node_mask_bit(i, 1, false); // is_leaf = false
            set_node_mask_bit(i, 5, true);  // has_r_child = true

            set_node_parent(i_right, i);
            //set_node_mask_bit(i_right, 6, true); // Child has a parent
            // then set the has_l_child to true and is_leaf to false.
            // const mask           = mask_bools(is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent);
            // need to set node mask / bit values.
            //const change_mask_to_or = mask_bools();
        }
        */

        const node_to_right_of = (i_node) => {

            console.log('node_to_right_of i_node', i_node);
            console.log('ta', ta);

            if (i_node === null || i_node === undefined) {
                return i_node;
            } else {
                // Node is the left child of its parent, then the parent's
                // right child is its right level order node.
                //if ( node->parent != nullptr && node->parent->lChild == node )
                //    return node->parent->rChild;

                let i_parent = get_node_parent(i_node);
                console.log('i_parent', i_parent);

                if (i_parent === undefined) {
                    return undefined;
                } else {
                    // a number

                    // get the index of the parent lchild - check it's i_node.
                    //  then it's the rchild which will be to the right of it.

                    const i_parent_l_child = get_node_l_child(i_parent);
                    if (i_parent_l_child === i_node) {
                        return get_node_r_child(i_parent);
                    } else {
                        // Some kind of traversal needed....
                        let count = 0, index = i_node;
                        //let i_parent;

                        i_parent = get_node_parent(index);

                        while (i_parent !== undefined && get_node_r_child(i_parent) === undefined) {
                            index = i_parent;
                            i_parent = get_node_parent(index);
                            //console.log('i_parent', i_parent);
                            count++;
                        }

                        console.log('count', count);

                        /*

                        while ( nptr->parent != nullptr && nptr->parent->rChild == nptr )
                        {
                            nptr = nptr->parent;
                            count++;
                        }


                        */

                        // if ( nptr->parent == nullptr ) return nullptr;
                        i_parent = get_node_parent(index);
                        if (i_parent === undefined) {
                            return undefined;
                        } else {


                            /*

                            nptr = nptr->parent->rChild;
                            int i = 1;
                            while ( count > 0 )
                            {
                                nptr = nptr->lChild;
                                count--;
                            }
                            
                            return nptr;   

                            */

                            index = get_node_r_child(index);
                            let i2 = 1;
                            while (count > 0) {
                                index = get_node_l_child(index);
                                count--;
                            }

                            console.log('pre return index', index);
                            return index;
                        }
                    }
                }
            }


            //const t_i_node = typeof i_node;




            /*

            NodePtr getRightLevelNode( NodePtr node )
            {
                if ( node == nullptr )
                    return nullptr;
                
                // Node is the left child of its parent, then the parent's
                // right child is its right level order node.
                if ( node->parent != nullptr && node->parent->lChild == node )
                    return node->parent->rChild;
                
                // Else node is the right child of its parent, then traverse
                // back the tree and find its right level order node
                int count = 0;
                NodePtr nptr = node;
                while ( nptr->parent != nullptr && nptr->parent->rChild == nptr )
                {
                    nptr = nptr->parent;
                    count++;
                }
                
                if ( nptr->parent == nullptr )
                    return nullptr;
                
                nptr = nptr->parent->rChild;
                
                int i = 1;
                while ( count > 0 )
                {
                    nptr = nptr->lChild;
                    count--;
                }
                
                return nptr;        
            }
            */
        }

        this.node_to_right_of = node_to_right_of;

        const node_has_left_child = i_node => get_node_mask_bit(i_node, 4);
        const node_has_right_child = i_node => get_node_mask_bit(i_node, 5);


        // left or right...?
        const create_left_child_node = (i_node) => {
            // need a new id for the child node.

            const i_new_child_node = i_next_new_node++;
            num_nodes++;

            let p = i_new_child_node * ta_items_per_node;

            const is_root = false;
            const has_key = false;
            const has_value = false;
            const has_l_child = false;
            const has_r_child = false;
            const has_parent = true;
            const is_leaf = true;

            const mask = mask_bools(is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent);
            ta[p] = mask;
            //p += 4;
            ta[p + 5] = i_node;

            

            let idx_node = i_node * ta_items_per_node;
            let idx_node_l_child = idx_node + 3;
            ta[idx_node_l_child] = i_new_child_node;
            
            // and set the has_l_child bit.

            set_node_mask_bit(i_node, 1, false);
            set_node_mask_bit(i_node, 4, true);

            // then adjust it with own mask.
            // adjust the parent node so that it has got the children.

            // set_node_i_left_child
            //  and that's all it does.
            return i_new_child_node;
        }

        const create_right_child_node = (i_node) => {
            // need a new id for the child node.

            // test if it already has that child node...?



            const i_new_child_node = i_next_new_node++;
            num_nodes++;

            let p = i_new_child_node * ta_items_per_node;

            const is_root = false;
            const has_key = false;
            const has_value = false;
            const has_l_child = false;
            const has_r_child = false;
            const has_parent = true;
            const is_leaf = true;

            const mask = mask_bools(is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent);
            ta[p] = mask;
            //p += 4;
            ta[p + 5] = i_node;

            

            let idx_node = i_node * ta_items_per_node;
            let idx_node_r_child = idx_node + 4;
            ta[idx_node_r_child] = i_new_child_node;
            
            // and set the has_l_child bit.

            set_node_mask_bit(i_node, 1, false);
            set_node_mask_bit(i_node, 5, true);

            const nbm_1 = get_node_mask_bit(i_node, 1);
            const nbm_5 = get_node_mask_bit(i_node, 5);

            console.log('[nbm_1, nbm_5]', [nbm_1, nbm_5]);



            // then adjust it with own mask.
            // adjust the parent node so that it has got the children.

            // set_node_i_left_child
            //  and that's all it does.

            //throw 'stop';

            return i_new_child_node;
        }

        /*

        const set_node = (i, key, value, i_left, i_right, i_parent) => {
            //console.log('set_node');
            //console.log('[i, key, value, i_left, i_right, i_parent]', [i, key, value, i_left, i_right, i_parent]);
            //console.trace();
            let p = i * ta_items_per_node;
            //if (!def(i_parent)) {

            //}

            const is_root = !def(i_parent);
            //
            const has_key = def(key);
            const has_value = def(value);
            const has_l_child = def(i_left);
            const has_r_child = def(i_right);
            const has_parent = def(i_parent);
            //console.log('i_parent', i_parent);
            //console.log('has_parent', has_parent);

            const is_leaf = !has_l_child && !has_r_child;

            //throw 'stop';

            // mask, key, value, parent, left, right
            // mask: is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent

            // read various values from the mask.
            // read_mask(value, schema)

            // masking and unmasking functions.

            // m = mask(boolean1, boolean2...)

            //  10 in total there.
            //   don't need is_root...
            //   don't need is_leaf???
            
            // Can do this with 40 bytes per node, not too large a memory requirement I think, and it will be fast.

            // A masking function will be clearer.
            //  Can optimize later.
            //   Can make my own JS inliner / JS->JS compiler.

            const mask = mask_bools(is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent);

            console.log('[is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent]', [is_root, is_leaf, has_key, has_value, has_l_child, has_r_child, has_parent]);

            //const mask = def(value) | (def(left) * 2) | (def(right) * 4);
            console.log('mask', mask);

            //throw 'stop';

            ta[p++] = mask;

            if (has_key) {
                ta[p++] = key;
            } else {
                p++;
            }
            if (has_value) {
                ta[p++] = value;
            } else {
                p++;
            }
            if (has_l_child) {
                ta[p++] = i_left;
            } else {
                p++;
            }
            if (has_r_child) {
                ta[p++] = i_right;
            } else {
                p++;
            }
            if (has_parent) {
                ta[p++] = i_parent;
            } else {
                p++;
            }
            return i;
        }
        */

        const add_empty_children = (i_node) => {

            //console.log('add_empty_children i_node', i_node);
            //console.log('1) ta', ta);

            const i_l_child = create_left_child_node(i_node);
            const i_r_child = create_right_child_node(i_node);

            /*

            // (i, key, value, i_left, i_right, i_parent)
            const i_l = set_node(i_next_new_node++, undefined, undefined, undefined, undefined, i_node);
            set_node_l_child(i_node, i_l);
            const i_r = set_node(i_next_new_node++, undefined, undefined, undefined, undefined, i_node);
            set_node_r_child(i_node, i_r);

            console.log('2) ta', ta);

            console.trace();
            throw 'stop';

            */
        }
        this.add_empty_children = add_empty_children;


        const traverse = (i_start, callback) => {
            // callback on the node itself.
            console.log('traverse i_start', i_start);
            const value = get_node_value(i_start);
            const i_lc = get_node_l_child(i_start);
            const i_rc = get_node_r_child(i_start);

            // And a stop function...?
            let ctu = true;

            const fn_stop = () => {
                ctu = false;
            }

            callback({
                index: i_start,
                value: value,
                left_child: i_lc,
                right_child: i_rc
            }, fn_stop);
            if (ctu) {
                
                console.log('i_lc', i_lc);
                if (i_lc !== undefined) {
                    traverse(i_lc, callback);
                }
                
                console.log('i_rc', i_rc);
                if (i_rc !== undefined) {
                    traverse(i_rc, callback);
                }
            }
        }

        this.traverse = traverse;

        const setup_3_node_structure = () => {
            const i_root = create_root_node();
            add_empty_children(i_root);

            //console.log('i_root', i_root);

            // Maybe add_node of some sort will help?

            /*

            const i_l1_left = set_node(i_next_new_node++, undefined, undefined, undefined, i_root);
            set_node_l_child(i_root, i_l1_left);
            //i_leftmost = i_l1_left;

            //console.log('i_l1_left', i_l1_left);

            const i_l1_right = set_node(i_next_new_node++, undefined, undefined, undefined, i_root);
            set_node_r_child(i_root, i_l1_right);

            */



            //console.log('i_l1_right', i_l1_right);

            // And the parent as the root.
            //const i_left = set_node(i_node++, undefined, undefined, undefined, i_root);
            //const i_right = set_node(i_node++, undefined, undefined, undefined, i_root);

            // insert_left and insert_right would work better here.

            console.log('setup_structure complete');
        }
        //setup_3_node_structure();

        this.setup_3_node_structure = setup_3_node_structure;

        // 

        // Will also need to navigate structure when placing / putting nodes.

        //console.log('ta', ta);

        //throw 'End of Ui32BinaryTree constructor';





    }
}


const buildHuffmanTable = (codeLengths, values) => {
    let k = 0, i, j, length = 16;
    const code = [{
        children: [],
        index: 0
      }];
      
    // last item with a length > 0
    while (length > 0 && !codeLengths[length - 1]) length--;
    console.log('length', length);


    
    console.log('1) code', code);
    
    let p = code[0], q;

    // Seems a bit of a strange algo with the code reorginisation.
    //  Could verify my algo builds / can build the same tree.
    //   It will be stored and accessed in a more optimised way.

    // For the moment seems a bit too strange / unclear to reverse engineer parts of it.
    //  Will build up the HT in an efficient object based on the spec, will work in both directions.
    // https://koushtav.me/jpeg/tutorial/c++/decoder/2019/03/02/lets-write-a-simple-jpeg-library-part-2/#huffman-tree looks simpler to understand & use as reference.


    // Tree navigation and placement here. Probably 'p' for pointer.

    for (i = 0; i < length; i++) {
    

      for (j = 0; j < codeLengths[i]; j++) {

        // Load the particular value into the tree here.

        p = code.pop();
        console.log('popped p', p);
        console.log('k', k);
        console.log('values[k]', values[k]);

        // Its as though it's a k loop too.

        // Insert and increment the indexes of all of them above.
        p.children[p.index] = values[k];
        while (p.index > 0) {
          p = code.pop();
          console.log('popped p', p);
        }
        p.index++;

        code.push(p);
        console.log('pushed p', p);
        console.log('1) code.length', code.length);
        while (code.length <= i) {
          console.log('2) code.length', code.length);
          code.push(q = {
            children: [],
            index: 0
          });
          p.children[p.index] = q.children;
          p = q;
        }

        k++;
      }
      console.log('i', i);
      console.log('length', length);
      if (i + 1 < length) {
        // p here points to last code
        code.push(q = {
          children: [],
          index: 0
        });
        p.children[p.index] = q.children;
        p = q;
      }
    }
    console.log('HT code', code);
    //console.log('HT res code[0].children', code[0].children);
    const res = code[0].children;
    console.log('HT res', JSON.stringify(res, null, 2));
    return res;
  }

// TA_Tree

// Stores a specific value type at each node.

// left, right, self value


// Huffman Tree will extend / use this.


/*

Consider for each node:

root: boolean value to indiciate whether the node is a root node
leaf: boolean value to indicate whether the node is a leaf node
code: the Huffman code corresponding to the node
value: the symbol value of a leaf node in the Huffman tree
lChild: left child of the node
rChild: right child of the node
parent: parent of the node


// Both a key and value for each node in the binary tree.



Consider for the tree:


createRootNode: create an new binary tree
createNode: helper function to create a node
insertLeft: add a left child for the specified node
insertRight: add a right child for the specified node
getRightLevelNode: get the node at the immediate right & at the same level to the specified node
inOrder: perform inorder traversal of the Huffman tree with specified root node



*/


const build_huffman_tree_jpeg = (ta_lengths, ta_values) => {
    const l = ta_lengths.length;
    console.log('build_huffman_tree_jpeg');
    const res = new Ui32BinaryTree();
    res.setup_3_node_structure();

    // let i_leftmost_without_value ...?
    //  I think it writes in the tree from left to right once the tree has been constructed.





    // Not so sure what this 'leftmost' is for.

    // then load the values into the tree according to the algo.

    // cumulative lengths - the start positions for the symbols at each length.
    const ta_cumulative_lengths = new Uint32Array(l);
    ta_cumulative_lengths[0] = ta_lengths[0];
    for (let c = 1; c < l; c++) {
        ta_cumulative_lengths[c] = ta_cumulative_lengths[c - 1] + ta_lengths[c];
    }

    const ta_start_positions = ta_cumulative_lengths;
    console.log('ta_start_positions', ta_start_positions);

    const get_symbols_of_length = (length) => {
        return ta_values.subarray(ta_start_positions[length], ta_start_positions[length] + ta_lengths[length]);
    }




    // https://koushtav.me/jpeg/tutorial/c++/decoder/2019/03/02/lets-write-a-simple-jpeg-library-part-2/#huffman-tree

    const num_lengths = ta_lengths.length;

    if (num_lengths === 16) {
        console.log('num_lengths', num_lengths);

        let i_current;

        for (let c = 0; c < num_lengths; c++) {
            const symbol_count = ta_lengths[c];
            console.log('symbol_count', symbol_count);

            if (symbol_count === 0) {

                i_current = res.i_leftmost;
                console.log('i_current', i_current);

                while (typeof i_current === 'number') {
                    res.add_empty_children(i_current);

                    // Root node should not have a parent or provide one!

                    i_current = res.node_to_right_of(i_current);

                    console.log('i_current', i_current);
                }

                /*

                current := leftMost
    6.          WHILE current NOT EQUALS NULL DO
    7.              Add empty left & right child of current
    8.              current := RightLevelNode(current) // RightLevelNode(n) returns the right node of n in the current level, or null if none exist
    9.          END-WHILE
    10.         leftMost := leftMost.left


                */


            } else {
                const symbols_of_length = get_symbols_of_length(c);
                console.log('symbols_of_length', symbols_of_length);

                // want to have it in array tree form.

                // .toArray

                // and only the keys and values shown for the objects...
                //  worth showing indexes for now.





                /*

                console.log('pre traverse\n\n\n');
                res.traverse(0, (o_node_info, fn_stop) => {
                    console.log('o_node_info', o_node_info);


                });
                */
                //throw 'stop';

                // Getting the symbols here seems tricky.
                //  how to get the symbols at this stage?

                // not that tricky.
                //  symbols are each 1 byte long.
                //   represent a path through the Huffman tree.

                // Worth making an indexed array / ta of the symbols data - where the symbols for each length starts.

                // Want a better way of viewing the binary tree too.
                //  Recursive traversal?
                //  Traversal while loop(s)?
                //  Output the tree in nested array form.
                //   Get it in nested array form starting at any node.








                /*

                // Strange - seems like it's moving the leftmost pointer to the right.

                // May be able to be clearer about what it's doing at this stage.

                FOR symbol in GetSymbols(n) DO // GetSymbols(n) returns the list of symbols with length n
    13.             leftMost.value := symbol
    14.             leftMost := RightLevelNode(leftMost)
    15.         END-FOR
    16.         Add empty left & right child of leftMost
    17.         current := leftMost.right
    18.         leftMost := leftMost.left
    19.         WHILE current NOT EQUALS NULL DO
    20.             add empty left & right child of current
    21.         END-WHILE

                */
            }
        }

    } else {
        console.trace();
        throw 'Unexpected num_lengths: ' + num_lengths;
    }






    return res;
}

// Could have separate algo to build the HT with JPEG DHT data.

class Huffman_Tree {
    constructor(spec) {
        //console.log('Huffman_Tree spec', spec);

        if (spec.format) {
            if (spec.format === 'jpeg') {
                // count the sum...

                const {code_counts, buf_huffman} = spec.value;
                //console.log('code_counts.length', code_counts.length);
                //let sum_l_bits = 0;


                // Number of codes in total
                let count_codes = 0;

                for (let c = 0; c < 16; c++) {
                    //sum_l_bits += (code_counts[c]) * (c + 1);
                    count_codes += code_counts[c];
                }

                // Could try doing this without the buildHuffmanTable function.

                /*
                // Using error checking now.
                console.log('sum_l_bits', sum_l_bits);
                console.log('buf_huffman.length', buf_huffman.length);
                console.log('count_codes', count_codes);
                console.log('buf_huffman.length * 8', buf_huffman.length * 8);
                */

                if (count_codes === buf_huffman.length) {
                    // As it should be.
                    //  Will read these (at first) into an OO TA tree structure.
                    //  Would also work as a basis for a TA Linked List. Could also hold strings / other values / binary values.


                    const use_jpegjs_ht = () => {
                        const ht = buildHuffmanTable(code_counts, buf_huffman);
                        console.log('ht', ht);
                        console.log('ht', JSON.stringify(ht));
                    }


                    // Will have my own build Huffman Table
                    //  or Huffman Tree....
                    //   Will use fast ta tree access for the moment. Is a small tree anyway.

                    // Worth iterating through the codes here.
                    //  Reading what data we can get from them where possible.
                    //   Each of them will be byte codes.
                    //    Seems a bit difficult. Maybe they are the leaves of the tree? The tree itself is encoded in a neatly compressed way (mostly).

                    const htree = build_huffman_tree_jpeg(code_counts, buf_huffman);
                    console.log('htree', htree);

                    //throw 'stop';
                    //console.log('\n');

                    // And I'll use my own Huffman Tree system.
                    //  See if I can get my own decode of DHT producing the same results, but using a faster TA system.

                } else {
                    console.trace();
                    throw 'stop';
                }
            } else {
                console.trace();
                throw 'Unsupported format: ' + spec.format;
            }
        }
        // Want efficient storage of the internal data

        // Need to be able to give it the binary JPEG definition of the Huffman Tree / Table?

        // Expecting the spec as an object makes most sense right now.

        // Function to decode JPEG-encoded Huffman tree / block data
        //  Initial part: The lengths (counts) at each number of bits
        //  Next part: the values at each number of bits.
        //   Requires reading sub-8-bit / non-byte separated values from the typed array.
        // Create the Huffman tree from JPEG DHT block...
    }
}

Huffman_Tree.from_JPEG_DHT = (ta_dht_data) => {

}

module.exports = Huffman_Tree;


if (require.main === module) {

    const test_bits = () => {
        const ui8a = new Uint8Array([21, 245]);

        let bii = 0;

        let bi = read_bit(ui8a, bii);
        console.log('bii', bii);
        console.log('bi', bi);

        bii = 1;

        bi = read_bit(ui8a, bii);
        console.log('bii', bii);
        console.log('bi', bi);

        bii = 4;

        bi = read_bit(ui8a, bii);
        console.log('bii', bii);
        console.log('bi', bi);

        console.log('ui8a', ui8a);

        write_bit(ui8a, 0, 0);

        console.log('ui8a', ui8a);

        write_bit(ui8a, 1, 1);
        console.log('ui8a', ui8a);




        // Examples using genuine JPEG Huffman Tree data...?


    }
    //test_bits();

    const test_binary_tree = () => {
        const tree1 = new Ui32BinaryTree();

        console.log('1) tree1', tree1);
        console.log('1) tree1.ta', tree1.ta);

        tree1.setup_3_node_structure();
        console.log('2) tree1', tree1);
        console.log('2) tree1.ta', tree1.ta);
        console.log('2) tree1.num_nodes', tree1.num_nodes);

        // .toJSON function will help.
        //  traverses the tree




    }
    test_binary_tree();


    const test_huffman_tree = () => {

        /*
        code_counts: Uint8Array [
            0, 2, 3, 1, 1, 1,
            1, 0, 0, 0, 0, 0,
            0, 0, 0, 0
        ],
        buf_huffman: Uint8Array [
            2, 3, 0, 1, 4,
            5, 6, 7, 8
        ]
        */


        const ht = new Huffman_Tree({
            format: 'jpeg'
        });
        console.log('ht', ht);

        


    }
    //test_huffman_tree();
    



}