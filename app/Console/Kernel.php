<?php

namespace App\Console;

use App\Jobs\CheckInNotificationJob;
use App\Jobs\CheckOutNotificationJob;
use App\Jobs\ClearRouteCacheJob;
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
        $schedule->call(function () {
            Log::info('Testing scheduler. Current time: ' . now());
        })->everyMinute();
        
        // $schedule->job(new ProcessEmailReminders)->everyMinute();
        // $schedule->job(new ClearRouteCacheJob)->everyMinute();

        $bookings = Booking::where('paymentStatus','success')->get(); 

        foreach ($bookings as $booking) {
            
            // Schedule the TwoDayReminderJob two days before the check-in date
            $schedule->job(new TwoDayReminderJob($booking))->everyMinute();
    
            // Schedule the FewHoursReminderJob a few hours before the check-in time
            $schedule->job(new FewHoursReminderJob($booking))->everyMinute();
    
            // Schedule the CheckInNotificationJob at the check-in time
            $schedule->job(new CheckInNotificationJob($booking))->everyMinute();
            
            // Schedule the CheckInNotificationJob at the check-in time
            $schedule->job(new CheckOutNotificationJob($booking))->everyMinute();
            
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
