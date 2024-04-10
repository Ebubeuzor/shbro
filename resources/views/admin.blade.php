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
            
            const channelName = `chat.admin.${receiverId}`;

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 26|bDKqrICjIUHHzQUs04YkWdwBpLMyBQ3tCit4aTyT5849c379`;

            // Log the URL of the broadcasting/auth endpoint
            const broadcastingAuthUrl = window.Echo.connector.options.authEndpoint;
            console.log('Broadcasting Auth URL:', broadcastingAuthUrl);
            if (window.Echo.connector.options.auth.headers.Authorization) {
                console.log('Authentication token is set:', window.Echo.connector.options.auth.headers.Authorization);
                const privateChannel = window.Echo.private(channelName);

                privateChannel.listen('MessageBroadcasted', (e) => {
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
        
    function endSession() {
        const receiverId = 1;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            
            const channelName = `chat.endsession.${receiverId}`;

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 26|bDKqrICjIUHHzQUs04YkWdwBpLMyBQ3tCit4aTyT5849c379`;

            if (window.Echo.connector.options.auth.headers.Authorization) {
                const privateChannel = window.Echo.private(channelName);

                privateChannel.listen('SessionEnded', (e) => {
                    console.log(e);
                });

            } else {
                console.log('Authentication token is not set.');
            }

        } else {
            console.error('Echo is not defined. Make sure Laravel Echo is properly configured.');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        
        initializeEcho("26|bDKqrICjIUHHzQUs04YkWdwBpLMyBQ3tCit4aTyT5849c379");
        endSession();
        
    });

</script>

</body>
</html>
