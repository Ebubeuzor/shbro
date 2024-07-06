<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Important Update: Revised Service Charges</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        @media screen and (max-width: 525px) {
            .wrapper { width: 100% !important; max-width: 100% !important; }
            .responsive-table { width: 100% !important; }
            .padding { padding: 10px 5% 15px 5% !important; }
            .section-padding { padding: 0 15px 50px 15px !important; }
        }
        .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4;" bgcolor="#f4f4f4">
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Important Update: Revised Service Charges.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 10px 15px 30px 15px;" class="section-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" class="responsive-table">
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0 0 0;" class="padding">
                                        <a href="https://shortletbooking.com" target="_blank">
                                            <img src="https://shortletbooking.com/assets/logo-94e89628.png" alt="Shrbo Logo" width="150" style="display: block; padding: 0; color: #666666; text-decoration: none; font-family: Arial, sans-serif; font-size: 16px;" border="0" class="img-max">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size: 24px; font-family: Arial, sans-serif; color: #333333; padding-top: 30px; padding-bottom: 20px;" class="padding">
                                        <strong>Important Update: Revised Service Charges</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        <p>We are committed to continually enhancing our services to provide the best possible experience for you. Part of this commitment involves periodically reviewing and adjusting our service charges to align with industry standards and our service enhancements.</p>
                                        
                                        <p><strong>What's Changing?</strong></p>
                                        <p>Starting from {{$formatedDate}}, our service charges will be updated. Here’s a breakdown of the new charges:</p>
                                        <ul>
                                            <li>Guest Service Charge: {{ $guest_services_charge }}%</li>
                                            <li>Host Service Charge: {{ $host_services_charge }}%</li>
                                            <li>VAT: {{$vat}}%</li>
                                        </ul>
                                        <p>These charges are applicable for bookings, listings, transactions, and other services provided by our platform. These adjustments are necessary to sustain the high-quality services you enjoy and to support improvements and expansions in our platform capabilities.</p>
                                        
                                        <p><strong>How This Affects You</strong></p>
                                        <ul>
                                            <li>For Hosts: The updated host service rates will be applied to any bookings received from {{ $formatedDate }} onwards.</li>
                                            <li>For Guests: Any bookings made after {{ $formatedDate }} will reflect the new guest service charge rates.</li>
                                            <li>VAT: All applicable transactions will now include the updated VAT rate, ensuring compliance with local tax regulations.</li>
                                        </ul>
                                        
                                        <p>We understand that changes like these might require adjustments from our users. We appreciate your understanding and continued support as we strive to offer superb value and service.</p>
                                        
                                        <p>For detailed information on how these new rates might specifically affect your upcoming transactions, please visit our updated Contact Support Page or contact our support team at info@shortletbooking.com.</p>
                                        
                                        <p>Thank you for being a valued member of our community. We look forward to continuing to serve your needs.</p>
                                        
                                        <p>Best regards,<br>The Shrbo Team.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://shortletbooking.com/ContactSupport" class="button" style="background-color: orangered; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Contact Support</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
