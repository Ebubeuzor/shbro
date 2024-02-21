<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportDamageRequest;
use App\Models\Reporthosthome;
use App\Http\Requests\StoreReporthosthomeRequest;
use App\Http\Requests\StoreReportUserRequest;
use App\Http\Requests\UpdateReporthosthomeRequest;
use App\Http\Resources\HostHomeReportsResource;
use App\Http\Resources\UserReportsResource;
use App\Models\Booking;
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
            Reporthosthome::all()
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
            ReportUser::all()
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
    

    public function reportDamage(ReportDamageRequest $request)
    {
        $data = $request->validated();

        $booking = Booking::where("paymentId", $data['booking_number'])->first();

        if (!$booking) {
            abort(404, "Booking Number incorrect");
        }

        $reportDamage = new ReportPropertyDamage();
        $reportDamage->booking_number = $data['booking_number'];
        $reportDamage->host_id = auth()->id();
        $reportDamage->damage_description = $data['description'];
        $reportDamage->save();

        $images = $data['photos'];

        foreach ($images as $base64Image) {
            $imageData = ['photos' => $base64Image, 'report_property_damage_id' => $reportDamage->id];
            $this->createImages($imageData);
        }
    }
    
    public function createImages($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'photos' => 'string',
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

            // Check if file is an image
            if (!in_array($imageType, ['jpg', 'jpeg', 'gif', 'png','webp'])) {
                throw new \Exception('Invalid image type');
            }

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
