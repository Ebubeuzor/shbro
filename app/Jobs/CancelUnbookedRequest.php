<?php

namespace App\Jobs;

use App\Mail\BookingRequestCancelled;
use App\Models\AcceptGuestRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class CancelUnbookedRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $requestId;

    /**
     * Create a new job instance.
     *
     * @param int $requestId
     */
    public function __construct($requestId)
    {
        $this->requestId = $requestId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Fetch the booking request
        $request = AcceptGuestRequest::find($this->requestId);

        // Check if the booking request exists and the booking status is still null
        if ($request && $request->approved === 'approved' && $request->bookingstatus === null) {
            $request->approved = 'cancelled';
            $request->save();
            Cache::flush();

            Mail::to($request->user->email)->queue(new BookingRequestCancelled($request));
        }
    }

}
