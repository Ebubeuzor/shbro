<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        /* General Reset and Basic Styles */
        body, h1, h2, h3, p, button, a {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font-family: Arial, Helvetica, sans-serif;
            text-decoration: none;
            box-sizing: border-box;
        }

        /* Flex Utility Classes */
        .flex {
            display: flex;
        }

        .items-center {
            align-items: center;
        }

        .justify-center {
            justify-content: center;
        }

        .min-h-screen {
            min-height: 100vh;
        }

        /* Background Colors */
        .bg-gray-100 {
            background-color: #f7fafc;
        }

        .bg-white {
            background-color: #ffffff;
        }

        /* Padding and Margin */
        .p-8 {
            padding: 2rem;
        }

        .mb-4 {
            margin-bottom: 1rem;
        }

        .mt-4 {
            margin-top: 1rem;
        }

        .mt-2 {
            margin-top: 1rem;
        }

        /* Rounded Corners and Shadow */
        .rounded {
            border-radius: 0.5rem;
        }

        .shadow-md {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Text Styles */
        .text-center {
            text-align: center;
        }

        .text-green-500 {
            color: #48bb78;
        }

        .text-6xl {
            font-size: 4rem;
        }

        .text-3xl {
            font-size: 2rem;
        }

        .font-semibold {
            font-weight: 600;
        }

        .text-gray-600 {
            color: #718096;
        }

        .text-blue-500 {
            color: #4299e1;
        }

        /* Button Styling */
        .btn {
            background-color: #ff9800; /* Changed to orange */
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
            display: inline-block;
        }

        .btn:hover {
            background-color: #e68a00;
            color: #fff;
        }

        .btn a {
            color: inherit;
            text-decoration: none;
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
            .p-8 {
                padding: 1.5rem;
            }

            .text-6xl {
                font-size: 3rem;
            }

            .text-3xl {
                font-size: 1.5rem;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                font-size: 0.875rem;
            }
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded shadow-md text-center">
        <div class="flex items-center justify-center text-green-500 text-6xl mb-4">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 class="text-3xl font-semibold mb-2 mt-2">Payment Successful!</h2>
        <p class="text-gray-600">Thank you for your purchase.</p>
        <p class="text-gray-600">A {{session('mobile_request')}} copy of your receipt has been sent to your email.</p>

        @if (session('mobile_request') === "empty")
            <div class="text-center mt-4">
                <a href="https://shortletbooking.com/" class="btn">
                    <span>Back to Home</span>
                </a>
            </div>
        @endif
    </div>
</body>
</html>
