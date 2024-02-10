<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reporthosthome;
use App\Http\Requests\StoreReporthosthomeRequest;
use App\Http\Requests\StoreReportUserRequest;
use App\Http\Requests\UpdateReporthosthomeRequest;
use App\Http\Resources\HostHomeReportsResource;
use App\Http\Resources\UserReportsResource;
use App\Models\ReportUser;

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
