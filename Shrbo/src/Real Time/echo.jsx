import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1';
const pusherHost = import.meta.env.VITE_PUSHER_HOST ?? `ws-${pusherCluster}.pusher.com`;
const pusherPort = import.meta.env.VITE_PUSHER_PORT ?? 443;
const pusherScheme = import.meta.env.VITE_PUSHER_SCHEME ?? 'https';

const echo = new Echo({
    broadcaster: 'pusher',
    key: "app-key",
    cluster: pusherCluster,
    wsHost: 'shortletbooking.com',
    wsPort: pusherPort,
    wssPort: pusherPort,
    forceTLS: pusherScheme === 'https',
    authEndpoint: 'https://shortletbooking.com/broadcasting/auth', // Change to your actual auth endpoint
    auth: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('tokens'), // Make sure to set your token retrieval logic
        },
    },
    // Add other options as needed
});

// Ensure that Echo is properly initialized before using it
echo.connector.pusher.connection.bind('connected', function () {
    console.log('Pusher connected');
    window.Echo.channel('new-public-channel')
        .listen('NewEvent', (e) => {
            console.log(e);
        });
});

window.Echo = echo;

export default echo;
