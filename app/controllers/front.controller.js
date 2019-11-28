var esp_url = "http://192.168.3.127/sms";
var test_url = "http://localhost:5003/test";
const axios = require('axios');
exports.sendSMS = (req,res) =>{
    console.log("Receive SendSMS request. Processing...");
    if (!req){
        return res.status(400).send({
            message: "Empty request"
        });
    }
    let req_send = {
        "to": req.body.to,
        "text": req.body.text,
        "function": 101,
        "messageId": req.body.to + '-' + Date.now()

    };
    console.log(req_send);
    
    let url = esp_url;
    console.log(url);
    // let url = test_url;
    axios.post(url, req_send).then(response => {
        console.log("SUCCESS");
        console.log("esp_response:", response);
        res.send({
            status: "OK",
            data: req_send
        });
    })
    .catch(error => {
        console.log("ERROR");
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
          }
        res.status(500).send({
            status: "ERROR",
            data: req_send
        });
    })
    setTimeout(function(){
        
    })
}