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
    function initializeEcho(token) {
        const receiverId = 1;

        console.log('Starting Echo initialization...');

        if (typeof window.Echo !== 'undefined') {
            console.log('Echo is defined. Proceeding with initialization.');

            const channelName = `messanger.${receiverId}`;
            console.log('Channel name:', channelName);

            window.Echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;

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
        fetch('/api/api/token/1')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            initializeEcho(data.token);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

</script>

</body>
</html>
