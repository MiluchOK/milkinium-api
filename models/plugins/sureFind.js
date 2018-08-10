const CodedError = require('../../errors').codedError

module.exports = function sureFindPlugin(schema, options) {
    schema.statics.sureFindById = function(id){
        return this.findById(id)
        .then(data => {
            if(data == null){
                throw new CodedError(`Not Found`, 404)
            }
            else{
                return data
            }
        })
    }
}