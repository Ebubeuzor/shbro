<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Password</title>
  <style>
    body {
    margin: 0;
    font-family: Arial, sans-serif;
    }

    .flex {
    display: flex;
    }

    .flex-col {
    flex-direction: column;
    }

    .h-screen {
    height: 100vh;
    }

    .items-center {
    align-items: center;
    }

    .justify-center {
    justify-content: center;
    }

    .mt-14 {
    margin-top: 3.5rem;
    }

    .text-2xl {
    font-size: 1.5rem;
    }

    .font-bold {
    font-weight: bold;
    }

    .mb-4 {
    margin-bottom: 1rem;
    }

    .block {
    display: block;
    }

    .mb-2 {
    margin-bottom: 0.5rem;
    }

    .border {
    border: 1px solid;
    }

    .border-gray-300 {
    border-color: #ccc;
    }

    .rounded {
    border-radius: 0.25rem;
    }

    .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    }

    .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    }

    .w-full {
    width: 100%;
    }

    .bg-black {
    background-color: black;
    border: none;
    padding: 10px;
    }

    .hover\:bg-black-700:hover {
    background-color: #333;
    }

    .text-white {
    color: white;
    }

    .uppercase {
    text-transform: uppercase;
    }

    #server_error{
        font-weight: 400;
        font-size: 13px;
        color: red;
    }
  </style>
</head>
<body>
  <div class="flex flex-col h-screen">
    <div class="flex flex-col items-center justify-center flex-grow mt-14">
      <h2 class="text-2xl font-bold mb-4 fontBold">Forgot Password</h2>
      <form class="w-64" method="post" action="{{ route('changePassword') }}">
        @csrf
        
        <input type="hidden" name="token" value="{{ request('token') }}">
        <input type="hidden" name="email" value="{{ request('email') }}">
        <label for="password" class="mb-2 block fontBold">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          class="border border-gray-300 rounded px-2 py-1 mb-4 w-full"
        />
        <label for="confirm-password" class="mb-2 block fontBold">
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirm-password"
          class="border border-gray-300 rounded px-2 py-1 mb-4 w-full"
        />
        <div id="server_error"> @error('password') {{ $message }} @enderror </div>
        <div id="server_error"> @error('email') {{ $message }} @enderror </div>
        
        <div class="flex flex-col justify-between">
            <button
            type="submit"
            class="bg-black hover:bg-black-700 text-white rounded px-4 py-2 uppercase"
            >
            Confirm Password
        </button>
    </div>
      </form>
    </div>
  </div>
</body>
</html>
