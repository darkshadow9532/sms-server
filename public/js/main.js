
app.controller("main-ctrl", function($scope, $http, $interval, $timeout) {
    $scope.message = {
        to: "",
        text: "",
        messageId: ""
    }
    $scope.send = function(message){
        message.messageId = message.to + '-' + Date.now();

        singleSMS.to = message.to;
        singleSMS.text = message.text;
        singleSMS.messageId = message.messageId;

        console.log("SMS sent", message);
        $http.post("/sendSMS", message).then(function(response){
            console.log("Response:", response.data);
            if(response.data){
                if(response.data.to && response.data.status.id && response.data.messageId){
                    if(response.data.messageId == singleSMS.messageId){
                        if(response.data.status.id == 200){
                            // $("#single_sttSMS").text("Gửi tin nhắn đến " + response.data.to + " ...");
                            // $("#single_sttSMS").removeClass("w3-red");
                            // $("#single_sttSMS").addClass("w3-green");
                            singleSMS = response.data;
                            console.log(singleSMS);
                        }
                    }
                }
            }
        }).catch(err => {
            console.log(err);
           
            // $("#single_sttSMS").text("Lỗi khi gửi tin nhắn, kiểm tra cú pháp gửi!");
            // $("#single_statusSMS").removeClass("w3-green");
            // $("#single_statusSMS").addClass("w3-red");
            singleSMS.status.id = 400;
        })
        setTimeout(function(){

        },10000)
    }
    $scope.messages_view = [];
    $interval( function(){
        $scope.messages_view = messages_all;
        
        singleSMS_status_view(singleSMS);
    }, 500);
});