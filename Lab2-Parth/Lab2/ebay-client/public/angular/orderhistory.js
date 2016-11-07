/**
 * Created by Parth on 12-10-2016.
 */
var orderHistoryApp = angular.module('orderHistoryApp', []);

orderHistoryApp.controller("orderHistoryCtrl",function ($scope,$http,$window)
{

    $scope.loadOrders=function()
    {
        console.log("loading user orders");
        $http
        ({
            method: "GET",
            url: '/loadOrders'


        }).success(function (data) {
            if (data.statusCode == 401)
            {
                $window.location.assign("/");
            }
            else if (data.statusCode == 200)
            {
                //console.log("Order id's loaded");
                console.log(data.orderDetails);
                $scope.orderDetails=data.orderDetails;
            }

        });

    }


});