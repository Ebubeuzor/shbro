<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>Hello {{$host->name}}</div>
    <div>Your {{$cohost->name}} is trying to create an apartment please approve or decline</div>
    <div><a href="http://localhost:5173/EditHostHomes/{{$hosthome->id}}">Click to view apartment</a></div>
    <div>
        <a href="{{ route('approveHomeForHost', ['hostid' => $host->id, 'hosthomeid' => $hosthome->id]) }}">Click to approve</a>
        <a href="{{ route('disapproveHomeForHost', ['hostid' => $host->id, 'hosthomeid' => $hosthome->id]) }}">Click to decline</a>
    </div>
</body>
</html>