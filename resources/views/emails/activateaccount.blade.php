<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>Hello {{$user->name}}</div>
    <div>
        <a href="{{ route('verifyEmailOrActivateAccount', ['token' => $user->remember_token]) }}">
            <button>Activate your account</button>
        </a>
    </div>

</body>
</html>
