<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <div>Hello {{$user->name}}</div>
    <div>{{$host->name}} has invited you to be a cohost of his apartments</div>

    <div>Click this link to become co host</div>
    
    <div>
        {{ route('becomeACoHost', [
            'userId' => $user->id,
            'hostid' => $host->id,
        ]) }}
    </div>
    
</body>
</html>