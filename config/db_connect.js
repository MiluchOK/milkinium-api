const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

module.exports = {
    connect: function(mongoUrl){
        return mongoose.connect(mongoUrl, { useNewUrlParser: true })
    },
    teardown: function(){
        return mongoose.connection.close()
    }
}