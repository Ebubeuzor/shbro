<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <div>Hello {{$user->name}}</div>

    <div>Click this link to become co host of {{$hosthome->title}} </div>
    
    <div>
        {{ route('becomeACoHost', [
            'userid' => $user->id,
            'hosthomeid' => $hosthome->id,
        ]) }}
    </div>
    
</body>
</html>