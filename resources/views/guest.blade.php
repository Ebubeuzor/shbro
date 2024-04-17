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

    function initializeCohostEcho() {
        const receiverId = 90;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            console.log('Echo is defined. Proceeding with initialization.');

            const channelName = `messanger.${receiverId}`;
            console.log('Channel name:', channelName);

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 29|hGPfp7ukrhleZGQDRzQKK7LyrNoXPoD6QmWqAfYG5a5b396d`;

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

    function initializeEcho() {
        const receiverId = 90;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            
            const channelName = `chat.user.${receiverId}`;

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 29|hGPfp7ukrhleZGQDRzQKK7LyrNoXPoD6QmWqAfYG5a5b396d`;

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
        
    
    function joinChat() {
        const receiverId = 90;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            
            const channelName = `join.chat.${receiverId}`;

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 29|hGPfp7ukrhleZGQDRzQKK7LyrNoXPoD6QmWqAfYG5a5b396d`;

            if (window.Echo.connector.options.auth.headers.Authorization) {
                const privateChannel = window.Echo.private(channelName);

                privateChannel.listen('JoinChatEvent', (e) => {
                    console.log(e);
                });

            } else {
                console.log('Authentication token is not set.');
            }

        } else {
            console.error('Echo is not defined. Make sure Laravel Echo is properly configured.');
        }
    }
    
    function leaveChat() {
        const receiverId = 90;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            
            const channelName = `left.chat.${receiverId}`;

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 29|hGPfp7ukrhleZGQDRzQKK7LyrNoXPoD6QmWqAfYG5a5b396d`;

            if (window.Echo.connector.options.auth.headers.Authorization) {
                const privateChannel = window.Echo.private(channelName);

                privateChannel.listen('LeaveChatEvent', (e) => {
                    console.log(e);
                });

            } else {
                console.log('Authentication token is not set.');
            }

        } else {
            console.error('Echo is not defined. Make sure Laravel Echo is properly configured.');
        }
    }
    
    function endSession() {
        const receiverId = 90;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            
            const channelName = `chat.endsession.${receiverId}`;

            window.Echo.connector.options.auth.headers.Authorization = `Bearer 29|hGPfp7ukrhleZGQDRzQKK7LyrNoXPoD6QmWqAfYG5a5b396d`;

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
        // initializeCohostEcho();
        initializeEcho();
        joinChat();
        leaveChat();
        endSession();
    });

</script>

</body>
</html>
