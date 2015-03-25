/**
 * sofa-coupon-service - v0.4.0 - Wed Mar 25 2015 14:49:38 GMT+0100 (CET)
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
