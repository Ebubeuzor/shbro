<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingApartmentRequest;
use App\Http\Resources\BookedResource;
use App\Mail\NotificationMail;
use App\Models\Booking;
use App\Models\HostHome;
use App\Models\User;
use App\Models\UserTrip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use KingFlamez\Rave\Facades\Rave as Flutterwave;
use Unicodeveloper\Paystack\Facades\Paystack;

class BookingsController extends Controller
{

    /**
     * @lrd:start
     * Description: This endpoint allows users to book an apartment. Users can either use an existing card or provide new card details for payment.
     *
     * Request Payload:
     * - check_in: The check-in date in the format dd/mm/YYYY.
     * - check_out: The check-out date in the format dd/mm/YYYY.
     * - adults: Number of adults.
     * - children: Number of children.
     * - pets: Number of pets.
     * - infants: Number of infants.
     * - option: Payment option (1 for existing card, 2 for new card).
     * - card_number (if option is 2): The card number for a new card.
     * - expiry_data (if option is 2): The expiry date of the card in the format MM/YY.
     * - CVV (if option is 2): The CVV of the card.
     *
     * Response:
     * - Success (200 OK):
     *   {
     *     "payment_link": "https://paystack.com/pay/transaction-id"
     *   }
     * - Failure (400 Bad Request):
     *   {
     *     "message": "This Home is already booked for the selected dates",
     *     "booked_dates": [
     *       "2nd January 2024 - 5th January 2024",
     *       "10th February 2024 - 15th February 2024"
     *     ],
     *     "dateDifference": 3
     *   } etc
     * @lrd:end
     */
    public function bookApartment(BookingApartmentRequest $request, $hostHomeId, $userId)
    {
        $data = $request->validated();
        $user = User::find($userId);
        $hostHome = HostHome::find($hostHomeId);

        // Convert check_in and check_out to DateTime objects
        $checkIn = \DateTime::createFromFormat('d/m/Y', $data['check_in']);
        $checkOut = \DateTime::createFromFormat('d/m/Y', $data['check_out']);

        // Ensure that check_in and check_out are present or future dates
        $currentDate = new \DateTime();
        if ($checkIn < $currentDate || $checkOut < $currentDate) {
            return response("Invalid date. Dates must be present or future dates.", 400);
        }

        $dateDifference = $checkOut->diff($checkIn)->days;

        // Retrieve the booking with the specified hostHomeId
        $bookings = Booking::where('host_home_id', $hostHomeId)
        ->where('paymentStatus','success')
        ->get();

        foreach ($bookings as $booking) {
            // Check if the selected dates are valid
            if (!$checkIn || !$checkOut) {
                return response("Invalid date format", 400);
            }

            // Check if the check-out date is after the check-in date
            if ($checkOut <= $checkIn) {
                return response("Invalid date range", 400);
            }

            // Check if the HostHome is already booked for the selected dates
            $isBooked = Booking::where('host_home_id', $hostHomeId)
            ->where('id', '!=', $booking->id)
            ->where('paymentStatus', 'success')
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->where(function ($query) use ($checkIn, $checkOut) {
                    $query->whereRaw('? >= DATE(check_in)', [$checkIn->format('Y-m-d')])
                        ->whereRaw('? < DATE(check_out)', [$checkIn->format('Y-m-d')]);
                })->orWhere(function ($query) use ($checkIn, $checkOut) {
                    $query->whereRaw('? > DATE(check_in)', [$checkOut->format('Y-m-d')])
                        ->whereRaw('? <= DATE(check_out)', [$checkOut->format('Y-m-d')]);
                })->orWhere(function ($query) use ($checkIn, $checkOut) {
                    $query->whereRaw('? = DATE(check_in)', [$checkIn->format('Y-m-d')])
                        ->whereRaw('? = DATE(check_out)', [$checkOut->format('Y-m-d')]);
                });
            })
            ->exists();



