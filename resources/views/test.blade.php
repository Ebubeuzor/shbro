<!DOCTYPE html>
<html>
<head>
    <title>Event Broadcasting Test</title>
    @vite(['resources/js/app.js'])
</head>
<body>

<h1>Event Broadcasting Test</h1>

<div id="app">
    <p id="message"></p>
</div>
<script>
    function initializeEcho(token) {
        const receiverId = 1;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            console.log('Echo is defined. Proceeding with initialization.');

            const channelName = `messanger.${receiverId}`;
            console.log('Channel name:', channelName);

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 26|bDKqrICjIUHHzQUs04YkWdwBpLMyBQ3tCit4aTyT5849c379`;

            // Log the URL of the broadcasting/auth endpoint
            const broadcastingAuthUrl = window.Echo.connector.options.authEndpoint;
            console.log('Broadcasting Auth URL:', broadcastingAuthUrl);
            if (window.Echo.connector.options.auth.headers.Authorization) {
                console.log('Authentication token is set:', window.Echo.connector.options.auth.headers.Authorization);
                const privateChannel = window.Echo.private(channelName);

                privateChannel.listen('MessageSent', (e) => {
                    console.log(e);
                });

                console.log('Listening for messages on channel:', channelName);
            } else {
                console.log('Authentication token is not set.');
            }

            
        } else {
            console.error('Echo is not defined. Make sure Laravel Echo is properly configured.');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        
        initializeEcho("26|bDKqrICjIUHHzQUs04YkWdwBpLMyBQ3tCit4aTyT5849c379");

    });

</script>

</body>
</html>
