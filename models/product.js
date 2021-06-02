const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,        
        index: true        
    },    
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    offers: {
        type: Number
    },    
    productPictures: [
        { img: String }
    ],
    reviews: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },            
            review: String
        }
    ],
    category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true            
    },
    attributes: {
        type: Schema.Types.ObjectId,
        ref: 'Attribute'        
    },
    variations: [
        {
            type: String
        }
    ],
    spec: String,
    creator: { 
        type: Schema.Types.ObjectId,        
        ref: 'User',
        required: true
    }  
       
}, { timestamps: true });

function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  productSchema.pre('save', async function (next) {
    this.slug = slugify(this.name);
    next();
});


module.exports = mongoose.model('Product', productSchema);
