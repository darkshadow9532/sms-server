$('#myFormSubmit').click(function (e) {
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
        url : 'http://localhost:5003/fileUpload',
        data : formData,
        success : function(res){
            console.log(res);
            for (i in res.data){
                messages_all.push({
                    to: res.data.number,
                    text: res.data.message,
                    
                })
            }            
        },
        error : function(err){
            console.log(err);
        }
    })
});