var socket = io("http://localhost:5004");

socket.on("statusSMS", function(status){
    console.log("status:", status);
    if(status.messageId == singleSMS.messageId){
        singleSMS.status = status.status;
    }
    else {
        for (i in messages_all){
            if (status.messageId == messages_all[i]){
                messages_all[i].status = status.status;
            }
        }
    }
})