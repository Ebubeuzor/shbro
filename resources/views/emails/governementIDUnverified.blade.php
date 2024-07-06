<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Government ID Verification Update</title>
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
        Government ID Verification Update
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
                                        <strong>Government ID Verification Update</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Arial, sans-serif; color: #666666;" class="padding">
                                        <p>Hello {{$user->name}},</p>
                                        <p>We have completed the review of your government ID submission. Unfortunately, we were unable to verify your ID at this time. We are committed to maintaining the safety and integrity of our community, and as part of this commitment, we adhere to strict verification standards.</p>
                                        <p><strong>Reason for Non-Verification:</strong></p>
                                        <ul>
                                            @if ($status == "Photo Not Clear")
                                                <li>{{$status}}: The ID uploaded was blurry and the text was not legible. Please ensure that your document is clear and all text is readable.</li>
                                            @elseif ($status == "Decline")
                                                <li>{{$status}}: Unfortunately, your application has been declined. For further details or to appeal this decision, please contact our support team.</li>
                                            @elseif ($status == "Pending Verification")
                                                <li>{{$status}}: Your application is currently under review. We will notify you once the verification process is complete. Thank you for your patience.</li>
                                            @else
                                                <li>{{$status}}: Status not recognized. Please contact support for more information.</li>
                                            @endif
                                        </ul>
                                        <p><strong>How to Resolve This:</strong></p>
                                        <ul>
                                            <li>Please upload a clear, legible copy of your government-issued ID. Ensure that all information is visible and matches the details on your Shrbo profile.</li>
                                            <li>If you need assistance or have questions about the verification process, please contact our support team at info@shortletbooking.com.</li>
                                        </ul>
                                        <p>Once you have resubmitted your ID, we will reevaluate it as quickly as possible. We appreciate your cooperation and effort to meet our verification standards.</p>
                                        <p>We thank you for your understanding and look forward to assisting you in completing this important process.</p>
                                        <p>Best regards,</p>
                                        <p>The Shrbo Team</p>
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
