const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');

var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);
io.listen(5004);

var esp_url = "http://192.168.3.127/sms";
var test_url = "http://localhost:5003/test1";
// Socket
io.on("connection", function(socket){
    socket.on("statusSMS", function(data){
        console.log(data);
    })
})

app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");


// App homepage
app.get("/", function(req,res){
    res.render("index");
});

// http routes of app
app.post("/sendSMS", function(req,res,next){
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
        "messageId": req.body.messageId
    };
    console.log(req_send);
    
    // let url = esp_url;
    
    let url = test_url;
    axios.post(url, req_send).then(response => {
        console.log("SUCCESS");
        console.log("esp_response:", response.data);
        if(response.data.messages){
            let d = response.data.messages[0];
            let data_to_frontend;
            if ( d.messageId == req_send.messageId){
                data_to_frontend = {
                    to: d.to,
                    text: req_send.text,
                    messageId: d.messageId,
                    status: d.status
                }
            }
            else {
                data_to_frontend = {
                    to: d.to,
                    text: req_send.text,
                    messageId: d.messageId,
                    status: d.status
                }
            }
            res.status(200).send(data_to_frontend);
        }        
    })
    .catch(error => {
        console.log("ERROR");
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            res.send(error.response.data);
            }
        else res.status(500).send("Something went wrong!")
    })
})


// Other routes use package
app.post("/statusSMS", function(req, res){
    console.log("statusSMS: ",req.body);
    if(req.body.messages){
        io.emit("statusSMS", req.body.messages[0]);
        res.status(200).send("OK");
    }
    else{
        res.status(400).send("BAD_REQUEST");
    }
})

// File upload via Multer
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + '/uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname + '-' + Date.now() + '.xlsx')
    }
});

var upload = multer({storage: storage});

var supportFunction = require('./app/controllers/supportFunction.js');
app.post("/fileUpload", upload.single("file"), function(req, res){
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('./uploads/' + req.file.filename);
    var sheet_name_list = workbook.SheetNames;
    var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log("xlsx to json:",data);
    var req_send = [];
    for ( let i in data){
        if(data[i].number && data[i].message){
            req_send[i] = {
                to: data[i].number,
                text: data[i].message,
                function: 101,
                messageId: data[i].number + "-" + (Date.now()+ '-' + i)
            }
        }
    }
    res.status(200).send(req_send);

    var url = test_url;
    // let url = esp_url;
    let i = 0;
    var send_SMSs = setInterval( function(){
        console.log("json to request:", req_send[i]);
        axios.post(url, req_send[i]).then(response => {
            console.log("Res: ",response.data);
            //response_all.message.push(response.data.message[0]);
            
            if(response.data.messages){
                let d = response.data.messages[0];
                //console.log('d:',d);
                let data_to_frontend;
                for( j in req_send ){
                    if ( d.messageId == req_send[j].messageId){
                        data_to_frontend = {
                            to: d.to,
                            text: req_send[j].text,
                            messageId: d.messageId,
                            status: d.status
                        }
                    }
                    else {
                        data_to_frontend = {
                            to: d.to,
                            text: req_send[j].text,
                            messageId: d.messageId,
                            status: d.status
                        }
                    }                    
                }
                console.log("SUCCESS SENT");
                io.emit("statusSMS", data_to_frontend);
                                
                //console.log("SENT TO " + response.messages[0].to + " SUCCESSFULLY!");
            }
        })
        .catch(error => {
            console.log("ERROR");
            //console.log(error);
            if (error.response) {
                //console.log(error.response.data);
                //console.log(error.response.status);
                io.emit("statusSMS", error.response.data.messages[0]);
            }
            else console.log("404 ERROR");
            
            
        })
        if( i == (req_send.length - 1)){
            clearInterval(send_SMSs);
        }
        i++;
    },5000);
    // for ( i in data){
    //     if(data[i].number && data[i].message){
    //         req_send = {
    //             to: data[i].number,
    //             text: data[i].message,
    //             function: 101,
    //             messageId: data[i].number + "-" + Date.now()
    //         }
    //         console.log("json to request:", req_send);
    //         axios.post(url, req_send).then(response => {
    //             //console.log("Res: ",response.data);
    //             //response_all.message.push(response.data.message[0]);
    //             if(response.data.message){
    //                 io.emit("statusSMS", response.data.message[0]);
    //                 console.log("SENT TO " + response.message[0].to + " SUCCESSFULLY!");
    //             }                
    //         })
    //         .catch(error => {
    //             console.log("ERROR");
                
    //             if (error.response) {
    //                 console.log(error.response.data);
    //                 console.log(error.response.status);
    //                 io.emit("statusSMS", error.response.data.message[0]);
    //             }
    //             else console.log("404 ERROR");
                
                
    //         })
    //     }
    // }


    // setTimeout(function(){
    //     res.status(200).send(response_all);
    // },5000)
    
    
    
    //return res.status(200).send(data)
    
});

// Fake ESP test
app.post("/test1", function(req, res){
    if(!req){
        return res.status(404).send({
            message: "Empty request"
        });
    }
    sendback = {
        messages: [
            {
                to: req.body.to,
                status: {
                    id: 200,
                    name: "SUCCESS"
                },
                messageId: req.body.messageId
            }
        ]
           
    };
    console.log(sendback);
    res.status(200).send(sendback);
});

app.post("/test", function(req, res){
    res.send(req.body);
})

console.log("App running on port 5003...")
app.listen(5003);