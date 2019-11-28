const MQTT = require('../models/mqtt.model.js');
var moment = require('moment');
moment.locale('vi');
// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    if(!req.body.topic && !req.body.port && !req.body.host) {
        return res.status(404).send({
            message: "MQTT infomation isn't enough"
        });
    }

    // Create a Note
    const mqtt = new MQTT({
        host: req.body.host,
        port: req.body.port,
        topic: req.body.topic
    });

    // Save Note in the database
    mqtt.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    MQTT.find()
    .then(mqtts => {
        res.send(mqtts);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    MQTT.findById(req.params.mqttId)
    .then(mqtt => {
        if(!mqtt) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.mqttId
            });            
        }
        res.send(mqtt);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "MQTT not found with id " + req.params.mqttId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.mqttId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

    // Validate Request
    if(!req.body.topic && !req.body.port && !req.body.host) {
        return res.status(400).send({
            message: "MQTT content can not be empty"
        });
    }

    // Find note and update it with the request body
    MQTT.findByIdAndUpdate(req.params.mqttId, {
        host: req.body.host,
        port: req.body.port,
        topic: req.body.topic
    }, {new: true})
    .then(mqtt => {
        if(!mqtt) {
            return res.status(404).send({
                message: "MQTT not found with id " + req.params.mqttId
            });
        }
        res.send(mqtt);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "MQTT not found with id " + req.params.mqttId
            });                
        }
        return res.status(500).send({
            message: "Error updating mqtt with id " + req.params.mqttId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    MQTT.findByIdAndRemove(req.params.mqttId)
    .then(mqtt => {
        if(!mqtt) {
            return res.status(404).send({
                message: "MQTT not found with id " + req.params.mqttId
            });
        }
        res.send({message: "MQTT deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "MQTT not found with id " + req.params.mqttId
            });
        }
        return res.status(500).send({
            message: "Could not delete mqtt with id " + req.params.mqttId
        });
    });
};
