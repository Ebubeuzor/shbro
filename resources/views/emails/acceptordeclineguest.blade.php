<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>Title: {{$title}}</div>
    <div>Hello {{$user->name}}</div>
    <div>{{$guestmessage}}</div>
    @if ($status == "accept")
        <div>
            <a href="http://127.0.0.1:5173/ListingInfoMain/{{$hosthomeid}}">Click to book your apartment</a>
        </div>
    @endif
</body>
</html>