const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,        
        index: true        
    },
    parentId: {
        type: String
    }
    //   ancestors: [{
    //        _id: {
    //           type: mongoose.Schema.Types.ObjectId,
    //           ref: "Category",
    //           index: true
    //   },
    //        name: String,
    //        slug: String
    //   }]    
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

  categorySchema.pre('save', async function (next) {
    this.slug = slugify(this.name);
    next();
});

// categorySchema.pre('updateOne', async function (next) {
//     this.slug = slugify(this.name);
//     next();
// });

module.exports = mongoose.model('Category', categorySchema);
