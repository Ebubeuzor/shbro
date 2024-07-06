<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1rem;
      color: #333;
    }

    .container {
      background-color: #fff;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
      box-sizing: border-box;
    }

    h2 {
      font-size: 1.875rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      color: #333;
      text-align: center;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #555;
    }

    input[type="password"] {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 1rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    input[type="password"]:focus {
      border-color: #ff9800;
      outline: none;
    }

    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
    }

    button {
      background-color: #ff9800;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      text-transform: uppercase;
      width: 100%;
      box-sizing: border-box;
    }

    button:hover {
      background-color: #e68a00;
    }

    #server_error {
      font-size: 0.875rem;
      color: red;
      margin-bottom: 1rem;
      text-align: center;
    }

    @media (max-width: 480px) {
      .container {
        padding: 1.5rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      button {
        padding: 0.75rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Forgot Password</h2>
    <form method="post" action="{{ route('changePassword') }}">
      @csrf
      <input type="hidden" name="token" value="{{ request('token') }}">
      <input type="hidden" name="email" value="{{ request('email') }}">
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
      <label for="confirm-password">Confirm Password:</label>
      <input type="password" id="confirm-password" name="password_confirmation" required>
      <div id="server_error"> 
        @error('password') {{ $message }} @enderror 
        @error('email') {{ $message }} @enderror 
      </div>
      <div class="button-container">
        <button type="submit">Confirm Password</button>
      </div>
    </form>
  </div>
</body>
</html>
