// Classes here just for definitions - not utility such as parsing.
// ---------------------------------- -----------------------------



// Can be used to describe a whole JPEG?
// Parts of a JPEG.
// Subclasses of BOD.

// Generators of encode and decode functions, using object definitions.

// Obj_Def
// BOJ BinObjDef

// Signature


// functions to generate a parser function out of these abstractions / defs...

const {def} = require('lang-mini');
const {prop, ro} = require('obext')();

// Put these together to define how the sequence is put together.
//  This part will be precise, OO and strongly typed (kind-of.).

// Keep these just for definitions here!!!
//  Make sure that we have format definitions that make sense.
//  Modular approach.
//   Use these definitions 


// Using definitions and a modular approach that makes encoders and decoders from them will be more reliable.
//  Will be fast if I get things right.

// LL TA helpers for some of it?
//  Prob not, these are like classed POJOs to an extent.
//   Expresses the definitions, making use of the class names, otherwise fairly basic JS for now please.

// object (always? has a name?)

class Binary_Object_Definition {
    constructor(spec = {}) {
        let name;
        if (def(spec.name)) {
            name = spec.name;
        } else {
            //console.trace();
            //throw 'expected: spec.name';
        }
        //console.log('ro', ro);
        ro(this, 'name', () => name);

        let format;
        if (def(spec.format)) {
            format = spec.format;
        } else {
            //console.trace();
            //throw 'expected: spec.name';
        }
        //console.log('ro', ro);
        ro(this, 'format', () => format);

        if (spec.length) {
            this.length = spec.length;
        } else {
            //console.trace();
            //throw 'spec.length required for fixed length types'
        }
    }
}
// Binary_Object_Binary?


class Binary_Object_Native_Type_Definition extends Binary_Object_Definition {
    constructor(spec) {
        super(spec);

        let found_type_flags = 0;

        this.is_numeric = !!spec.is_numeric;
        this.is_string = !!spec.is_string;
        found_type_flags = this.is_numeric + this.is_string;
        //console.log('found_type_flags', found_type_flags);
        if (spec.is_fixed_length) {
            this.is_fixed_length = !!spec.is_fixed_length;
        } else if (spec.is_fixed_length === false) {
            this.is_fixed_length = false;
        }
        //this.is_fixed_length = !!spec.is_fixed_length;

        if (this.is_fixed_length) {
            if (spec.length) {
                this.length = spec.length;
            } else {
                console.trace();
                throw 'spec.length required for fixed length types'
            }
        } else {
            //this.is_fixed_length = false;

        }
        // Is Fixed Length?
        //  Is Numeric?
        //  Is String?

        // Is Fixed Size

        // Flags... as binary???

    }
}

class BOD_Native_Number extends Binary_Object_Native_Type_Definition {
    constructor(spec) {
        spec.is_numeric = true;
        super(spec);
    }
}

class BOD_Ui8 extends BOD_Native_Number {
    constructor(spec) {
        spec.is_fixed_length = true;
        spec.length = 1;
        super(spec);
    }
}
class BOD_Ui16 extends BOD_Native_Number {
    constructor(spec) {
        spec.is_fixed_length = true;
        spec.length = 2;
        super(spec);
    }
}


// BOD_Native_Typed_Array

//  then specific types...

class BOD_Native_Typed_Array extends Binary_Object_Native_Type_Definition {
    constructor(spec) {
        super(spec);
    }
}

class BOD_Ui8_Array extends BOD_Native_Typed_Array {
    constructor(spec) {
        spec.is_fixed_length = true;
        //spec.length = 1;
        super(spec);
    }
}
class BOD_Ui16_Array extends BOD_Native_Typed_Array {
    constructor(spec) {
        spec.is_fixed_length = true;
        //spec.length = 2;
        super(spec);
    }
}



// May change to BOD buffer, consider node buffer similarities / code reuse.

// Just define it here, but may use different interpretation methods depending on needs.


// Be able to store the name of the deserializer / oo class.
//  Eg Huffman tree object will get built in a way that makes use of 2 BOD_Buffers.
class BOD_Buffer extends Binary_Object_Native_Type_Definition {
    constructor(spec) {
        super(spec);
    }
}


// is_fixed_length = 'optional'? 2?
//  leave undefined....

// strings not necessarily fixed length.
//  can be?
//  not for now, not by default?

class BOD_String extends Binary_Object_Native_Type_Definition {
    constructor(spec) {
        spec.is_string = true;
        super(spec);
    }
}

class BOD_Utf8_String extends BOD_String {
    constructor(spec) {
        super(spec);
    }
}

class BOD_Ascii_String extends BOD_String {
    constructor(spec) {
        super(spec);
    }
}

class Binary_Object_Segment_Definition extends Binary_Object_Definition {
    constructor(spec = {}) {
        super(spec);
        if (spec.end) this.end = spec.end;
        this.sequence = [];
        // function to get length - can it be added up, is it known automatically? is it one of the values read?
    }
}

// JPEG_Binary_Object_Definition
// JPEG_Chunk_BOD

//  etc
//  can have object reading functions - as in how JPEG chunks in general get read.
//  same with PNG object reading functions.

//module.exports = Binary_Object_Definition;

module.exports = {
    Binary_Object_Definition: Binary_Object_Definition,
    Binary_Object_Native_Type_Definition: Binary_Object_Native_Type_Definition,
    BOD_Ui8: BOD_Ui8,
    BOD_Ui16: BOD_Ui16,
    BOD_String: BOD_String,
    BOD_Utf8_String: BOD_Utf8_String,
    BOD_Ascii_String: BOD_Ascii_String,

    BOD_Ui8_Array: BOD_Ui8_Array,
    BOD_Ui16_Array: BOD_Ui16_Array,

    BOD_Buffer: BOD_Buffer,

    Binary_Object_Segment_Definition: Binary_Object_Segment_Definition
}