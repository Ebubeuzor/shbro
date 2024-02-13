<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGuestReivewRequest;
use App\Http\Requests\StoreReivewRequest;
use App\Http\Resources\HostPendingReviewForGuestResource;
use App\Http\Resources\HostPendingReviewResource;
use App\Http\Resources\PendingReviewResource;
use App\Http\Resources\ReviewResource;
use App\Models\Hostpendingreviewforguest;
use App\Models\Hostreviewforguest;
use App\Models\Pendingreview;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    
    /**
     * @lrd:start
     * Get a collection of pending reviews for the authenticated user.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     * @lrd:end
    */
    public function getPendingReviews(){
        $userid = auth()->id();
        return PendingReviewResource::collection(
            Pendingreview::where('user_id',$userid)
            ->where('status', 'pending')->get()
        );
    }
    
    /**
     * @lrd:start
     * 
     * THis is for the guest to make a review about an apartment he/she has stayed in.
     * 
     * @lrd:end
    */
    public function createReviews(StoreReivewRequest $request)
    {
        
        // Validate the request data
        $data = $request->validated();

        // Create a new Review
        $review = new Review([
            'title' => $data['title'],
            'ratings' => $data['ratings'],
            'host_id' => $data['host_id'],
            'booking_id' => $data['bookingid'],
            'comment' => $data['comment'],
            'user_id' => $data['user_id'],
            'host_home_id' => $data['host_home_id'],
        ]);

        // Save the new Review
        $review->save();

        // Find and update the related Pendingreview to 'reviewed'
        Pendingreview::where('id', $data['pendingreviewid'])->update(['status' => 'reviewed']);

        // Return a success response
        return response("OK", 200);
    }
    

    /**
     * @lrd:start
     * 
     * THis is for the host to make a review about aguest that has stayed in his apartment.
     * 
     * @lrd:end
    */

    public function createReviewsForguest(StoreGuestReivewRequest $request)
    {
        
        // Validate the request data
        $data = $request->validated();

        // Create a new Review
        $review = new Hostreviewforguest([
            'title' => $data['title'],
            'ratings' => $data['ratings'],
            'guest_id' => $data['guest_id'],
            'booking_id' => $data['bookingid'],
            'comment' => $data['comment'],
            'user_id' => $data['host_id'],
        ]);

        // Save the new Review
        $review->save();

        // Find and update the related Pendingreview to 'reviewed'
        Hostpendingreviewforguest::where('id', $data['pendingreviewid'])->update(['status' => 'reviewed']);

        // Return a success response
        return response("OK", 200);
    }

    /**
     * @lrd:start
     * Get reviews for the authenticated host.
     *
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function getHostReviews()
    {
        $hostId = Auth::id();

        // Fetch reviews where the host_id matches the authenticated user's ID
        $hostReviews = Review::where('host_id', $hostId)->get();

        // Return a JSON response with the ReviewResource
        return ReviewResource::collection($hostReviews);
    }

    /**
     * @lrd:start
     * Get pending reviews for the authenticated host.
     *
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function getHostPendingReviews()
    {
        $hostId = Auth::id();

        // Fetch reviews where the host_id matches the authenticated user's ID
        $hostReviews = Pendingreview::where('host_id', $hostId)
        ->where('status', 'pending')
        ->get();

        return HostPendingReviewResource::collection($hostReviews);
    }

    /**
     * @lrd:start
     * Get pending reviews for the authenticated host to make about his guest.
     *
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function getHostPendingReviewsForGuest()
    {
        $hostId = Auth::id();

        // Fetch reviews where the host_id matches the authenticated user's ID
        $hostReviews = Hostpendingreviewforguest::where('user_id', $hostId)
        ->where('status', 'pending')
        ->get();

        return HostPendingReviewForGuestResource::collection($hostReviews);
    }

    /**
     * @lrd:start
     * deletes pending reviews for the authenticated host.
     * $id is the pending review id
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function deleteHostPendingReviews($id)
    {

        // Fetch reviews where the host_id matches the authenticated user's ID
        $hostReview = Pendingreview::find($id);

        $hostReview->delete();

        return response("Succesfully Deleted",200);

    }

    /**
     * @lrd:start
     * deletes pending reviews for the authenticated host to make about his guest.
     * $id is the pending review id 
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function deletesHostPendingReviewsForGuest($id)
    {
        // Fetch reviews where the host_id matches the authenticated user's ID
        $hostReview = Hostpendingreviewforguest::find($id);

        $hostReview->delete();

        return response("Succesfully Deleted",200);
    }


    /**
     * @lrd:start
     * Deletes a review.
     *
     * @param  int  $id  The ID of the review to be deleted.
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function deleteReviews($id)
    {
        // Find the review by ID
        $review = Review::find($id);

        // Check if the review exists
        if ($review) {
            // Delete the review
            $review->delete();

            // Return a JSON response indicating success
            return response()->json(['message' => 'Review deleted successfully'], 200);
        } else {
            // Return a JSON response indicating that the review was not found
            return response()->json(['error' => 'Review not found'], 404);
        }
    }





}
