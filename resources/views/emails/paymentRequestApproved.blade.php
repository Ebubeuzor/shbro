<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Payment Request Has Been Approved</title>
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
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4;" bgcolor="#f4f4f4">
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
                                        <strong>Your Payment Request Has Been Approved</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        <p>We are pleased to inform you that your payment request has been successfully approved. We've processed the transaction for your upcoming stay at [Property Name], from [Check-in Date] to [Check-out Date].</p>
                                        
                                        <p><strong>Payment Details</strong></p>
                                        <ul style="padding-left: 20px;">
                                            <li><strong>Amount</strong>: {{$amount}}</li>
                                            <li><strong>Payment Date</strong>: {{$paymentDate}}</li>
                                        </ul>
                                        
                                        <p>This confirms your booking, and you're all set for your visit! You should receive a confirmation and receipt shortly. If you don't receive it within the next few hours, please check your spam folder or contact us for assistance.</p>
                                        
                                        <p>As your trip approaches, we encourage you to communicate with your host, [Host Name], regarding check-in times, key collection, and any other specific details or requests you might have for your stay.</p>
                                        
                                        <p>Should you have any questions or need further assistance regarding your booking or payment, feel free to reach out to our support team. We're here to ensure that your experience is smooth and enjoyable.</p>
                                        
                                        <p>Thank you for choosing Shrbo for your accommodation needs. We're excited to host you and hope you have a fantastic stay at [Property Name].</p>
                                        
                                        <p>Best regards,<br>The Shrbo Team</p>
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