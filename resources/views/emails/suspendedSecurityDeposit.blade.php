<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notice Regarding Your Security Deposit</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        
        body { 
            margin: 0; 
            padding: 0; 
            height: 100%; 
            width: 100%; 
            font-family: Arial, sans-serif; 
            background-color: #f7f7f7; 
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #e9e9e9;
        }
        
        .email-header img {
            width: 150px;
        }
        
        .email-body {
            padding: 20px;
            color: #333333;
        }
        
        .email-body h1 {
            font-size: 24px;
            color: #333333;
        }
        
        .email-body p {
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .email-footer {
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666666;
            border-top: 1px solid #e9e9e9;
        }

        .email-footer a {
            color: #FF5733;
            text-decoration: none;
        }

        .button {
            background-color: #FF5733;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #C6452D;
        }

        .info-box {
            background-color: #f0f0f0;
            border-left: 4px solid #FF5733;
            padding: 10px;
            margin-bottom: 20px;
        }

        .info-box p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://shortletbooking.com/assets/logo-94e89628.png" alt="Shrbo Logo">
        </div>
        <div class="email-body">
            <h1>Notice Regarding Your Security Deposit</h1>
            <p>Hello {{$user->name}},</p>
            <p>We hope you enjoyed your stay at {{$hosthome->title}}. However, it has come to our attention that there may have been damage reported at the property during your stay. As a result, we have paused the release of your security deposit while we conduct an investigation.</p>
            <div class="info-box">
                <p><strong>Details of the Report</strong></p>
                <p><strong>Reported Damage:</strong> {{$damage}}</p>
                <p><strong>Date of Report:</strong> {{$complainDate}}</p>
                <p><strong>Location:</strong> {{$hosthome->address}}</p>
            </div>
            <p>Our team is currently reviewing the situation and assessing the extent of the damage. We aim to resolve these matters fairly and promptly. You will be informed of all developments and any potential charges that might be applied against your security deposit.</p>
            <p>Your cooperation and response would be greatly appreciated. If you have any information, photos, or comments that could assist us in this investigation, please respond to this email or contact us at info@shortletbooking.com.</p>
            <p>We understand the inconveniences such situations may cause and are committed to ensuring a fair resolution. Thank you for your understanding and cooperation.</p>
            <p>Best regards,<br>The Shrbo Team</p>
            <a href="https://shortletbooking.com/contact" class="button">Contact Us</a>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 Shrbo. All rights reserved.</p>
            <p>If you have any questions, please <a href="https://shortletbooking.com/contact">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
