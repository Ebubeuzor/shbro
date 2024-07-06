<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Urgent: Damage Report for [Apartment Name] Requires Review</title>
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
        Urgent: Damage Report for {{$hosthome->title}} Requires Review
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
                                        <strong>Urgent: Damage Report for {{$hosthome->title}} Requires Review</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello Team,</p>
                                        <p>We have received a damage report from one of our hosts concerning their property, and this matter requires your immediate attention. Below are the details of the report and the affected property:</p>
                                        <p>Host Name: {{$host->name}}</p>
                                        <p>Apartment Name: {{$hosthome->title}}</p>
                                        <p>Location: {{$hosthome->address}}</p>
                                        <p>Report Submitted On: {{$reportDamageCreation}}</p>
                                        <p>Details of the Damage: {{$reportDamageDescription}}</p>
                                        <p><strong>Action Required</strong></p>
                                        <ul>
                                            <li>Assess the details provided by the host.</li>
                                            <li>Check any submitted evidence, such as photos, videos, or receipts.</li>
                                            <li>Establish communication with the host to gather more information or clarify any details.</li>
                                            <li>Decide on the appropriate measures, which might include sending a professional inspector, contacting insurance, or initiating repair processes.</li>
                                            <li>Keep the host informed about the status of their report and any actions being taken.</li>
                                        </ul>
                                        <p>This issue not only affects our host’s property but can potentially impact our reputation and guest experience. Your prompt and thorough attention to resolving it is critical.</p>
                                        <p>If you require further information or support, please don't hesitate to reach out. Coordinating our efforts will ensure we manage this situation effectively and uphold our commitment to our hosts.</p>
                                        <p>Thank you for your immediate attention to this urgent matter.</p>
                                        <p>Best regards,</p>
                                        <p>{{$user->name}}</p>
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
