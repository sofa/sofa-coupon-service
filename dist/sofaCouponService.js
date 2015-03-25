/**
 * sofa-coupon-service - v0.4.0 - Wed Mar 25 2015 14:49:38 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, document, undefined) {
'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.CouponService
 * @package sofa-coupon-service
 *
 * @requiresPackage sofa-core
 * @requiresPackage sofa-http-service
 * @requiresPackage sofa-q-service
 * @requiresPackage sofa-basket-service
 * @requiresPackage sofa-checkout-service
 * @requiresPackage sofa-logging-service
 *
 * @requires sofa.HttpService
 * @requires sofa.QService
 * @requires sofa.BasketService
 * @requires sofa.CheckoutService
 * @requires sofa.LoggingService
 * @requires sofa.ConfigService
 *
 * @distFile dist/sofa.couponService.js
 *
 * @description
 * A service that allows you to validate coupon codes against the backend.
 */
sofa.define('sofa.CouponService', function ($http, $q, basketService, checkoutService, loggingService, configService) {

    var self = {};

    var FORM_DATA_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'},
        CHECKOUT_URL      = configService.get('checkoutUrl'),
        FULL_CHECKOUT_URL = CHECKOUT_URL + 'coupon.php';

    /**
     * @sofadoc method
     * @name sofa.CouponService#submitCode
     * @memberof sofa.CouponService
     *
     * @description
     * Validates a coupon code against the backend.
     *
     * @example
     * couponService.submitCode(couponCode);
     *
     * @param {object} couponCode The code of the coupon to validate
     */
    self.submitCode = function (couponCode) {

        if (!couponCode) {
            return $q.reject(new Error('No couponCode given!'));
        }

        var couponModel = {
            task: 'INFO',
            coupon: couponCode,
            quote: JSON.stringify(checkoutService.createQuoteData())
        };

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: sofa.Util.toFormData,
            data: couponModel
        }).then(function (response) {
            if (response.data.error) {
                return $q.reject(response.data.error);
            }
            basketService.addCoupon(response.data);
            return response.data;
        }, function (fail) {
            loggingService.error([
                '[CouponService: submitCode]',
                '[Request Data]',
                couponModel,
                '[Service answer]',
                fail
            ]);
            return $q.reject(fail);
        });
    };

    // When the cart changes, refresh the values of the coupons
    // by sending them to the backend along with the new cart
    var updateCoupons = function () {
        var activeCoupons = basketService.getActiveCoupons();

        var oldCouponCodes = activeCoupons.map(function (activeCoupon) {
            return activeCoupon.code;
        });

        basketService.clearCoupons();

        oldCouponCodes.forEach(function (couponCode) {
            self.submitCode(couponCode);
        });
    };

    basketService
        .on('itemAdded', updateCoupons)
        .on('itemRemoved', updateCoupons)
        .on('clear', updateCoupons);

    return self;
});
}(sofa, document));
