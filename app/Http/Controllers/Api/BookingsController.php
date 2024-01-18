<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingApartmentRequest;
use App\Mail\NotificationMail;
use App\Models\Booking;
use App\Models\HostHome;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use KingFlamez\Rave\Facades\Rave as Flutterwave;

class BookingsController extends Controller
{
    
    public function bookApartment(BookingApartmentRequest $request,$hostHomeId,$userId){
        $data = $request->validated();
        
        $user = User::find($userId);
        $hostHome = HostHome::find($hostHomeId);
        $selectedUserCard = $user->userCards()->where('Selected', true)->first();
        $booking = new Booking();
        $booking->adults = $data['adults'];
        $booking->children = $data['children'];
        $booking->pets = $data['pets'];
        $booking->infants = $data['infants'];
        $booking->check_in = $data['check_in'];
        $booking->check_out = $data['check_out'];
        $booking->user_id = $user->id;
        $booking->host_home_id = $hostHome->id;
        $booking->save();

        // Generate a payment reference
        $reference = Flutterwave::generateReference();
        $recentToken = $user->usertokens->last();
        $data2 = [
            'payment_options' => 'card',
            'amount' => $hostHome->total,
            'email' => $user->email,
            'tx_ref' => $reference,
            'currency' => "NGN",
            'redirect_url' => route('callback',['userid' => auth()->id(), 'usertoken' => $recentToken, 'hosthomeid' => $hostHome->id]),
            'customer' => [
                'email' => $user->email,
                "phone_number" => $user->phoneno,
                "name" => $user->firstname . " " . $user->lastname
            ],
            "customizations" => [
                "title" => 'Shortlet Bookings Payment',
                "description" => "Payment for Apartment"
            ],
            // $data['pets']
            'card' => [
                'card_no' => $selectedUserCard->card_number,
                'cvv' => $selectedUserCard->CVV,
                'expiry_month' => substr($selectedUserCard->expiry_data, 0, 2),
                'expiry_year' => '20' . substr($selectedUserCard->expiry_data, -2),
            ],
        ];

        $payment = Flutterwave::initializePayment($data2);
        
        if ($payment['status'] !== 'success') {
            return response()->json(['message' => $data2]);
        }


        return response()->json([
            'payment_link' => $payment['data']['link']
        ]);
    }

    public function callback($userid, $usertoken, $hosthomeid)
    {
        $status = request()->status;

        $transactionID = Flutterwave::getTransactionIDFromCallback();
        $data = Flutterwave::verifyTransaction($transactionID);

        $user = User::where('id', $userid)->first();
        $amount = $data['data']['amount'];
        $id = $data['data']['id'];
        
        if ($status == 'completed' || $status == 'successful') {
            $hosthome = HostHome::find($hosthomeid);
            
            $hosthome->update(
                ["listing_status" => 1]
            );
            $message = $user->name . " has booked your apartment";
            Mail::to($hosthome->user->email)->send(new NotificationMail($hosthome->user, $message, "Your apartment has been booked"));
            return redirect()->route('successPage');
        }else {
            return redirect()->route('failedPage');
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
