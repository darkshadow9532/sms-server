const mongoose = require('mongoose');

const MQTTSchema = mongoose.Schema({
    // title: String,
    // content: String
    host: String,
    port: String,
    topic: String,
    //message: String
}, {
    timestamps: true
});

module.exports = mongoose.model('MQTT', MQTTSchema);