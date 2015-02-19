'use strict';
/* global sofa */

describe('sofa.couponService', function () {

    var couponService, httpService, basketService;

    var createHttpService = function () {
        return new sofa.mocks.httpService(new sofa.QService());
    };

    var createCouponService = function (httpService) {

        var configService = new sofa.ConfigService();

        basketService = new sofa.BasketService(
            new sofa.MemoryStorageService(),
            configService
        );

        var checkoutService = new sofa.CheckoutService(
            httpService,
            new sofa.QService(),
            basketService,
            new sofa.LoggingService(configService),
            configService
        );

        return new sofa.CouponService(
            httpService,
            new sofa.QService(),
            basketService,
            checkoutService,
            new sofa.LoggingService(configService),
            configService
        );
    };

    beforeEach(function () {
        httpService = createHttpService();
        couponService = createCouponService(httpService);
    });

    it('should be defined', function () {
        expect(couponService).toBeDefined();
    });

    describe('async tests', function () {

        it('submitting a code returns a valid response', function (done) {

            httpService
                .when('POST', sofa.Config.checkoutUrl + 'coupon.php')
                .respond({
                    amount: 0,
                    code: 'TENEURO',
                    description: '10 EURO',
                    error: null,
                    freeShipping: '0',
                    name: '10 EURO',
                    sortOrder: '0',
                    type: 'fix'
                });

            couponService.submitCode('TENEURO')
                .then(function (response) {
                    expect(response).toBeDefined();
                    expect(response.code).toEqual('TENEURO');
                    done();
                });
        });
        it('submitting an empty code returns an error', function (done) {

            httpService
                .when('POST', cc.Config.checkoutUrl + 'coupon.php')
                .respond({
                    amount: 0,
                    code: 'TENEURO',
                    description: '10 EURO',
                    error: null,
                    freeShipping: '0',
                    name: '10 EURO',
                    sortOrder: '0',
                    type: 'fix'
                });

            couponService.submitCode('')
                .then(function () {}, function (err) {
                    expect(err).toBeDefined();
                    done();
                });
        });

        it('submitting an invalid code returns an error', function (done) {

            httpService
                .when('POST', sofa.Config.checkoutUrl + 'coupon.php')
                .respond({
                    amount: null,
                    code: null,
                    description: null,
                    error: 'Invalid',
                    freeShipping: null,
                    name: null,
                    sortOrder: null,
                    type: null
                });

            couponService.submitCode('ORLY')
                .then(function () {}, function (err) {
                    expect(err).toBeDefined();
                    done();
                });
        });

        it('changing an item in the cart also updates the active coupons', function (done) {
            basketService.clear();

            var product = new sofa.models.Product();
            product.name = 'Testproduct';
            product.id = 1;
            product.price = 2.5;
            product.tax = 19;

            var basketItem = basketService.addItem(product, 1, null);
            var summary = basketService.getSummary();

            expect(summary.total).toEqual(7.5);

            httpService
                .when('POST', cc.Config.checkoutUrl + 'coupon.php')
                .respond({
                    amount: 2.5,
                    code: 'TENEURO',
                    description: '10 EURO',
                    error: null,
                    freeShipping: '0',
                    name: '10 EURO',
                    sortOrder: '0',
                    type: 'fix'
                });

            // Now increase the quantity of the item and check again
            basketService.once('couponAdded', function () {
                var summary = basketService.getSummary();

                expect(summary.total).toEqual(5.0);

                httpService.clear();
                httpService
                    .when('POST', cc.Config.checkoutUrl + 'coupon.php')
                    .respond({
                        amount: 5.0,
                        code: 'TENEURO',
                        description: '10 EURO',
                        error: null,
                        freeShipping: '0',
                        name: '10 EURO',
                        sortOrder: '0',
                        type: 'fix'
                    });

                basketService.once('couponAdded', function () {
                    var summary = basketService.getSummary();

                    expect(summary.total).toEqual(5.0);
                    done();
                });

                basketService.increaseOne(basketItem);
            });
            couponService.submitCode('TENEURO');

        });
    });
});
