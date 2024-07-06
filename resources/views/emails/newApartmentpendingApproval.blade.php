<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your New Apartment Listing is Pending Approval</title>
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
        Your New Apartment Listing is Pending Approval
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
                                        <strong>Your New Apartment Listing is Pending Approval</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        <p>Thank you for creating a new apartment listing with Shrbo. We're excited to potentially add your property to our platform and offer it to guests from around the world.</p>
                                        <p><strong>Listing Details:</strong></p>
                                        <ul>
                                            <li><strong>Apartment Name:</strong> {{$hosthome->title}}</li>
                                            <li><strong>Location:</strong> {{$hosthome->address}}</li>
                                        </ul>
                                        <p>Your listing is currently under review by our administrative team. This process typically takes between 24-48 hours. We meticulously check the details to ensure all information aligns with our quality standards and guidelines.</p>
                                        <p>Please ensure that your listing complies with all relevant Shrbo rules and regulations. Failure to meet these requirements may result in your listing being declined. If you need to make any corrections or updates to the listing while it is under review, please do so through your host dashboard immediately. This will help avoid delays in the approval process and ensure compliance.</p>
                                        <p>We appreciate your patience during this review period. You will receive a notification once your listing has been approved and is live on our platform, provided it meets all our criteria.</p>
                                        <p>Thank you for choosing to work with Shrbo and for your commitment to providing excellent accommodations that adhere to our standards.</p>
                                        <p>Best regards,<br>The Shrbo Team</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #999999;">
                                        <p style="margin: 0;">Shrbo | 3rd Avenue Gwarinpa, Abuja, FCT, Nigeria | Contact Information</p>
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
