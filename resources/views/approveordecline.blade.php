<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Operation Successful</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        /* Basic Reset */
        body, h1, h2, h3, p, button {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font-family: Arial, Helvetica, sans-serif;
            vertical-align: baseline;
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
        
        /* Minimum Height Utility */
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
        
        /* Padding */
        .p-8 {
            padding: 2rem;
        }
        
        /* Border Radius */
        .rounded {
            border-radius: 0.5rem; /* Slightly larger for better visual appeal */
        }
        
        /* Shadow */
        .shadow-md {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        /* Text Centering */
        .text-center {
            text-align: center;
        }
        
        /* Text Colors */
        .text-green-500 {
            color: #48bb78;
        }
        
        .text-gray-600 {
            color: #718096;
        }
        
        .text-blue-500 {
            color: #4299e1;
        }
        
        /* Font Sizes */
        .text-6xl {
            font-size: 4rem;
        }
        
        .text-3xl {
            font-size: 1.875rem;
        }
        
        /* Font Weight */
        .font-semibold {
            font-weight: 600;
        }
        
        /* Margins */
        .mb-4 {
            margin-bottom: 1rem; /* Consistent spacing */
        }
        
        .mt-4 {
            margin-top: 1rem;
        }
        
        .mt-2 {
            margin-top: 0.5rem;
        }
        
        /* Button Styles */
        .btn {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 10px;
            background-color: #FF5733; /* Orange background */
            color: white;
            font-size: 1rem;
            font-weight: bold;
            text-decoration: none;
            transition: background-color 0.3s, color 0.3s; /* Smooth transition for hover effects */
        }
        
        .btn:hover {
            background-color: #C6452D; /* Darker orange on hover */
            color: #e2e8f0; /* Light gray text on hover */
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="flex items-center justify-center min-h-screen">
        <div class="p-8 bg-white rounded shadow-md text-center">
            <!-- Icon Section -->
            <div class="flex items-center justify-center text-green-500 text-6xl mb-4">
                <i class="fas fa-check-circle"></i>
            </div>
            <!-- Message Section -->
            <div class="text-center mt-4 text-gray-600">
                @if (Session::has('status'))
                  <p class="font-semibold text-3xl">{{ Session::get('status') }}</p>
                @endif
            </div>
            <!-- Button Section -->
            <div class="text-center mt-4">
                <a href="https://shortletbooking.com/" class="btn">Back to Home</a>
            </div>
        </div>
    </div>
</body>
</html>
