/**
 * sofa-coupon-service - v0.3.0 - Thu Feb 19 2015 15:31:07 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (angular) {
angular.module('sofa.couponService', ['sofa.core'])

.factory('couponService', ["$http", "$q", "basketService", "checkoutService", "loggingService", "configService", function ($http, $q, basketService, checkoutService, loggingService, configService) {
    'use strict';
    return new sofa.CouponService($http, $q, basketService, checkoutService, loggingService, configService);
}]);
}(angular));
