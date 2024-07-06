<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Property Has Been Booked!</title>
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
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Congratulations! Your property {{$hosthome->title}} has been booked.
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
                                        <strong>Congratulations, Your Property Has Been Booked!</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$host->name}},</p>
                                        <p>Great news! Your property, {{$hosthome->title}}, has just been booked for the following dates:</p>
                                        
                                        <p><strong>Booking Details</strong></p>
                                        <ul style="padding-left: 20px;">
                                            <li><strong>Guest Name</strong>: {{$guest->name}}</li>
                                            <li><strong>Check-in Date</strong>: {{$checkInDate}}</li>
                                            <li><strong>Check-out Date</strong>: {{$checkOutDate}}</li>
                                        </ul>
                                        
                                        <p>This booking is a fantastic opportunity to showcase your wonderful accommodation and provide an exceptional experience for {{$guest->name}}.</p>
                                        
                                        <p><strong>Next Steps</strong></p>
                                        <ol style="padding-left: 20px;">
                                            <li>Ensure that your property is clean, safe, and ready for your guests' arrival.</li>
                                            <li>Reach out to {{$guest->name}} to confirm their arrival time and provide any necessary instructions or helpful tips about the property or area.</li>
                                            <li>Confirm how the guests will check-in, whether it's a key handover, a lockbox code, or another method.</li>
                                        </ol>
                                        
                                        <p>If you have any questions about this booking or need assistance in preparing for your guest's stay, our support team is here to help. You can contact us directly at info@shortletbooking.com  
                                        </p>
                                        
                                        <p>Thank you for being an essential part of the Shrbo community. We look forward to this successful booking being one of many.</p>
                                        
                                        <p>Warm regards,<br>The Shrbo Team</p>
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