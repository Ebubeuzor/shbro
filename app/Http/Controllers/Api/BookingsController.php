<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingApartmentRequest;
use App\Http\Requests\CancelTripRequest;
use App\Http\Resources\BookedResource;
use App\Jobs\SendMailForChatToCohosts;
use App\Mail\AcceptOrDeclineGuestMail;
use App\Mail\BookingCancellation;
use App\Mail\BookingRequestConfirmationEmail;
use App\Mail\GuestBookingConfirmationReceipt;
use App\Mail\NewBookingRequest;
use App\Mail\NotificationMail;
use App\Mail\SuccessfulBookingMessage;
use App\Models\AcceptGuestRequest;
use App\Models\Booking;
use App\Models\Canceltrip;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\HostHomeCustomDiscount;
use App\Models\Hosthomediscount;
use App\Models\ReservedPricesForCertainDay;
use App\Models\Servicecharge;
use App\Models\User;
use App\Models\UserTrip;
use App\Repository\ChatRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
        try {
            //code...
            $data = $request->validated();
            
            $cohost = Cohost::where('user_id', auth()->id())->first();

            if ($cohost) {
                abort(400, "Cohost arent allowed to book");
            }

            $user = User::find($userId);
            
            if ($user->verified != "Verified" || $user->phone == null) {
                abort(400, "Please verify your account by uploading a valid government ID and verifying your phone number.");
            }        

            $hostHome = HostHome::find($hostHomeId);
            
            $acceptRequest = AcceptGuestRequest::where('user_id',$userId)
                        ->where('host_home_id',$hostHomeId)
                        ->first();

            if ($hostHome->reservation == "Approve or decline requests" && !$acceptRequest) {
                abort(400, "Please make a booking request before making a reservation.");
            }elseif ($hostHome->reservation == "Approve or decline requests" && $acceptRequest->approved == null) {
                abort(400, "Please wait for the host to approve.");
            }elseif ($hostHome->reservation == "Approve or decline requests" && $acceptRequest->approved != "approved") {
                abort(400, "Your request wasn't approved please make another request");
            }elseif ($hostHome->reservation == "Approve or decline requests" && $acceptRequest->bookingstatus != null) {
                abort(400, "You have already booked please make another request");
            }

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
            $currentDate->modify('+1 day'); // Subtract one day from the check-out date
            $checkOutMinusOneDay = \DateTime::createFromFormat('Y-m-d', $checkOut->format('Y-m-d'));
            
            $totalWeekends = 0;
            
            while ($currentDate <= $checkOutMinusOneDay) {
                $currentDateFormatted = $currentDate->format('Y-m-d');
                if ($this->isWeekend($currentDateFormatted) && !is_null($hostHome->weekendPrice) && !$this->isDateReserved($currentDateFormatted, $reservedPrices)) {
                    $totalWeekends++;
                    if (intval($hostHome->weekendPrice) != 0) {
                        $weekendPrice += $this->calculateDiscountedPrice($hostHome->weekendPrice, $standardDiscounts, $customDiscounts, $dateDifference, $hostHome->bookingCount);
                    } else {
                        $weekendPrice = 0;
                    }
                }
                $currentDate->modify('+1 day'); // Move to the next day
            }
            
            
            $discountedPrice = $this->calculateDiscountedPrice($hostHome->actualPrice, $standardDiscounts, $customDiscounts, $dateDifference,$hostHome->bookingCount);
            
            $bookingPrice = $discountedPrice;
            
            $total = 0;
            
            if ($weekendPrice == 0) {
                $reservedDaysDiscountedPrice += ($bookingPrice * ($dateDifference - $reservedDays - $totalWeekends));
                $fees = ($reservedDaysDiscountedPrice * $this->guestServicesCharge);
                $tax = ($reservedDaysDiscountedPrice * $this->tax);
                $taxAndFees = $fees + $tax;
                $total += ( $reservedDaysDiscountedPrice + intval($hostHome->security_deposit) + intval($taxAndFees)) * 100;
            }else {
                $reservedDaysDiscountedPrice += ($bookingPrice * ($dateDifference - $reservedDays - $totalWeekends));
                $reservedDaysDiscountedPrice += $weekendPrice;
                $fees = ($reservedDaysDiscountedPrice * $this->guestServicesCharge);
                $tax = ($reservedDaysDiscountedPrice * $this->tax);
                $taxAndFees = $fees + $tax;
                $total += ( $reservedDaysDiscountedPrice + intval($hostHome->security_deposit) + intval($taxAndFees)) * 100;
            }
            
            $totalForHost = ($total/100) - (intval($hostHome->security_deposit) + intval($taxAndFees));
            $hostfee = $totalForHost * $this->hostServicesCharge;
            $hostBalance = $totalForHost - $hostfee;

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
                    'hostHomeId' => $hostHome->id,
                    'mobile_request' => empty($data['mobile_request']) ? "empty" : $data['mobile_request'],
                ]),
                'channels' => ['card'],
            ];

            return response([
                'payment_link' => Paystack::getAuthorizationUrl($data2)
            ]);
        } catch (Exception $e) {
            // Log the error message
            Log::error("Error occurred during apartment booking", [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return a generic error message to the client
            return response("An error occurred while processing your booking. Please try again later.", 500);
        }
    }

    private function isDateReserved($date, $reservedPrices)
    {
        return $reservedPrices->contains('date', $date);
    }
    

    private function isWeekend($date)
    {
        if (!$date instanceof \DateTime) {
            $date = \DateTime::createFromFormat('Y-m-d', $date);
        }

        return $date->format('N') >= 6; 
    }

    private function calculateDiscountedPrice($actualPrice, $standardDiscounts, $customDiscounts, $durationOfStay = 0, $bookingCount)
    {
        $discountedPrice = $actualPrice;

        info($discountedPrice);

        if (!count($standardDiscounts) == 0) {
            $discountedPrice = $this->applyDiscount($discountedPrice, $standardDiscounts, $durationOfStay,$bookingCount);
        }else{
            $discountedPrice = $this->applyCustomDiscounts($discountedPrice, $customDiscounts, $durationOfStay);
        }

        return $discountedPrice;
    }

    private function applyCustomDiscounts($price, $customDiscounts, $durationOfStay = 0)
    {
        $returnPrice = 0;
        foreach ($customDiscounts as $customDiscount) {
            switch ($customDiscount->duration) {
                case '1 week':
                    $returnPrice = $durationOfStay >= 7 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '2 weeks':
                    $returnPrice = $durationOfStay >= 14 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '3 weeks':
                    $returnPrice = $durationOfStay >= 21 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '1 month':
                    $returnPrice = $durationOfStay >= 30 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '2 months':
                    $returnPrice = $durationOfStay >= 60 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                case '3 months':
                    $returnPrice = $durationOfStay >= 90 ? $price - ($price * ($customDiscount->discount_percentage / 100)) : $price;
                    break;
                default:
                    $returnPrice = $price;
                    break;
            }
        }

        
        info($returnPrice);
        return $returnPrice;
    }


    private function applyDiscount($price, $discounts, $durationOfStay = 0, $bookingCount)
    {
        
        $returnPrice = $price;
        
        foreach ($discounts as $discount) {
            switch ($discount->discount) {
                case '20% New listing promotion':
                    $returnPrice = $bookingCount < 3 ? $returnPrice - ($returnPrice * 0.2) : $returnPrice;
                    break;
                case '5% Weekly discount':
                    $newListingPromotion = collect($discounts)->contains('discount', '10% Monthly discount');

                    if ($durationOfStay >= 30 && $newListingPromotion){
                        break;
                    }else {
                        $returnPrice = $durationOfStay >= 7 ? $returnPrice - ($returnPrice * 0.05) : $returnPrice;
                    }
                    break;
                    case '10% Monthly discount':
                        $newListingPromotion = collect($discounts)->contains('discount', '5% Weekly discount');
        
                    if ($durationOfStay < 30 && $newListingPromotion){
                        break;
                    }
                    else{
                        $returnPrice = $durationOfStay >= 30 ? $returnPrice - ($returnPrice * 0.1) : $returnPrice;
                    }
                    break;
                default:
                    break;
            }
        }

        return $returnPrice;

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
     * This is the method for a guest to make a request to a host about booking your apartment
     * The channel for broadcasting the message is "messenger.{receiver}", where "receiver" is the ID of the authenticated user
     * After broadcasting the message, the system listens for the "MessageSent" event.
     * @lrd:end
     * 
     */
    public function makeRequestToBook(?int $receiverId = null,$hostHomeId)
    {
        
        $cohost = Cohost::where('user_id', auth()->id())->first();

        if ($cohost) {
            abort(400, "Cohost arent allowed to make request to book");
        }

        $user = User::findOrFail(auth()->id());
        $hosthome = HostHome::findOrFail($hostHomeId);

        // Check if the user has already made a request today
        $lastRequest = AcceptGuestRequest::where('user_id', $user->id)
        ->where('host_home_id', $hosthome->id)
        ->whereDate('created_at', Carbon::today())
        ->first();

        if ($lastRequest) {
            return response()->json(['error' => 'You have already made a request today'], 400);
        }
        $messageToHost = $user->name . " has requested to book your apartment please approve or decline";
        $chat = new ChatRepository();
        $message = $chat->sendMessages([
            'message' => $messageToHost,
            'sender_id' => $user->id,
            'receiver_id' => $receiverId,
        ]);


        if (!$hosthome) {
            abort(404, "Host home not found");
        }

        $acceptRequest = new AcceptGuestRequest();
        $acceptRequest->message_id = $message->id;
        $acceptRequest->user_id = $user->id;
        $acceptRequest->host_id = $receiverId;
        $acceptRequest->host_home_id = $hostHomeId;
        $acceptRequest->save();


        event(new MessageSent($messageToHost, $user->id, $receiverId));
        $this->sendMessagesToCohosts($messageToHost, $user->id, $receiverId);
        $userToReceive = User::whereId($receiverId)->first();
        Mail::to($user->email)->queue(new BookingRequestConfirmationEmail($user, $hosthome, "Request to book apartment has Been Successfully Made"));
        Mail::to($userToReceive->email)->queue(new NewBookingRequest($userToReceive,$hosthome, "A Guest has made a request to book your apartment"));
    }

    private function sendMessagesToCohosts($message, $senderId, $receiverId)
    {
        $receiver = User::find($receiverId);
        $sender = User::find($senderId);

        if ($receiver->cohosts()->exists()) {
            $cohosts = $receiver->hostcohosts()->with('user')->get();

            foreach ($cohosts as $cohost) {
                SendMailForChatToCohosts::dispatch($message, $senderId, $cohost->user_id, false, true);
            }
        }elseif ($sender->cohosts()->exists()) {
            $cohosts = $sender->hostcohosts()->with('user')->get();

            foreach ($cohosts as $cohost) {
                SendMailForChatToCohosts::dispatch($message,$cohost->user_id, $senderId, true);
            }
        }
    }

    /**
     * @lrd:start
     * Accept or decline a booking request.
     * 
     * @param int $requestId The ID of the booking request to accept or decline.
     * @param int $host_home_id The ID of the host home associated with the booking request.
     * @param int $host_id The ID of the host user.
     * @param int $guest_id The ID of the guest user.
     * @param string $action The action to perform: 'accept' or 'decline'.
     * 
     * @throws \Exception If the booking request is not found or an invalid action is provided.
     * 
     * @lrd:end
    */
    public function handleBookingRequest(int $requestId, int $host_home_id, int $host_id, int $guest_id, string $action)
    {

        $cohost = Cohost::where('user_id',$host_id)->first();

        if ($cohost) {
            $host_id = $cohost->host_id;
        }
        
        // Find the booking request
        $request = AcceptGuestRequest::where('id',$requestId)
        ->where('host_home_id', $host_home_id)
        ->where('host_id', $host_id)
        ->where('user_id', $guest_id)
        ->first();

        if(!$request){
            abort(404,"Booking Request Not Found!");
        }

        $hosthome = HostHome::find($host_home_id);

        if ($host_id != $hosthome->user_id ) {
            abort(400,"Only the host of this apartment can approve or decline");
        }
        
        // Validate the action
        if (!in_array(strtolower($action), ['accept', 'decline'])) {
            throw new \Exception('Invalid action. Action must be "accept" or "decline".');
        }

        // Update the booking status based on the action
        if ($action === 'accept') {
            $request->approved = 'approved';
        } else {
            $request->approved = 'declined';
        }

        // Save the changes
        $request->save();

        // Trigger appropriate notifications
        $user = User::find($request->user_id);
        $subject = ($action === 'accept') ? 'Booking Request Accepted' : 'Booking Request Declined';
        $statusMessage = ($action === 'accept') ? 'Your booking request has been accepted.' : 'Your booking request has been declined.';
        $this->sendNotification($user, $statusMessage, $subject, $action, $host_home_id);
        return response()->json(['message'=> "The request has been successfully {$action}d."]);
    }

    /**
     * Send notification to a user.
     * 
     * @param User $user The user to send the notification to.
     * @param string $subject The subject of the notification.
     * @param string $message The message content of the notification.
     */
    private function sendNotification(User $user, string $message, string $subject, string $status, int $hosthomeid)
    {
        Mail::to($user->email)->queue(new AcceptOrDeclineGuestMail($user, $message, $subject,$status,$hosthomeid));
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
        $mobile_request = request()->mobile_request;

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
                
                $checkouttime = $hostHome->check_out_time; 
                $checkintime = $hostHome->check_in_time; 
                $priceForANight = $hostHome->price; 
                $amount = $data['data']['amount'];
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
                    'host_services_charge_percentage' => $this->hostServicesCharge,
                    'guest_services_charge_percentage' => $this->guestServicesCharge,
                ]);

                $userTrip = new UserTrip();
                $userTrip->user_id = $booking->user_id;
                $userTrip->booking_id = $booking->id;
                $userTrip->save();

                $cacheKey = 'user_trips_' . $booking->user_id;
                Cache::forget($cacheKey);

                // Notify host about the booking
                $host = User::find($hostHome->user_id);
                $checkInDate = Carbon::createFromFormat('Y-m-d', $booking->check_in)->format('F j, Y');
                $checkOutDate = Carbon::createFromFormat('Y-m-d', $booking->check_out)->format('F j, Y');
                $checkInTime = $hostHome->check_in_time;
                Mail::to($host->email)->queue(new SuccessfulBookingMessage($host, $user,$hostHome,$checkInDate. " " . $checkInTime,$checkOutDate. " " . $booking->check_out_time, "Your apartment has been booked"));
                
                Mail::to($user->email)->queue(new GuestBookingConfirmationReceipt($user, $hostHome,$checkInDate. " " . $checkInTime,$checkOutDate. " " . $booking->check_out_time, "Booking Confirmation Receipt"));

                $acceptRequest = AcceptGuestRequest::where('user_id',$userId)
                ->where('host_home_id',$hostHomeId)
                ->where('approved','approved')
                ->first();

                if ($acceptRequest) {
                    $acceptRequest->update([
                        'bookingstatus' => 'booked'
                    ]);
                }
                $cacheKey = "allHostReservation{$host->id}";
                Cache::forget($cacheKey);
                Cache::flush();
                return redirect()->route('successPage')->with([
                    "mobile_request" => $mobile_request
                ]);
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

        if (!$booking) {
            abort(400, "Record  Not Found");
        }

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

        $title = "Your apartment boooking has been cancelled ";
        $formatedDate = now()->format('M j, Y h:ia');
        $guest = User::find(auth()->id());
        
        $checkInDate = Carbon::createFromFormat('Y-m-d', $booking->check_in)->format('F j, Y');
        $checkOutDate = Carbon::createFromFormat('Y-m-d', $booking->check_out)->format('F j, Y');

        Mail::to($host->email)->queue(new BookingCancellation($host, $guest, $hostHome, $formatedDate, $checkInDate, $checkOutDate, $title));

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


