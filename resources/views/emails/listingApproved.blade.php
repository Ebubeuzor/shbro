<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Congratulations! Your Home Listing is Approved</title>
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
        Congratulations! Your home listing is approved and live on Shrbo.
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
                                        <strong>Congratulations! Your Home Listing is Approved</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        <p>Great news! We are pleased to inform you that your home listing, {{$hosthome->title}}, has been approved and is now active on Shrbo. Thank you for the effort you put into creating a welcoming and detailed listing for our community.</p>
                                        
                                        <p><strong>Listing Details</strong></p>
                                        <ul style="padding-left: 20px;">
                                            <li><strong>Property Name</strong>: {{$hosthome->title}}</li>
                                            <li><strong>Location</strong>: {{$hosthome->address}}</li>
                                            <li><strong>Listing ID</strong>: {{$hosthome->id}}</li>
                                        </ul>
                                        
                                        <p>Share your listing link on social media and other platforms to attract guests. Ensure your property is ready for visitors and that all amenities listed are available and in good condition. Keep an eye on your Shrbo inbox for booking requests and guest inquiries.</p>
                                        
                                        <p><strong>Your Listing Page</strong>: <a href="https://shortletbooking.com/ListingInfoMain/{{$hosthome->id}}" style="color: #4CAF50;">View Listing</a></p>
                                        
                                        <p>We believe your property will provide a wonderful experience for guests and look forward to seeing your success. Should you need any tips on hosting or have any questions, feel free to reach out to our support team.</p>
                                        
                                        <p>Thank you for choosing Shrbo to showcase your property. We’re thrilled to have you as part of our hosting community!</p>
                                        
                                        <p>Best regards,<br>The Shrbo Team.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://shortletbooking.com/ListingInfoMain/{{$hosthome->id}}" class="button" style="background-color: orangered; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">View Your Listing</a>
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
