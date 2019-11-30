var app = angular.module("app", []);

var messages_status = [];
var messages_all = [];
var singleSMS = {
    to: "",
    message: "",
    messageId: "",
    status: {
        id: 0,
        name: ""
    }
};

var multiSMS_Timeout = 0;
// app.controller("cus", function($scope, $http, $interval, $timeout) {
    
// });