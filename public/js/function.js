function singleSMS_status_view(singleSMS){
    switch (singleSMS.status.id){
        case 200:{
            $("#single_sttSMS").text("Gửi tin nhắn đến " + singleSMS.to + " ...");
            $("#single_sttSMS").removeClass("w3-red");
            $("#single_sttSMS").addClass("w3-green");
            break;
        }
        case 201:{
            $("#single_sttSMS").text("Gửi tin nhắn đến " + singleSMS.to + " thành công!");
            $("#single_sttSMS").removeClass("w3-red");
            $("#single_sttSMS").addClass("w3-green");
            break;
        }
        case 400:{
            $("#single_sttSMS").text("Lỗi khi gửi tin nhắn, kiểm tra cú pháp gửi!");
            $("#single_sttSMS").addClass("w3-red");
            $("#single_sttSMS").removeClass("w3-green");
            break;
        }
        case 401:{
            $("#single_sttSMS").text("Gửi tin nhắn đến " + singleSMS.to + " thất bại!");
            $("#single_sttSMS").addClass("w3-red");
            $("#single_sttSMS").removeClass("w3-green");
            break;
        }
        default: {}
    }
}