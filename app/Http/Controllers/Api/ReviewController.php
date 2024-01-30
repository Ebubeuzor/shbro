<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReivewRequest;
use App\Http\Resources\PendingReviewResource;
use App\Http\Resources\ReviewResource;
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
     * Create reviews based on the provided StoreReivewRequest.
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
     * Get pendind reviews for the authenticated host.
     *
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function getHostPendingReviews()
    {
        $hostId = Auth::id();

        // Fetch reviews where the host_id matches the authenticated user's ID
        $hostReviews = Pendingreview::where('host_id', $hostId)->get();

        return response([
            'reservationId' => $hostReviews->booking->id,
            'hostReviews' => $hostReviews
        ]);
    }


}
