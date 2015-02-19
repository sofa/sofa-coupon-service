angular.module('sofa.couponService', ['sofa.core'])

.factory('couponService', function ($http, $q, basketService, checkoutService, loggingService, configService) {
    'use strict';
    return new sofa.CouponService($http, $q, basketService, checkoutService, loggingService, configService);
});
