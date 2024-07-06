<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Request Response</title>
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
        Your booking request for {{$hosthome->title}} has been $status.
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
                                        <strong>Your Booking Request has been {{$status}} </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        
                                        <!-- For Accepted Booking -->
                                        <p>Great news! I am pleased to inform you that your booking request for {{$hosthome->title}} has been accepted. We are excited to host you and look forward to providing a comfortable and memorable stay.</p>
                                        
                                        <p><strong>Booking Details</strong></p>
                                        <ul style="padding-left: 20px;">
                                            <li><strong>Property</strong>: {{$hosthome->title}}</li>
                                            <li><strong>Location</strong>: {{$hosthome->address}}</li>
                                        </ul>

                                        @if ($status == "Accepted")

                                            <p>Please proceed with the payment process through your Shrbo account to secure your booking. Once payment is confirmed, you will receive all the necessary information about your stay, including how to check-in.</p>
                                            <p>If you have any questions or need further assistance, please feel free to reach out. We're here to make your stay as enjoyable as possible.</p>
                                            <p>Thank you for choosing {{$hosthome->title}}, and see you soon!</p>
                                            <div>
                                                <a href="https://shortletbooking.com/ListingInfoMain/{{$hosthome->id}}">Click to book your apartment</a>
                                            </div>
                                        @else
    
                                            <p>Thank you for your interest in {{$hosthome->title}}. After careful consideration, I regret to inform you that I am unable to accept your booking request.</p>
                                            
                                            <p>While I won't be able to host you this time, I hope this doesn't deter you from considering {{$hosthome->title}} for your future travel plans. Many other wonderful properties on Shrbo may meet your needs.</p>
                                        
                                            <p>Thank you for considering {{$hosthome->title}}, and I wish you all the best in your travels.</p>
                                            
                                        @endif
                                        
                                        <p>Best regards</p>
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