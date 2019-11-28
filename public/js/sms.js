//define something here
var messenger_sended = "STATUS_OK";
var messenger_not_send = "can_not_send";
var server = ""
var DD_number ="0933240207";
var server_password = "";


function display_div(id,div_status){
	id = "#" +id;
	$(id).css("display",div_status);
}

function send_data(phone_number, messenger_send, server_password, callback){
	console.log("Hello World");
	var url_full = server + "pass=" + server_password + "&number=" + phone_number + "&data=" + messenger_send;
	$.ajax({
		type: "GET",
		url: url_full,
		success: callback
	});
}
$(document).ready(function(){
	$("#submit_button").click(function(){
		var phone_number = $("#phone_number").val();
		var messenger_send = $("#messenger_box").val();
		if ( $("#server_password").val() == null || $("#server_password").val() == undefined ){
			server_password = "";
		}
		else {
			server_password = $("#server_password").val();
		}
		
		if ( server == null || server == undefined || server == ""){
			alert("Địa chỉ server không được trống");
		}
		else if( (phone_number == null) || phone_number == undefined || (phone_number == "") ){
			alert("Số điện thoại không được để trống!");
		}
		else if ( (messenger_send == null) || (messenger_send == undefined) || (messenger_send == "")){
			alert("Tin nhắn không được để trống!");
		}
		else if ( isNaN(phone_number) == true ){
			alert("Số điện thoại không hợp lệ");
		}
		else {
			send_data(phone_number, messenger_send, server_password, function(data){
				if( data.includes(messenger_sended)== true ) {
					console.log("Đã gửi tin nhắn tới số " + phone_number);
					alert("Đã gửi tin nhắn tới số " + phone_number);
				}				
			});
		}

			
	});
	
	$("#set_server").click(function(){
		server = $("#server").val();
		server += "/send/?";
		display_div("edit_server","inline");
		$("#server").prop("disabled",true);
	});
	$("#edit_server").click(function(){
		$("#server").prop("disabled", false);
		display_div("edit_server","none");
	});
});

