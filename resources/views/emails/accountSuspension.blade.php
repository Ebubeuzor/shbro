<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Important Notice Regarding Your Shrbo Account</title>
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
        Important Notice Regarding Your Shrbo Account.
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
                                        <strong>Important Notice Regarding Your Shrbo Account</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        <p>We are writing to inform you that your account with Shrbo has been temporarily suspended due to violations of our Terms of Service and Community Guidelines. This action is necessary to maintain the safety, integrity, and fair usage of our platform.</p>
                                        
                                        <p><strong>Details of Suspension</strong></p>
                                        <ul style="padding-left: 20px;">
                                            <li><strong>User Id</strong>: {{$user->id}}</li>
                                            <li><strong>Suspension Date</strong>:  {{formattedDate}} </li>
                                            <li><strong>Reason for Suspension</strong>:  {{$usermessage}} </li>
                                        </ul>
                                        
                                        <p>Your account will remain suspended indefinitely while we conduct a thorough review of the relevant activities. The duration may vary based on the nature of the violation.</p>
                                        
                                        <p><strong>Review Process</strong></p>
                                        <ul style="padding-left: 20px;">
                                            <li>During this period, we will further investigate the activities associated with your account. You will have the opportunity to provide any explanations or clarifications that may assist in our review.</li>
                                            <li>Following our review, you will be informed about the possibility of reactivating your account, along with any conditions that may apply.</li>
                                        </ul>
                                        
                                        <p>If you believe this suspension has been made in error, or if you have further information that you feel should be considered, please respond to this email or reach out to our support team at [Support Contact Information]. You must provide all relevant information to aid in a fair assessment of the situation.</p>
                                        
                                        <p>We take these matters seriously and aim to resolve them in a manner that respects the rights and safety of all our users. We appreciate your cooperation and understanding.</p>
                                        
                                        <p>Best regards,<br>The Shrbo Team.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://shortletbooking.com/ContactSupport" class="button" style="background-color: orangered; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Contact Support</a>
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
```