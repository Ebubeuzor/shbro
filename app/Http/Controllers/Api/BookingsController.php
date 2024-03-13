<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingApartmentRequest;
use App\Http\Requests\CancelTripRequest;
use App\Http\Resources\BookedResource;
use App\Mail\NotificationMail;
use App\Models\Booking;
use App\Models\Canceltrip;
use App\Models\HostHome;
use App\Models\HostHomeCustomDiscount;
use App\Models\Hosthomediscount;
use App\Models\ReservedPricesForCertainDay;
use App\Models\Servicecharge;
use App\Models\User;
use App\Models\UserTrip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use KingFlamez\Rave\Facades\Rave as Flutterwave;
use Unicodeveloper\Paystack\Facades\Paystack;

use function PHPSTORM_META\map;

class BookingsController extends Controller
{

    protected $guestServicesCharge;
    protected $hostServicesCharge;
    protected $tax;

    public function __construct()
    {
        // Retrieve the service charge record (assuming there's only one)
        $serviceCharge = Servicecharge::first();

        // Set global variables to zero if no record is found
        $this->guestServicesCharge = $serviceCharge ? $serviceCharge->guest_services_charge : 0;
        $this->hostServicesCharge = $serviceCharge ? $serviceCharge->host_services_charge : 0;
        $this->tax = $serviceCharge ? $serviceCharge->tax : 0;
    }

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
            ->where('paymentStatus', 'success')
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
                return response("No card selected", 400);
            }
        } elseif ($data['option'] == 2) {
            $selectedUserCard = [
                "card_number" => $data["card_number"],
                "expiry_data" => $data["expiry_data"],
                "CVV" => $data["CVV"],
            ];
        } else {
            return response("Invalid option", 400);
        }
        if (!is_object($selectedUserCard)) {
            $selectedUserCard = (object) $selectedUserCard;
        }

        $booking = new Booking();
        if (!is_null($checkIn) && !is_null($checkOut)) {
            $booking->check_in = $checkIn->format('Y-m-d');
            $booking->check_out = $checkOut->format('Y-m-d');
        }

        // Fetch standard discounts for the host home
        $standardDiscounts = Hosthomediscount::where('host_home_id', $hostHomeId)->get();

        // Fetch custom discounts for the host home
        $customDiscounts = HostHomeCustomDiscount::where('host_home_id', $hostHomeId)->get();

        $reservedPrices = ReservedPricesForCertainDay::where('host_home_id', $hostHomeId)
        ->where('date', '>=', $checkIn->format('Y-m-d'))
        ->where('date', '<', $checkOut->format('Y-m-d'))
        ->get();

        $bookingPrice = 0;
        $reservedDaysDiscountedPrice = 0;
        $reservedDays = 0;

        if ($reservedPrices->isNotEmpty()) {
            $reservedDays +=  count($reservedPrices);
            $uniquePricesWithOccurrences = $reservedPrices->mapToGroups(function ($item, $key) {
                return [$item->price => 1];
            })->map(function ($item, $key) {
                return [
                    'price' => $key,
                    'occurrences' => $item->sum(),
                ];
            })->values();

            $uniquePricesWithOccurrences->each(function($item) use($standardDiscounts, $customDiscounts, $hostHome, &$reservedDaysDiscountedPrice) {
                $price = $this->calculateDiscountedPrice($item['price'], $standardDiscounts, $customDiscounts, $item['occurrences'], $hostHome->bookingCount);
                $reservedDaysDiscountedPrice += $price * $item['occurrences'];
            });
            
        }

        $weekendPrice = 0;
        $currentDate = \DateTime::createFromFormat('Y-m-d', $checkIn->format('Y-m-d'));
        $totalWeekends = 0;
        
        while ($currentDate <= $checkOut) {
            $currentDateFormatted = $currentDate->format('Y-m-d');
            if ($this->isWeekend($currentDateFormatted) && !is_null($hostHome->weekendPrice) && !$this->isDateReserved($currentDateFormatted, $reservedPrices)) {
                
                $totalWeekends++;
                $weekendPrice += $this->calculateDiscountedPrice($hostHome->weekendPrice, $standardDiscounts, $customDiscounts, $dateDifference, $hostHome->bookingCount);
            }
            
            $currentDate->modify('+1 day');
        }

        $weekendPrice *= $totalWeekends;

        $discountedPrice = $this->calculateDiscountedPrice($hostHome->actualPrice, $standardDiscounts, $customDiscounts, $dateDifference,$hostHome->bookingCount);
        
        $bookingPrice = $discountedPrice;
        
        //  'host_service_charge' => $host_service_charge,
        $fees = ($hostHome->actualPrice * $this->guestServicesCharge);
        $tax = (($bookingPrice * $dateDifference) * $this->tax);
        $subhostbalance = $bookingPrice * $dateDifference;
        $hostfee = $subhostbalance * $this->hostServicesCharge;
        $hostBalance = $subhostbalance - $hostfee;
        $taxAndFees = $fees + $tax;
        $booking->adults = $data['adults'];
        $booking->children = $data['children'];
        $booking->pets = $data['pets'];
        $booking->infants = $data['infants'];
        $booking->duration_of_stay = $dateDifference;
        $booking->check_in = $checkIn->format('Y-m-d');
        $booking->check_out = $checkOut->format('Y-m-d');
        $booking->user_id = $user->id;
        $booking->guest_service_charge = $fees;
        $booking->host_service_charge = $hostfee;
        $booking->vat_charge = $tax;
        $booking->priceForANight = $hostHome->actualPrice;
        $booking->hostBalance = $hostBalance;
        $booking->host_home_id = $hostHome->id;
        $booking->profit = $taxAndFees;
        $booking->hostId = $hostHome->user_id;
        $booking->save();

        // Generate a payment reference
        $reference = Paystack::genTranxRef();

        $recentToken = $user->tokens->last();

        
        $total = 0;

        if ($weekendPrice == 0) {
            $reservedDaysDiscountedPrice += ($bookingPrice * ($dateDifference - $reservedDays));
            $total += ( $reservedDaysDiscountedPrice + intval($hostHome->security_deposit) + intval($taxAndFees)) * 100;
        }else {
            $subTot = $dateDifference - $reservedDays - $totalWeekends;
            $reservedDaysDiscountedPrice += ($bookingPrice * ($subTot == 0 ? 1  : $subTot));
            $reservedDaysDiscountedPrice += $weekendPrice;
            $total += ( $reservedDaysDiscountedPrice + intval($hostHome->security_deposit) + intval($taxAndFees)) * 100;
        }

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

    private function isDateReserved($date, $reservedPrices)
    {
        return $reservedPrices->contains('date', $date);
    }

    private function countWeekends($startDate, $endDate, $reservedPrices)
    {
        // Convert the start and end dates to DateTime objects if not already
        $startDate = $startDate instanceof \DateTime ? $startDate : \DateTime::createFromFormat('Y-m-d', $startDate);
        $endDate = $endDate instanceof \DateTime ? $endDate : \DateTime::createFromFormat('Y-m-d', $endDate);

        $totalWeekends = 0;

        // Iterate over each day and count the weekends
        while ($startDate <= $endDate) {
            $currentDateFormatted = $startDate->format('Y-m-d');

            // Check if the current date is a weekend and not reserved
            if ($this->isWeekend($currentDateFormatted) && !$this->isDateReserved($currentDateFormatted, $reservedPrices)) {
                $totalWeekends++;
            }

            $startDate->modify('+1 day');
        }

        return $totalWeekends;
    }

    private function isWeekend($date)
    {
        // Convert the date to a DateTime object if not already
        if (!$date instanceof \DateTime) {
            $date = \DateTime::createFromFormat('Y-m-d', $date);
        }

        // Check if the day of the week is Saturday or Sunday (assuming Monday is 1 and Sunday is 7)
        return $date->format('N') >= 6; // 6 is Saturday, 7 is Sunday
    }

    private function calculateDiscountedPrice($actualPrice, $standardDiscounts, $customDiscounts, $durationOfStay = 0, $bookingCount)
    {
        $discountedPrice = $actualPrice;

        // Apply standard discounts
        foreach ($standardDiscounts as $discount) {
            $discountedPrice = $this->applyDiscount($discountedPrice, $discount, $durationOfStay,$bookingCount);
        }

        // Apply custom discounts
        $discountedPrice = $this->applyCustomDiscounts($discountedPrice, $customDiscounts, $durationOfStay);

        return $discountedPrice;
    }


    private function applyCustomDiscounts($price, $customDiscounts, $durationOfStay = 0)
    {
        foreach ($customDiscounts as $customDiscount) {
            switch ($customDiscount->duration) {
                case '1 week':
                    $price = $durationOfStay >= 7 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '2 weeks':
                    $price = $durationOfStay >= 14 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '3 weeks':
                    $price = $durationOfStay >= 21 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '4 weeks':
                    $price = $durationOfStay >= 28 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '1 month':
                    $price = $durationOfStay >= 30 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '2 months':
                    $price = $durationOfStay >= 60 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '3 months':
                    $price = $durationOfStay >= 90 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                // Add more cases for other durations as needed
            }
        }

        return $price;
    }


    private function applyDiscount($price, $discount, $durationOfStay = 0,$bookingCount)
    {
        // Check the discount type and apply accordingly
        if ($discount) {
            switch ($discount->discount) {
                case '20% New listing promotion':
                    return $bookingCount < 3 ? $price - ($price * 0.2) : $price;
                case '5% Weekly discount':
                    return $durationOfStay >= 7 ? $price - ($price * 0.05) : $price; // 5% off for stays of 7 nights or more
                case '10% Monthly discount':
                    return $durationOfStay >= 28 ? $price - ($price * 0.1) : $price; // 10% off for stays of 28 nights or more
                // Add more cases for other standard discounts as needed
                default:
                    return $price;
            }
        }

        // Default case if no standard discount is provided
        return $price;
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
                        'listing_status' => 1,
                        'bookingCount' => $hostHome->bookingCount + 1
                    ]);

                    if ($hostHome->bookingCount == 3 && $this->hasNewListingPromotionDiscount($hostHome)) {
                        $hostHome->update([
                            'price' => $hostHome->actualPrice
                        ]);
                    }
                    
                    $checkInDateTime = Carbon::parse($booking->check_in . ' ' . $hostHome->check_in_time);
                    $durationOfStay = $booking->duration_of_stay;
                    $checkoutDate = $checkInDateTime->addDays($durationOfStay); 
                    $checkouttime = $hostHome->check_out_time; 
                    $checkintime = $hostHome->check_in_time; 
                    $priceForANight = $hostHome->price; 
                    $amount = $data['data']['amount'];
                    // $hostBalance = (intval($hostHome->price) * $durationOfStay) - ((intval($hostHome->price) * $durationOfStay) * 0.07);
                    // $host_service_charge = (intval($hostHome->price) * $durationOfStay) - $hostBalance;
                    $hostBalance = $booking->hostBalance;
                    $paymentType = $data['data']['authorization']['card_type'];

                    $booking->update([
                        "totalamount" => ($amount/100),
                        "paymentStatus" => $status,
                        'paymentId' => $transactionID,
                        'paymentType' => $paymentType,
                        'securityDeposit' => $hostHome->security_deposit,
                        'check_out_time' => $checkouttime,
                        'check_in_time' => $checkintime,
                        'priceForANight' => $priceForANight,
                        'host_services_charge_percentage' => intval($this->hostServicesCharge) * 100,
                        'guest_services_charge_percentage' => intval($this->guestServicesCharge) * 100,
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

    private function hasNewListingPromotionDiscount($hostHome)
    {
        $discounts = Hosthomediscount::where('host_home_id', $hostHome->id)->get();

        foreach ($discounts as $discount) {
            if ($discount->discount === '20% New listing promotion') {
                return true;
            }
        }

        return false;
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

    public function getAllBookingsForAdmin(){
        
    }

    /**
     * @lrd:start
     * Create a new cancellation for a trip.
     *
     * This endpoint allows users to cancel a trip by providing the necessary details.
     *
     * @param  \App\Http\Requests\CancelTripRequest  $request
     *         The validated request containing the necessary cancellation details.
     *
     * @return \Illuminate\Http\JsonResponse
     *         A JSON response indicating the success or failure of the cancellation request.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     *         If the specified booking ID is not found or is not eligible for cancellation.
     *
     * @throws \Exception
     *         If an unexpected error occurs during the cancellation process.
     *
     * @response 200
     *     {"message": "Cancellation created successfully"}
     * @response 404
     *     {"error": "Invalid booking id"}
     * @response 500
     *     {"error": "An error occurred"}
     * @lrd:end
     */
    public function createCancelTrips(CancelTripRequest $request)
    {
        $data = $request->validated();

        // Find the booking
        $booking = Booking::select('bookings.*')
        ->join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
        ->where('bookings.check_in', '>', Carbon::today()->toDateString())
        ->where('bookings.id', $data['booking_id'])
        ->where('bookings.paymentStatus', 'success')
        ->first();

        // Find the associated host home
        $hostHome = HostHome::findOrFail($booking->host_home_id);

        // Determine the cancellation policy
        $cancellationPolicy = $hostHome->cancellation_policy;

        // Calculate refund amounts based on the cancellation policy and hostBalance
        list($guestRefund, $hostRefund) = $this->calculateRefunds($cancellationPolicy, $booking->hostBalance, $booking->created_at);

        // Create a new Canceltrip record
        $cancelTrip = new Canceltrip([
            'user_id' => auth()->id(),
            'booking_id' => $data['booking_id'],
            'host_id' => $data['host_id'],
            'reasonforcancel' => $data['reasonforcancel'],
            'guest_refund' => $guestRefund,
            'host_refund' => $hostRefund,
        ]);

        $host = User::find($booking->hostId);
        // Update the booking status
        $booking->update([
            'paymentStatus' => 'successButCancelled',
        ]);

        $hostMessage = "Your apartment boooking has been cancelled " ;
        Mail::to($host->email)->send(new NotificationMail($host, $hostMessage, $hostMessage));

        // Save the Canceltrip record
        $cancelTrip->save();

        // Return a response
        return response()->json(['message' => 'Trip successfully cancelled'], 200);
    }

    private function calculateRefunds($cancellationPolicy, $totalAmount, $bookingCreatedAt)
    {
        // Define refund percentages based on cancellation policies
        $refundPercentages = [
            'Moderate Cancellation Policy' => 0.7,
            'Strict Cancellation Policy' => 0.5,
            'Flexible Cancellation Policy' => 1, // Default percentage for within 48 hours
        ];

        // Get the refund percentage based on the cancellation policy
        $refundPercentage = $refundPercentages[$cancellationPolicy];

        // Check if the cancellation occurs within the first 48 hours for the "Flexible" policy
        if ($cancellationPolicy === 'Flexible Cancellation Policy') {
            $cancellationDeadline = Carbon::parse($bookingCreatedAt)->addHours(48);
            $now = Carbon::now();
    
            if ($now->lt($cancellationDeadline)) {
                // If within the first 48 hours, the guest gets a full refund
                $refundPercentage = 1; // 100%
            }else {
                // If after the first 48 hours, apply the regular flexible refund percentage
                $refundPercentage = 0.7; // 70%
            }
        }

        // Calculate guest and host refunds
        $guestRefund = $refundPercentage * $totalAmount;
        $hostRefund = $totalAmount - $guestRefund;

        return [$guestRefund, $hostRefund];
    }

    public function sendMoney()
    {
        $recipientName = 'Ebube Uzor'; // Replace with recipient's name
        $recipientAccountNumber = '0000000000'; // Replace with recipient's account number
        $recipientBankName = 'Zenith Bank'; // Replace with recipient's bank name
        $recipientBankCode = $this->getBankCode($recipientBankName);

        $recipientResponse = Http::withHeaders([
            'Authorization' => 'Bearer sk_test_9e95c1866aa5437777d2fd286c23bc9df8a3fcea',
            'Content-Type' => 'application/json',
        ])->post('https://api.paystack.co/transferrecipient', [
            'type' => 'nuban',
            'name' => $recipientName,
            'account_number' => $recipientAccountNumber,
            'bank_code' => $recipientBankCode,
            'currency' => 'NGN',
            'metadata' => [
                'email' => 'ebubeuzor17@gmail.com',
            ],
        ]);

        $recipient = $recipientResponse->json();

        // Check if 'data' key exists in the response
        if (isset($recipient['data']['recipient_code'])) {
            // Use the generated recipient code
            $recipientCode = $recipient['data']['recipient_code'];

            // Initiate a transfer using the generated recipient code
            $transferResponse = Http::withHeaders([
                'Authorization' => 'Bearer sk_test_9e95c1866aa5437777d2fd286c23bc9df8a3fcea',
                'Content-Type' => 'application/json',
            ])->post('https://api.paystack.co/transfer', [
                'source' => 'balance',
                'amount' => 5000, // Replace with the amount to send
                'recipient' => $recipientCode,
                'reason' => 'Payment for services', // Optional reason for the transfer
            ]);

            // Log the transfer response for debugging
            logger()->info('Transfer Response:', $transferResponse->json());

            // Check the status of the transfer
            if ($transferResponse['status'] === 'success') {
                // Log the success status
                logger()->info('Transfer was successful.');

                $user = User::where('email', 'ebubeuzor17@gmail.com')->first();
                Mail::to($user->email)->send(new NotificationMail($user,'Money Sent','5000 sent'));

                return response()->json(['message' => 'Money sent successfully']);
            } else {
                // Log the failure status
                logger()->error('Transfer failed.');

                return response()->json(['error' => 'Failed to initiate transfer.']);
            }
        } else {
            // Handle the case where 'data' key is not present in the response
            return response()->json(['error' => 'Failed to retrieve recipient code from Paystack']);
        }
    }


    private function getBankCode($bankName)
    {
        // Fetch the bank list dynamically from the Paystack API
        $response = Http::withHeaders([
            'Authorization' => 'Bearer sk_test_9e95c1866aa5437777d2fd286c23bc9df8a3fcea',
        ])->get('https://api.paystack.co/bank');

        $banks = $response->json();

        // Loop through the list and match the bank name to get the code
        foreach ($banks['data'] as $bank) {
            if ($bank['name'] == $bankName) {
                return $bank['code'];
            }
        }

        // Return a default code or handle the case where the bank name is not found
        return 'DEFAULT_CODE';
    }


    /**
     * @lrd:start
     * Get the list of banks available on Paystack.
     *
     * @return \Illuminate\Http\JsonResponse The JSON response containing the names of available banks.
     * @lrd:end
    */
    public function listBanks()
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer sk_test_9e95c1866aa5437777d2fd286c23bc9df8a3fcea',
        ])->get('https://api.paystack.co/bank');

        $banks = $response->json();
        $bankNames = collect($banks['data'])->pluck('name')->toArray();

        return response()->json($bankNames);
    }

    /**
     * @lrd:start
     * Get user information by account number and bank name using the Paystack API.
     *
     * @param string $accountNumber The user's account number.
     * @param string $bankName The name of the user's bank.
     * @return \Illuminate\Http\JsonResponse The JSON response containing user information.
     * @lrd:end
     */
    public function getUserInfoByAccountNumber($accountNumber,$bankName)
    {
        $cleanBankName = trim($bankName, '"');
        $cleanaccountNumber = trim($accountNumber, '"');
        $recipientBankCode = $this->getBankCode($cleanBankName);
        $response = Http::withHeaders([
            'Authorization' => 'Bearer sk_test_9e95c1866aa5437777d2fd286c23bc9df8a3fcea',
        ])->get('https://api.paystack.co/bank/resolve?account_number=' . $cleanaccountNumber . "&bank_code=" . $recipientBankCode);

        $data = $response->json();

        if ($response->successful() && $data['status']) {
            $accountName = $data['data']['account_name'];

            return response()->json(['account_name' => $accountName]);
        } else {
            return response()->json(['error' => 'Failed to retrieve user information from Paystack']);
        }
    }

}


