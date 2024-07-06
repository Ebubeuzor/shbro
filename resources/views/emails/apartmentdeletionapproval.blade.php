<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apartment Deletion Request on Shrbo</title>
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
        .button-decline {
            background-color: #FF5733;
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
        Apartment Deletion Request on Shrbo
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
                                        <a href="https://shrbo.com" target="_blank">
                                            <img src="https://shortletbooking.com/assets/logo-94e89628.png" alt="Shrbo Logo" width="150" style="display: block; padding: 0; color: #666666; text-decoration: none; font-family: Arial, sans-serif; font-size: 16px;" border="0" class="img-max">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size: 24px; font-family: Arial, sans-serif; color: #333333; padding-top: 30px; padding-bottom: 20px;" class="padding">
                                        <strong>Apartment Deletion Request on Shrbo</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$host->name}},</p>
                                        <p>We wanted to inform you that your co-host, {{$cohost->name}}, has requested to delete the following apartment listing on Shrbo:</p>
                                        <ul>
                                            <li><strong>Host Name</strong>: {{$host->name}}</li>
                                            <li><strong>Apartment Name</strong>: {{$hosthome->title}}</li>
                                            <li><strong>Location</strong>: {{$hosthome->address}}</li>
                                            <li><strong>Number of Rooms</strong>: {{$hosthome->bedroom}}</li>
                                            <li><strong>Bathroom Number</strong>: {{$hosthome->bathrooms}}</li>
                                        </ul>
                                        <p>As the primary host, you have the option to approve or decline the deletion of this listing. Please review the details carefully before making your decision.</p>
                                        <p><strong>Manage Deletion Request:</strong> <br> <a href="https://shortletbooking.com/EditHostHomes/{{$hosthome->id}}" class="button" style="background-color: orangered; color: white; text-decoration: none; display: inline-block; font-size: 16px; padding: 15px 32px; margin: 10px 0; cursor: pointer;">Click here to view apartment</a></p>

                                        <p>
                                            <a href="{{ route('approveDeleteHomeForHost', ['hostid' => $host->id, 'hosthomeid' => $hosthome->id]) }}" class="button" style="background-color: #4CAF50; color: white; text-decoration: none; display: inline-block; font-size: 16px; padding: 15px 32px; margin: 10px 0; cursor: pointer;">Approve Deletion</a>
                                            <a href="{{ route('disapproveDeleteHomeForHost') }}" class="button-decline" style="background-color: #FF5733; color: white; text-decoration: none; display: inline-block; font-size: 16px; padding: 15px 32px; margin: 10px 0; cursor: pointer;">Decline Deletion</a>
                                        </p>
                                        <p>If you have any questions or require further assistance, feel free to contact us. Your prompt attention to this matter is appreciated.</p>
                                        <p>Thank you for being a valued part of the Shrbo hosting community.</p>
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