            if ($isBooked) {
                $bookedDates = Booking::where('host_home_id', $hostHomeId)
                    ->where('id', '!=', $booking->id)
                    ->where(function ($query) use ($checkIn, $checkOut) {
                        $query->where(function ($query) use ($checkIn, $checkOut) {
                            $query->whereRaw('? >= DATE(check_in)', [$checkIn->format('Y-m-d')])
                                ->whereRaw('? < DATE(check_out)', [$checkIn->format('Y-m-d')]);
                        })->orWhere(function ($query) use ($checkIn, $checkOut) {
                            $query->whereRaw('? > DATE(check_in)', [$checkOut->format('Y-m-d')])
                                ->whereRaw('? <= DATE(check_out)', [$checkOut->format('Y-m-d')]);
                        });
                    })
                    ->pluck('check_in', 'check_out');
            
                foreach ($bookedDates as $checkOutDate => $checkInDate) {
                    $formattedCheckIn = date('jS F Y', strtotime($checkInDate));
                    $formattedCheckOut = date('jS F Y', strtotime($checkOutDate));
            
                    $formattedDates[] = "{$formattedCheckIn} - {$formattedCheckOut}";
                }
            
                return response([
                    'message' => 'This Home is already booked for the selected dates',
                    'booked_dates' => $formattedDates,
                    'dateDifference' => $dateDifference 
                ], 400);
            }
        
        }

        $selectedUserCard = "";
        if ($data['option'] == 1) {
            $selectedUserCard = $user->userCards()->where('Selected', 'Selected')->first();
            if (!$selectedUserCard) {
                return response("No card selected",400);
            }
        }elseif ($data['option'] == 2) {
            $selectedUserCard = [
                "card_number" => $data["card_number"],
                "expiry_data" => $data["expiry_data"],
                "CVV" => $data["CVV"],
            ];
        }else{
            return response("Invalid option",400);
        }

        $booking = new Booking();
        if (!is_null($checkIn) && !is_null($checkOut)) {
            $booking->check_in = $checkIn->format('Y-m-d');
            $booking->check_out = $checkOut->format('Y-m-d');
        }
        $booking->adults = $data['adults'];
        $booking->children = $data['children'];
        $booking->pets = $data['pets'];
        $booking->infants = $data['infants'];
        $booking->duration_of_stay = $dateDifference;
        $booking->check_in = $checkIn->format('Y-m-d');
        $booking->check_out = $checkOut->format('Y-m-d');
        $booking->user_id = $user->id;
        $booking->host_home_id = $hostHome->id;
        $booking->hostId = $hostHome->user_id;
        $booking->save();

        // Generate a payment reference
        $reference = Paystack::genTranxRef();

        $recentToken = $user->tokens->last();

        $total = ((intval($hostHome->total) * $dateDifference) + intval($hostHome->security_deposit)) * 100;
        info((intval($hostHome->total) * $dateDifference));
        info(intval($hostHome->security_deposit));
        $data2 = [
            'amount' => $total, // Paystack expects amount in kobo
            'email' => $user->email,
            'reference' => $reference,
            'currency' => 'NGN',
            'callback_url' => route('callback', [
                'userId' => $user->id, 
                'bookingId' => $booking->id,
                'usertoken' => $recentToken->token, 
                'userrem' => $user->remember_token,
                'hostHomeId' => $hostHome->id
            ]),
            'channels' => ['card'],
            'card' => [
                'card_number' => $selectedUserCard->card_number,
                'cvv' => $selectedUserCard->CVV,
                'expiry_month' => substr($selectedUserCard->expiry_data, 0, 2),
                'expiry_year' => '20' . substr($selectedUserCard->expiry_data, -2),
            ],
        ];

        return response([
            'payment_link' => Paystack::getAuthorizationUrl($data2)
        ]);
    }

    /**
     * @lrd:start
     * Gets all check-in and check-out dates from bookings.
     * @lrd:end
     */
    public function getAllBookingDates()
    {
        // Get all check-in and check-out dates from bookings
        $bookingDates = Booking::select('check_in', 'check_out')
        ->where('paymentStatus', 'success')
        ->get();

        // Transform the dates if needed
        $formattedDates = $bookingDates->map(function ($booking) {
            return [
                'check_in' => Carbon::parse($booking->check_in)->format('Y-m-d'),
                'check_out' => Carbon::parse($booking->check_out)->format('Y-m-d'),
            ];
        });

        return response(['booking_dates' => $formattedDates]);
    }

    /**
     * @lrd:start
     * Callback Endpoint: POST /api/callback
     * Description: This endpoint is used as a callback by the 
     * payment gateway (Paystack) to handle transaction status updates. 
     * It updates the payment status and triggers notifications to users based on the transaction result.
     *
     * Request Parameters:
     * - reference: The payment reference from Paystack.
     * - userId: The ID of the user associated with the booking.
     * - usertoken: The user token for authentication.
     * - userrem: The user remember token for authentication.
     * - hostHomeId: The ID of the host home associated with the booking.
     * - bookingId: The ID of the booking.
     *
     * Response:
     * - Success (Redirect to success page):
     *   - If payment status is 'success':
     *     - Updates host home listing status to '1'.
     *     - Updates booking payment status to 'success' and stores the transaction ID.
     *     - Notifies the host about the booking via email.
     *     - Redirects to the success page.
     * - Failure (Redirect to failed page):
     *   - If payment status is not 'success', redirects to the failed page.
     * - Error (404 Not Found):
     *   - If authentication tokens or booking details are incorrect, returns a 404 Not Found error.
     *
     * @return \Illuminate\Http\RedirectResponse Redirects to success or failed page based on the payment status.
     * @lrd:end
     */
    public function callback()
    {
        $paymentReference = request()->reference;
        $data = Paystack::getPaymentData($paymentReference);

        $status = $data["data"]["status"];
        
        $userId = request()->userId;
        $userToken = request()->usertoken;
        $userrem = request()->userrem;
        $hostHomeId = request()->hostHomeId;
        $bookingId = request()->bookingId;

        $user = User::findOrFail($userId);
        $recentToken = $user->tokens->last();
        $booking = Booking::findOrFail($bookingId);
        $transactionID = $data['data']['id'];
        
        if ($recentToken->token === $userToken && 
        $user->remember_token == $userrem && 
        $booking->user_id == $user->id) {
                
                if ($status == 'success') {
                    $hostHome = HostHome::find($hostHomeId);
                    
                    // Update host home listing status
                    $hostHome->update([
                        'listing_status' => 1
                    ]);
                    
                    $checkInDateTime = Carbon::parse($booking->check_in . ' ' . $hostHome->check_in_time);
                    $durationOfStay = $booking->duration_of_stay;
                    $checkoutDate = $checkInDateTime->addDays($durationOfStay);
                    $amount = $data['data']['amount'];
                    $hostBalance = (intval($hostHome->price) * $durationOfStay) - ((intval($hostHome->price) * $durationOfStay) * 0.07);
                    $host_service_charge = (intval($hostHome->price) * $durationOfStay) - $hostBalance;
                    $guest_service_charge = (intval($hostHome->service_fee) * $durationOfStay);
                    $vat_charge = (intval($hostHome->tax) * $durationOfStay);
                    $profit = (($amount/100) - $hostBalance) - intval($hostHome->security_deposit);
                    $paymentType = $data['data']['authorization']['card_type'];

                    $booking->update([
                        "totalamount" => ($amount/100),
                        "paymentStatus" => $status,
                        'paymentId' => $transactionID,
                        'paymentType' => $paymentType,
                        'host_service_charge' => $host_service_charge,
                        'guest_service_charge' => $guest_service_charge,
                        'profit' => $profit,
                        'vat_charge' => $vat_charge,
                        'securityDeposit' => $hostHome->security_deposit,
                        'hostBalance' => $hostBalance,
                        'check_out_time' => $checkoutDate->format('g:i A')
                    ]);

                    $userTrip = new UserTrip();
                    $userTrip->user_id = $booking->user_id;
                    $userTrip->booking_id = $booking->id;
                    $userTrip->save();

                    // Notify host about the booking
                    $message = $user->name . " has booked your apartment";
                    $host = User::find($hostHome->user_id);
                    Mail::to($host->email)->send(new NotificationMail($host, $message, "Your apartment has been booked"));
                    $checkInDate = Carbon::createFromFormat('Y-m-d', $booking->check_in)->format('F j, Y');
                    $checkOutDate = Carbon::createFromFormat('Y-m-d', $booking->check_out)->format('F j, Y');
                    
                    $checkInTime = $hostHome->check_in_time;

                    $guestMessage = "Your check-in date and time is " . $checkInDate . " " . $checkInTime . "\n";
                    $guestMessage .= "Your checkout date and time is " . $checkOutDate . " " . $booking->check_out_time . "\n";

                    Mail::to($user->email)->send(new NotificationMail($user, $guestMessage, "Your check-in and checkout time"));
                    return redirect()->route('successPage');
                } else {
                    return redirect()->route('failedPage');
                }
            
        }else {
            abort(404,"No record found");
        }
    }

    public function successful(){
        return view('Successful');
    }

    public function failed(){
        return view('Failed');
    }

    public function cancelled(){
        return view('Failed');
    }



}
