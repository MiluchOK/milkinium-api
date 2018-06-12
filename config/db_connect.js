const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

module.exports = {
    connect: function(mongoUrl){
        return mongoose.connect(mongoUrl)
    },
    teardown: function(){
        mongoose.connection.close()
    }
}