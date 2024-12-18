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
      width: 100%;
      max-width: 400px;
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

    .password-container {
      position: relative;
      width: 100%;
    }

    input[type="password"], 
    input[type="text"] {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 1rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    input[type="password"]:focus, 
    input[type="text"]:focus {
      border-color: #ff9800;
      outline: none;
    }

    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.3s ease;
      width: 24px;
      height: 24px;
    }

    .toggle-password:hover {
      opacity: 1;
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
        padding: 1rem;
        margin: 0;
      }

      h2 {
        font-size: 1.5rem;
      }

      input[type="password"], 
      input[type="text"] {
        font-size: 0.95rem;
        padding: 0.65rem 2.5rem 0.65rem 0.65rem;
      }

      .toggle-password {
        width: 20px;
        height: 20px;
        right: 8px;
      }

      button {
        padding: 0.65rem;
        font-size: 0.95rem;
      }
    }

    @media (max-width: 320px) {
      .container {
        padding: 0.75rem;
      }

      h2 {
        font-size: 1.25rem;
      }

      input[type="password"], 
      input[type="text"] {
        font-size: 0.85rem;
        padding: 0.5rem 2rem 0.5rem 0.5rem;
      }

      .toggle-password {
        width: 18px;
        height: 18px;
        right: 6px;
      }

      button {
        padding: 0.5rem;
        font-size: 0.9rem;
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
      <div class="password-container">
        <input type="password" id="password" name="password" required>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toggle-password" data-target="password">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      
      <label for="confirm-password">Confirm Password:</label>
      <div class="password-container">
        <input type="password" id="confirm-password" name="password_confirmation" required>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toggle-password" data-target="confirm-password">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      
      <div id="server_error"> 
        @error('password') {{ $message }} @enderror 
        @error('email') {{ $message }} @enderror 
      </div>
      
      <div class="button-container">
        <button type="submit">Confirm Password</button>
      </div>
    </form>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const togglePasswordIcons = document.querySelectorAll('.toggle-password');
      
      togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
          const targetId = this.getAttribute('data-target');
          const passwordInput = document.getElementById(targetId);
          
          if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.innerHTML = `
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
          } else {
            passwordInput.type = 'password';
            this.innerHTML = `
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            `;
          }
        });
      });
    });
  </script>
</body>
</html>