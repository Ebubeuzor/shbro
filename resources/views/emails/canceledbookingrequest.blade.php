<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Request Cancelled</title>
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
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table class="wrapper" width="600" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="padding: 20px 0 0 0;" class="padding">
                            <a href="https://shortletbooking.com" target="_blank">
                                <img src="https://shortletbooking.com/assets/logo-94e89628.png" alt="Shrbo Logo" width="150" style="display: block; padding: 0; color: #666666; text-decoration: none; font-family: Arial, sans-serif; font-size: 16px;" border="0" class="img-max">
                            </a>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 20px;">
                            <h1 style="color: #333333;">Your Booking Request Has Been Cancelled</h1>
                            <p style="color: #555555;">
                                Dear {{ $userName }},
                            </p>
                            <p style="color: #555555;">
                                We regret to inform you that your booking request for <strong>{{ $apartmentName }}</strong> has been automatically cancelled because it was not completed within 24 hours.
                            </p>
                            <p style="color: #555555;">
                                If you still wish to stay at <strong>{{ $apartmentName }}</strong>, please feel free to make a new booking request. We would be delighted to host you!
                            </p>
                            <p style="color: #555555;">
                                If you have any questions or need assistance, don't hesitate to reach out. We're here to help!
                            </p>
                            <div>
                                <a href="https://shortletbooking.com/ListingInfoMain/{{ $apartmentId }}" class="button">Rebook Now</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#f4f4f4" style="padding: 20px;">
                            <p style="color: #777777;">Thank you for choosing Shrbo!</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
