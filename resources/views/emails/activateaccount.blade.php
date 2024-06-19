<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reactivate Your Account</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 200px;
        }
        h1 {
            color: rgb(251, 146, 60); /* Custom orange color */
        }
        a {
            color: rgb(251, 146, 60); /* Custom orange color */
            text-decoration: none;
        }
        .popup-notification {
            margin-top: 30px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #fff;
            text-align: center;
        }
        .popup-notification a {
            padding: 10px 20px;
            text-decoration: none;
            color: #fff;
            background-color: rgb(251, 146, 60); /* Custom orange color */
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo">
            <img src="https://shortletbooking.com/assets/logo-94e89628.png" alt="Shrbo Logo">
        </div>
        <h1>Welcome Back to <a href="https://shrbo.com">Shrbo</a> – Reactivate Your Account</h1>
        <p>Hello {{$user->name}},</p>
        <p>We noticed that your account with us is currently inactive. If you'd like to reactivate your account and continue enjoying the benefits of being a Shrbo member, simply follow the link below.</p>
        <p><strong>Reactivate Account:</strong> <a href="https://shrbo.com/reactivate">[Link to Reactivate]</a></p>
        <p>We look forward to having you back as part of our community. If you have any questions or need assistance during the reactivation process, please don't hesitate to reach out to us.</p>
        <p>Welcome back to <a href="https://shrbo.com">Shrbo</a>!</p>
        <p>Best regards,<br>The Shrbo Team.</p>
    </div>
    
    <div class="popup-notification">
        <p><strong>Account Reactivation Alert</strong></p>
        <p>Would you like to reactivate your account and rediscover the convenience of Shrbo?</p>
        <a href="{{ route('verifyEmailOrActivateAccount', ['token' => $user->remember_token]) }}">Click here to get started.</a>
    </div>
</body>
</html>
