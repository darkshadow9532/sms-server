module.exports = (app) => {
    const fronts = require('../controllers/front.controller.js');

    // SMS sent from front-end
    app.post('/sendSMS', fronts.sendSMS);
    
}