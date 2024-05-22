<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>Hello {{$host->name}}</div>
    <div>Your cohost {{$cohost->name}} is trying to {{$cohostRequest}} an apartment please approve or decline</div>
    <div><a href="https://shortletbooking.com/EditHostHomes/{{$hosthome->id}}">Click to view apartment</a></div>
    <div>
        @if ($cohostRequest == "create")
        <a href="{{ route('approveHomeForHost', ['hostid' => $host->id, 'hosthomeid' => $hosthome->id]) }}">Click to approve</a>
        <a href="{{ route('disapproveHomeForHost', ['hostid' => $host->id, 'hosthomeid' => $hosthome->id]) }}">Click to decline</a>
        
        @else
            <a href="{{ route('approveDeleteHomeForHost', ['hostid' => $host->id, 'hosthomeid' => $hosthome->id]) }}">Click to approve deletion</a>
            <a href="{{ route('disapproveDeleteHomeForHost') }}">Click to decline deletion</a>
        @endif
    </div>
</body>
</html>