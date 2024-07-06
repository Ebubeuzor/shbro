<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }

        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
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
            .wrapper {
                width: 100% !important;
                max-width: 100% !important;
            }
            .responsive-table {
                width: 100% !important;
            }
            .padding {
                padding: 10px 5% 15px 5% !important;
            }
            .section-padding {
                padding: 0 15px 50px 15px !important;
            }
        }

        .form-button {
            background-color: #FF9800;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4;" bgcolor="#f4f4f4">
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Your booking request for {{$hosthome->title}} has been received. Please review the details.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 10px 15px 30px 15px;" class="section-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" class="responsive-table">
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #333333;" class="padding">
                                        <a href="https://shortletbooking.com" target="_blank">
                                            <img src="https://shortletbooking.com/assets/logo-94e89628.png" alt="Shrbo Logo" width="100" height="100" style="display: block; padding: 0; color: #666666; text-decoration: none; font-family: Arial, sans-serif; font-size: 16px;" border="0" class="img-max">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size: 24px; font-family: Arial, sans-serif; color: #333333; padding-top: 10px;" class="padding">Your Booking Request Has Been Received </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <h3 style="margin: 0; font-size: 18px; color: #333333;">Hello {{$user->name}},</h3>
                                        <p style="margin: 20px 0;">Thank you for your interest in booking (<span style="font-weight: bold; color: orange;">{{$hosthome->title}}</span>) with Shrbo. We've successfully received your request to book, and here are the details for your review:</p>
                                        <p style="margin: 20px 0;"><strong>Booking Details</strong></p>
                                        <p style="margin: 10px 0;"><strong>Property:</strong> {{$hosthome->title}}</p>
                                        <p style="margin: 10px 0;"><strong>Location:</strong> {{$hosthome->address}}</p>
                                        <p style="margin: 20px 0;">Your booking request has been sent to the host for approval. Hosts typically respond within 24 hours. Once your request is approved, we'll send you an email to confirm your booking and provide further details on how to proceed with the payment.</p>
                                        <p style="margin: 20px 0;">If you need to change any details about your booking or have additional requests, please do so by accessing your booking details page</p>
                                    </td>
                                </tr>
                            
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p style="margin: 20px 0;">Our customer support team is here to help ensure your booking process is smooth and enjoyable. If you have any questions or need further assistance, please don't hesitate to reach out.</p>
                                        <p style="margin: 20px 0;">Thank you for choosing Shrbo. We look forward to assisting you with your travel plans!</p>
                                        <p style="margin: 20px 0;">Best regards,</p>
                                        <p style="margin: 20px 0;"><strong>The Shrbo Team</strong></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 15px 20px 15px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" style="padding: 20px 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #999999;">
                            <p style="margin: 0;">Shrbo | 3rd Avenue Gwarinpa, Abuja, FCT, Nigeria | Contact Information</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>