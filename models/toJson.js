module.exports = { 
    virtuals: true,
    transform: function(doc, ret, options){ 
        delete ret._id;
        delete ret.__v
        return ret;
    },
}