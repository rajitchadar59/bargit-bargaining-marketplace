const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor', 
        required: true, 
        index: true 
    },
    name: { 
        type: String, 
        required: [true, 'Product name is required'], 
        trim: true, 
        maxLength: [100, 'Product name cannot exceed 100 characters'] 
    },
    description: { 
        type: String, 
        required: [true, 'Product description is required'], 
        maxLength: [2000, 'Description cannot exceed 2000 characters'] 
    },
    category: { 
        type: String, 
        required: [true, 'Category is required'], 
        trim: true 
    },
    tags: [{ 
        type: String, 
        lowercase: true, 
        trim: true 
       
    }],

    specifications: [{
        key: { 
            type: String, 
            required: true, 
            trim: true 
        },
        value: { 
            type: String, 
            required: true, 
            trim: true 
        }
    }],

    mrp: { 
        type: Number, 
        required: [true, 'List Price (MRP) is required'], 
        min: [0, 'Price cannot be negative'] 
    },
    isBargainable: { 
        type: Boolean, 
        default: true 
    },
    minBargainPrice: { 
        type: Number, 

        required: function() { 
            return this.isBargainable === true; 
        },
  
        validate: { 
            validator: function(value) { 
                return value <= this.mrp; 
            }, 
            message: 'Minimum bargain price cannot exceed MRP' 
        }
    },

    stock: { 
        type: Number, 
        required: true, 
        default: 0, 
        min: [0, 'Stock cannot be negative'] 
    },
    sku: { 
        type: String, 
        trim: true, 
        unique: true, 
        sparse: true 
    },
    images: [{ 
        type: String, 
        required: [true, 'At least one image is required'] 
    }],
    video: { 
        type: String, 
        default: null 
    },

    status: { 
        type: String, 
        enum: ['Active', 'Draft'], 
        default: 'Active' 
    }

}, { 
    timestamps: true 
});

productSchema.index({ 
    name: 'text', 
    description: 'text', 
    tags: 'text', 
    category: 'text' 
});

module.exports = mongoose.model('Product', productSchema);