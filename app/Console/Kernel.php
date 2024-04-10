<?php

namespace App\Console;

use App\Jobs\CheckInNotificationJob;
use App\Jobs\CheckOutNotificationJob;
use App\Jobs\ClearRouteCacheJob;
use App\Jobs\EndSessionJob;
use App\Jobs\FewHoursReminderJob;
use App\Jobs\ProcessEmailReminders;
use App\Jobs\TwoDayReminderJob;
use App\Models\Booking;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->job(new EndSessionJob)->everyTwoMinutes();

        $schedule->job(new ProcessEmailReminders)->daily(); // Change to everyFiveMinutes

        $bookings = Booking::where('paymentStatus','success')->get(); 

        foreach ($bookings as $booking) {
            // Schedule the TwoDayReminderJob two days before the check-in date
            $schedule->job(new TwoDayReminderJob($booking))->everyFourMinutes();

            // Schedule the FewHoursReminderJob a few hours before the check-in time
            $schedule->job(new FewHoursReminderJob($booking))->everyTwoMinutes(); // Change to everyTwoMinutes

            // Schedule the CheckInNotificationJob at the check-in time
            $schedule->job(new CheckInNotificationJob($booking))->everyFiveMinutes();

            // Schedule the CheckInNotificationJob at the check-in time
            $schedule->job(new CheckOutNotificationJob($booking))->everyTenMinutes();
        }       
    }


    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
