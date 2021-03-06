$('#myFormSubmit').click(function (e) {
    messages_all = [];
    var formData = new FormData();

    var fileSelect = document.getElementById("xlsx-file");
    if(fileSelect.files && fileSelect.files.length == 1){
     var file = fileSelect.files[0]
     formData.set("file", file , file.name);
    }
    $.ajax({
        method : 'POST',
        processData : false,
        contentType : false,
        url : '/fileUpload',
        data : formData,
        success : function(res){
            console.log(res);
            for (i in res){
                messages_all.push(res[i]);
            }
            multiSMS_Timeout = 10000*res.length + 10;
            $("#myFormSubmit").attr("disabled", true);
            setTimeout(function(){
                $("#myFormSubmit").attr("disabled", false);
            }, multiSMS_Timeout);
        },
        error : function(err){
            console.log(err);
        }
    })
});