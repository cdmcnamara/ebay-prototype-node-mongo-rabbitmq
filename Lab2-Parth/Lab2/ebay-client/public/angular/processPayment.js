var processPaymentApp = angular.module('processPaymentApp', []);

processPaymentApp.controller("processPaymentCtrl",function ($scope,$http,$window)
{

    $scope.process=false;
    $scope.placed=true;
    $scope.getCartData=function ()
    {
        $http
        ({
            method: "get",
            url: '/loadCart',

        }).success(function (data) {
            if (data.statusCode == 200)
            {
                $scope.cartData=data.cartData;
                $scope.setTotal();
                $scope.placeOrder();
            }
        });
    }

    $scope.setTotal=function()
    {
        var total=0
        for(var i=0;i<$scope.cartData.length;i++)
        {
            total=total+($scope.cartData[i].quantity*$scope.cartData[i].price);
        }
        $scope.total=total;
    }

    $scope.placeOrder=function ()
    {
        $http
        ({
            method: "POST",
            url: '/addOrderEntry',
            data:
            {
                "total":$scope.total,
                "cartData":$scope.cartData
            }
        }).success(function (data)
        {
            if (data.statusCode == 401)
            {
                console.log("order entry failed")
            }
            else if (data.statusCode == 200)
            {
                console.log("order entry successful");
                $scope.process=true;
                $scope.placed=false;
            }

        });
    }

});