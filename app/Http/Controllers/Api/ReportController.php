<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportDamageRequest;
use App\Models\Reporthosthome;
use App\Http\Requests\StoreReporthosthomeRequest;
use App\Http\Requests\StoreReportUserRequest;
use App\Http\Requests\UpdateReporthosthomeRequest;
use App\Http\Resources\AdminDamageResource;
use App\Http\Resources\HostHomeReportsResource;
use App\Http\Resources\UserReportsResource;
use App\Models\Booking;
use App\Models\Hosthomecohost;
use App\Models\ReportPropertyDamage;
use App\Models\ReportPropertyDamagePhotos;
use App\Models\ReportUser;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    /**
     * @lrd:start
     * Retrieves a collection of reported issues for host homes.
     *
     * @return \App\Http\Resources\HostHomeReportsResource  The resource collection containing reported issues.
     * @lrd:end
    */
    public function index()
    {
        return HostHomeReportsResource::collection(
            Reporthosthome::latest()->get()
        );
    }
    
    /**
     * @lrd:start
     * Retrieves a collection of reported issues for guests or hosts.
     *
     * @return \App\Http\Resources\HostHomeReportsResource  The resource collection containing reported issues.
     * @lrd:end
    */
    public function getUsersReports()
    {
        return UserReportsResource::collection(
            ReportUser::latest()->get()
        );
    }

    /**
     * @lrd:start
     * Stores a new report for a host home.
     *
     * @param  \App\Http\Requests\StoreReporthosthomeRequest  $request  The request object containing validated data.
     * @return \Illuminate\Http\Response
     * @lrd:end
    */
    public function store(StoreReporthosthomeRequest $request)
    {
        // Validate the request data
        $data = $request->validated();

        // Create a new Reporthosthome instance
        $reporthosthome = new Reporthosthome();

        // Set the attributes of the report
        $reporthosthome->title = $data['title'];
        $reporthosthome->reasonforreporting = $data['reasonforreporting'];
        
        $reporthosthome->user_id = auth()->id();
        $reporthosthome->host_home_id = $data['host_home_id'];

        if (isset($data['extrareasonforreporting'])) {
            $reporthosthome->extrareasonforreporting = $data['extrareasonforreporting'];
        }
        // Save the report
        $reporthosthome->save();

        // Return a response indicating success
        return response()->json(['message' => 'Report submitted successfully'], 201);
    }

    /**
     * @lrd:start
     * Stores a new report for a guest or host.
     *
     * @param  \App\Http\Requests\StoreReporthosthomeRequest  $request  The request object containing validated data.
     * @return \Illuminate\Http\Response
     * @lrd:end
    */
    public function reportUser(StoreReportUserRequest $request)
    {
        // Validate the request data
        $data = $request->validated();

        // Create a new Reporthosthome instance
        $reportUser = new ReportUser();

        $reportUser->reasonforreporting = $data['reasonforreporting'];
        
        $reportUser->user_id = auth()->id();
        $reportUser->hostorguestuser_id = $data['hostorguestuser_id'];

        if (isset($data['extrareasonforreporting'])) {
            $reportUser->extrareasonforreporting = $data['extrareasonforreporting'];
        }
        // Save the report
        $reportUser->save();

        // Return a response indicating success
        return response()->json(['message' => 'Report submitted successfully'], 201);
    }
    

    /**
     * @lrd:start
     * Report property d`amage for a booking.
     *
     * This method allows hosts to report property damage for a specific booking,
     * providing details about the damage along with optional photos and videos.
     *
     * @param \App\Http\Requests\ReportDamageRequest $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Exception
     *
     * @response 200 {
     *     "message": "Damage reported successfully.",
     *     "data": {
     *         // Additional details about the reported damage
     *     }
     * }
     * @response 404 {
     *     "message": "Booking Number incorrect"
     * }
     * @response 422 {
     *     "message": "Validation failed.",
     *     "errors": {
     *         // Validation error details
     *     }
     * }
     * @response 500 {
     *     "message": "An error occurred while reporting the damage.",
     *     "error": "Exception message details"
     * }
     * @lrd:end
    */
    public function reportDamage(ReportDamageRequest $request)
    {
        try {
            // Validate the incoming request data
            $data = $request->validated();

            $hostid = null;

            $cohost = Hosthomecohost::where('user_id', auth()->id())->first();

            if ($cohost) {
                $hostid = $cohost->host_id;
            } else {
                $hostid = auth()->id();
            }
            
            // Find the booking based on the paymentId
            $booking = Booking::where("paymentId", $data['booking_number'])
            ->where('hostId', $hostid)
            ->first();

            // If the booking is not found, throw a 404 error
            if (!$booking) {
                abort(404, "Booking Details incorrect");
            }
            
            $reportDamageData = ReportPropertyDamage::where('booking_number',$data['booking_number'])->first();
            
            if ($reportDamageData) {
                abort(400, "You can't report for a booking more than once");
            }

            // Check if the booking is eligible for damage report
            if (!$this->isEligibleForDamageReport($booking)) {
                // Create a new ReportPropertyDamage record
                $reportDamage = new ReportPropertyDamage();
                $reportDamage->booking_number = $data['booking_number'];
                $reportDamage->host_id = auth()->id();
                $reportDamage->damage_description = $data['description'];
                $reportDamage->video = $this->saveVideo($data['video']);
                $reportDamage->save();

                // Iterate through each photo and create an Image record
                $images = $data['photos'];
                foreach ($images as $base64Image) {
                    $imageData = [
                        'photos' => $base64Image,
                        'report_property_damage_id' => $reportDamage->id,
                    ];
                    $this->createImages($imageData);
                }

                // Update the booking's pauseSecurityDepositToGuest
                $booking->pauseSecurityDepositToGuest = now();
                $booking->save();

                // Provide a success response
                return response()->json([
                    'message' => 'Damage reported successfully.',
                    'data' => $reportDamage,
                ], 200);
            } else {
                // Provide a response when the booking is not eligible for damage report
                abort(400, 'Damage report not allowed after 24 hours of check-out.');
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Provide a response for validation failure
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while reporting the damage.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if the booking is eligible for damage report.
     *
     * @param \App\Models\Booking $booking
     * @return bool
     */
    private function isEligibleForDamageReport($booking)
    {
        $checkoutNotification = $booking->checkOutNotification;
        $twentyFourHoursAgo = now()->subHours(24);

        info($checkoutNotification);
        info($twentyFourHoursAgo);
        info($checkoutNotification <= $twentyFourHoursAgo);

        // Return true if the current time is within 24 hours of check-out notification
        return $checkoutNotification <= $twentyFourHoursAgo;
    }

    

    /**
     * @lrd:start
     * Get pending property damage reports for admin review.
     *
     * This method retrieves property damage reports with a status of 'pending'
     * for administrative review. It returns a collection of AdminDamageResource,
     * providing detailed information about each pending report.
     *
     * @lrd:end
    */

    public function getReportDamagesForAdmin()
    {
        try {
            
            $reportDamage = ReportPropertyDamage::where('status','pending')->get();
            return AdminDamageResource::collection($reportDamage);

            
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while reporting the damage.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @lrd:start
     * Assign the security deposit to the guest based on the booking number.
     *
     * @param  string $bookingNumber The booking number to identify the booking.
     * @param  $id The ReportPropertyDamage id to identify the property.
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
    */
    public function assignSecurityDepositToGuest($bookingNumber,$id)
    {
        try {
            // Find the booking based on the booking number
            $booking = Booking::where("paymentId", $bookingNumber)->first();

            $reportDamage = ReportPropertyDamage::findOrFail($id);

            // Update the status to 'resolved'
            $reportDamage->update(['status' => 'resolved']);

            // If the booking is not found, throw a 404 error
            if (!$booking) {
                abort(404, "Booking Number incorrect");
            }

            // Update the booking's pauseSecurityDepositToGuest
            $booking->pauseSecurityDepositToGuest = null;
            $booking->save();


            return response()->json([
                'message' => 'Security deposit assigned to guest successfully.',
            ], 200);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while assigning security deposit to guest.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @lrd:start
     * Assign the security deposit to the host based on the booking number.
     *
     * @param  string $bookingNumber The booking number to identify the booking.
     * @param  $id The ReportPropertyDamage id to identify the property.
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
    */
    public function assignSecurityDepositToHost($bookingNumber,$id)
    {
        try {


            // Find the booking based on the booking number
            $booking = Booking::where("paymentId", $bookingNumber)->first();

            $reportDamage = ReportPropertyDamage::findOrFail($id);

            // Update the status to 'resolved'
            $reportDamage->update(['status' => 'resolved']);

            // If the booking is not found, throw a 404 error
            if (!$booking) {
                abort(404, "Booking Number incorrect");
            }

            // Assign the security deposit to the host
            $booking->securityDepositToHost = now();
            $booking->save();


            return response()->json([
                'message' => 'Security deposit assigned to host successfully.',
            ], 200);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while assigning security deposit to host.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * @lrd:start
     * Mark a property damage report as resolved.
     *
     * This method updates the status of a property damage report to 'resolved'
     * based on the provided report ID. It returns a JSON response indicating
     * the success or failure of the operation.
     *
     * @param int $id The ID of the property damage report to mark as resolved.
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
    */
    public function markDamageReportResolved($id)
    {
        try {
            // Find the property damage report by ID
            $reportDamage = ReportPropertyDamage::findOrFail($id);

            // Update the status to 'resolved'
            $reportDamage->update(['status' => 'resolved']);

            // Return a success response
            return response()->json(['message' => 'Property damage report marked as resolved.'], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Handle case where the report ID is not found
            return response()->json(['error' => 'Property damage report not found.'], 404);

        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while marking the property damage report as resolved.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    private function saveVideo($video)
    {
        // Check if video is base64 string
        if (preg_match('/^data:video\/(\w+);base64,/', $video, $matches)) {
            $videoData = substr($video, strpos($video, ',') + 1);
            $videoType = strtolower($matches[1]);
            
            // Decode base64 video data
            $decodedVideo = base64_decode($videoData);

            if ($decodedVideo === false) {
                throw new \Exception('Failed to decode video');
            }
        } else {
            throw new \Exception('Invalid video format');
        }

        $dir = 'videos/';
        $file = Str::random() . '.' . $videoType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Save the decoded video to the file
        if (!file_put_contents($absolutePath . $file, $decodedVideo, FILE_BINARY)) {
            throw new \Exception('Failed to save video');
        }

        return $relativePath;
    }
    
    public function createImages($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'photos' => ' required | string',
            'report_property_damage_id' => 'exists:App\Models\ReportPropertyDamage,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();
        $data2['photos'] = $this->saveImage($data2['photos'], $data2['report_property_damage_id']);

        return ReportPropertyDamagePhotos::create($data2);
    }

    
    private function saveImage($image,$report_property_damage_id)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                $report_property_damage = ReportPropertyDamage::find($report_property_damage_id);
                $report_property_damage->delete();
                throw new \Exception('Failed to decode image');
            }
        } else {
            $report_property_damage = ReportPropertyDamage::find($report_property_damage_id);
            $report_property_damage->delete();
            throw new \Exception('Invalid image format');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $imageType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Save the decoded image to the file
        if (!file_put_contents($relativePath, $decodedImage)) {
            throw new \Exception('Failed to save image');
        }

        return $relativePath;
    }
    
    /**
     * @lrd:start
     * Deletes a reported issue for a User.
     *
     * @param  \App\Models\Reporthosthome  $id  The Reporthosthome instance to be deleted.
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
    */
    public function destroyReportUser($id)
    {
        $reportUser = ReportUser::find($id);
        $reportUser->delete();

        // Return a response indicating success
        return response()->json(['message' => 'Report deleted successfully'], 200);
    }

    /**
     * @lrd:start
     * Deletes a reported issue for a host home.
     *
     * @param  \App\Models\Reporthosthome  $id  The Reporthosthome instance to be deleted.
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
    */
    public function destroy(Reporthosthome $reporthosthome)
    {
        // Delete the specified Reporthosthome instance
        $reporthosthome->delete();

        // Return a response indicating success
        return response()->json(['message' => 'Report deleted successfully'], 200);
    }

}
