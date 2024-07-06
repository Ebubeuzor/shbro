<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Apartment Listing Pending Approval</title>
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
        New apartment listing pending approval - please review.
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
                                        <strong>New Apartment Listing Pending Approval</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello Team,</p>
                                        <p>We have received a new apartment listing that requires your prompt attention for approval. Here are the details of the listing:</p>
                                        
                                        <ul style="padding-left: 20px;">
                                            <li><strong>Host Name</strong>: {{$host->name}}</li>
                                            <li><strong>Apartment Name</strong>: {{$hosthome->title}}</li>
                                            <li><strong>Location</strong>: {{$hosthome->address}}</li>
                                            <li><strong>Number of Rooms</strong>: {{$hosthome->bedroom}}</li>
                                            <li><strong>Bathroom Number</strong>: {{$hosthome->bathrooms}}</li>
                                            <li><strong>Listing Created On</strong>: {{$hosthomeCreation}}</li>
                                        </ul>
                                        
                                        <p>Please review the listing for compliance with our standards and guidelines. Ensure that all information is accurately represented and that the property meets our quality and safety criteria.</p>
                                        
                                        <p><strong>Review Link</strong>: <a href="https://shortletbooking.com/HostHome/{{$hosthome->id}}" style="color: #4CAF50;">Click to Review Listing</a></p>
                                        
                                        <p>The timely approval of listings plays a crucial role in maintaining efficient operations and satisfaction among our users. Your prompt review and decision on this listing would be greatly appreciated.</p>
                                        
                                        <p><strong>Additional Notes</strong>:</p>
                                        <ul style="padding-left: 20px;">
                                            <li>Ensure photos are clear and professionally presented.</li>
                                            <li>Verify host details and property descriptions for accuracy.</li>
                                            <li>Check for any potential discrepancies or issues that might affect approval.</li>
                                        </ul>
                                        
                                        <p>Thank you for your cooperation and dedication to maintaining the quality of our platform.</p>
                                        
                                        <p>Best regards,<br> {{$user->name}}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://shortletbooking.com/HostHome/{{$hosthome->id}}" class="button" style="background-color: orangered; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Review Listing</a>
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