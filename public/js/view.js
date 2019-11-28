$(document).ready(function(){
    
    $("#multi").css("display","none");
    

    $("#single-SMS").click(function(){
        $("#single").css("display","initial");
        $("#multi").css("display","none");
    });

    $("#multi-SMS").click(function(){
        $("#single").css("display","none");
        $("#multi").css("display","initial");
    })
})