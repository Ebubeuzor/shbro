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
    'publicKey' => "pk_live_e784de717b2a0516090033c55f0f6e5b17d8da07",

    /**
     * Secret Key From Paystack Dashboard
     *
     */
    'secretKey' => "sk_live_b39d924e894f52cc95120868d8b7b55cd7291103",

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
