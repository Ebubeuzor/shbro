
<!DOCTYPE html>
<html>
<head>
    <title>Event Broadcasting Test</title>
    
</head>
<body>

<h1>Event Broadcasting Test</h1>

<div id="app">
    <p id="message"></p>
</div>

<script type="module" src="{{ asset('build/assets/app-c0a5b4ad.js') }}"></script>

<script>
    const channelName = 'new-public-channel';

    // Check if window.Echo is defined
    if (typeof window.Echo !== 'undefined') {
        window.Echo.channel(channelName)
            .listen('NewEvent', (event) => {
                document.getElementById('message').innerText = 'Received message: ' + event.message;
            });
    } else {
        console.error('Echo is not defined. Make sure Laravel Echo is properly configured.');
    }
</script>

</body>
</html>
