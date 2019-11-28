module.exports = (app) => {
    const mqtts = require('../controllers/mqtt.controller.js');

    // Create a new Note
    app.post('/mqtts', mqtts.create);

    // Retrieve all mqtts
    app.get('/mqtts', mqtts.findAll);

    // Retrieve a single Note with noteId
    app.get('/mqtts/:mqttId', mqtts.findOne);

    // Update a Note with noteId
    app.put('/mqtts/:mqttId', mqtts.update);

    // Delete a Note with noteId
    app.delete('/mqtts/:mqttId', mqtts.delete);
}