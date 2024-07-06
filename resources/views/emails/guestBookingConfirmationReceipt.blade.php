<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation: Your Stay at {{$hosthome->title}}</title>
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
        Your booking at {{$hosthome->title}} is confirmed for {{$checkin}}. We're excited to host you!
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
                                        <strong>Booking Confirmation: Your Stay at {{$hosthome->title}}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        <p>We are delighted to confirm your booking at {{$hosthome->title}}! Below are the details of your upcoming stay. We're excited to be a part of your travel plans, and we're committed to ensuring a wonderful experience.</p>
                                        
                                        <p><strong>Booking Details</strong></p>
                                        <ul style="padding-left: 20px;">
                                            <li><strong>Property Name</strong>: {{$hosthome->title}}</li>
                                            <li><strong>Host Name</strong>: {{$user->name}}</li>
                                            <li><strong>Location</strong>: {{$hosthome->address}}</li>
                                            <li><strong>Check-in Date</strong>: {{$checkin}}</li>
                                            <li><strong>Check-out Date</strong>: {{$checkout}}</li>
                                        </ul>
                                        
                                        <p>Start packing and planning for your trip! If you have any specific needs or requests, please feel free to reach out to your host, {{$user->name}}, directly. {{$user->name}} will provide details about check-in procedures closer to your arrival date, including how to access the property, key collection, and any other important instructions.</p>
                                        
                                        <p>For any questions during your stay, you can always contact your host via the Shrbo messaging platform.</p>
                                        
                                        <p>An itinerary for your stay, along with a receipt of your booking, has been attached to this email.</p>
                                        
                                        <p>If you have any questions about your booking or need further assistance, our support team is here to help.</p>
                                        
                                        <p>Thank you for choosing Shrbo for your accommodation needs. We hope your stay at {{$hosthome->title}} is pleasant and memorable. Safe travels!</p>
                                        
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