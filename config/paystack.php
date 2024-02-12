<?php

/*
 * This file is part of the Laravel Paystack package.
 *
 * (c) Prosper Otemuyiwa <prosperotemuyiwa@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

return [

    /**
     * Public Key From Paystack Dashboard
     *
     */
    'publicKey' => "pk_test_638a597fb47d1fa375c68695c8aaad8a651f47d6",

    /**
     * Secret Key From Paystack Dashboard
     *
     */
    'secretKey' => "sk_test_9e95c1866aa5437777d2fd286c23bc9df8a3fcea",

    /**
     * Paystack Payment URL
     *
     */
    'paymentUrl' => "https://api.paystack.co",

    /**
     * Optional email address of the merchant
     *
     */
    'merchantEmail' => getenv('MERCHANT_EMAIL'),

];
