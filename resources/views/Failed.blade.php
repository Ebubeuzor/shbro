
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <link rel="stylesheet" href="path/to/your/styles.css"> <!-- Include your own styles if needed -->
</head>
<body>

    <style>
        /* Reset some default styles */
body, h1, h2, h3, p, button, i {
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

.bg-gray-100 {
  background-color: #f7fafc;
}

.p-8 {
  padding: 2rem;
}

.bg-white {
  background-color: #ffffff;
}

.rounded {
  border-radius: 0.25rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

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
  font-size: 1.875rem;
}

.font-semibold {
  font-weight: 600;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-gray-600 {
  color: #718096;
}

.mt-4 {
  margin-top: 1rem;
}

.text-blue-500 {
  color: #4299e1;
}

.btn{
    padding: 20px;
    border-radius: 10px;
}

.btn:hover{
    background-color: black;
    color: white;
}

/* Font Awesome icons */
.fa {
  font-size: 1.25rem;
  margin-right: 0.5rem;
}

.mt-2{
    margin-top: 20px;
}

/* Add any additional CSS here */

    </style>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="p-8 bg-white rounded shadow-md text-center">
            <div class="mb-4">
                <i class="fas fa-exclamation-triangle text-red-500 fa-6x"></i>
            </div>
            <h2 class="text-3xl font-semibold mb-2 mt-2">Payment Failed</h2>
            <p class="text-gray-600">
                We're sorry, but there was an issue with your payment.
            </p>
            <p>Please try again later or contact our support.</p>

            <div class="mt-4 flex justify-center">
                <a href="/" class="text-blue-500">
                    <button class="btn">
                    <a href="http://127.0.0.1:5173/">Back to Home</a>
                    </button>
                </a>
            </div>
        </div>
    </div>
</body>
</html>

</body>
</html>