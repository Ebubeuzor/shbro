<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change Successful</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        /* Reset default styles */
        body, h1, h2, p, button {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
        }

        /* Basic styles for layout and text */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
        }

        .container {
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        .icon {
            font-size: 4rem;
            color: #48bb78;
            margin-bottom: 1rem;
        }

        .title {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .message {
            color: #718096;
            margin-bottom: 1rem;
        }

        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            background-color: #ff9800;
            color: #ffffff;
            text-transform: uppercase;
            font-weight: bold;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 1rem;
        }

        .btn:hover {
            background-color: #e68a00;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
            .container {
                padding: 1.5rem;
            }

            .icon {
                font-size: 3rem;
            }

            .title {
                font-size: 1.5rem;
            }

            .btn {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 class="title">Password Change Successful!</h2>
        <p class="message">Your password has been successfully updated. You can now use your new password to log in.</p>
        <a href="https://shortletbooking.com/" class="btn">Back to Home</a>
    </div>
</body>
</html>
