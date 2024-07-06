<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change Failed</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <style>
        /* Reset some default styles */
        body, h1, h2, h3, p, button {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font-family: inherit;
            vertical-align: baseline;
            font-family: Arial, Helvetica, sans-serif;
        }

        /* Apply basic styles */
        .flex {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f7fafc;
        }

        .p-8 {
            padding: 2rem;
            background-color: #ffffff;
            border-radius: 0.25rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            text-align: center;
            max-width: 400px;
            width: 90%;
            margin: auto;
        }

        .text-red-500 {
            color: #f56565;
        }

        .text-6xl {
            font-size: 4rem;
        }

        .text-3xl {
            font-size: 1.875rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }

        .text-gray-600 {
            color: #718096;
            margin-bottom: 1.5rem;
        }

        .btn {
            padding: 20px;
            border-radius: 10px;
            background-color: #f6ad55; /* Orange color */
            color: #ffffff;
            font-weight: bold;
            text-decoration: none;
            transition: background-color 0.3s ease;
            display: inline-block;
            cursor: pointer;
        }

        .btn:hover {
            background-color: #ed8936; /* Darker orange on hover */
        }

        .icon-remove-circle {
            font-size: 5rem;
            color: #f56565;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="flex">
        <div class="p-8">
            <div class="text-red-500 text-6xl">
                <i class="icon-remove-circle fas fa-times-circle"></i>
            </div>
            <h2 class="text-3xl">Password Change Failed</h2>
            <p class="text-gray-600">There was an issue with changing your password. Please try again later.</p>
            <a href="/" class="btn">Back to Home</a>
        </div>
    </div>
</body>
</html>
