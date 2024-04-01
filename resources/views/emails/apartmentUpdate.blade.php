<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>Hello {{$host->name}}</div>
    <div>Your cohost {{$cohost->name}} has updated your apartment {{$hosthome->title}} </div>
    <div><a href="{{$destination}}">Click to view apartment</a></div>
</body>
</html>