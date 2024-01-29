<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FilterHomepageLocationRequest;
use App\Http\Requests\FilterHomepageRequest;
use App\Http\Requests\StoreCreateUserBankAccountRequest;
use App\Http\Requests\StoreCreateUserCardRequest;
use App\Http\Requests\StoreWishlistRequest;
use App\Http\Requests\UserDetailsUpdateRequest;
use App\Http\Resources\BookedResource;
use App\Http\Resources\HostHomeResource;
use App\Http\Resources\StoreWishlistResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserTripResource;
use App\Http\Resources\WishlistContainerItemResource;
use App\Mail\ActivateAccount;
use App\Mail\VerifyUser;
use App\Models\Booking;
use App\Models\HostHome;
use App\Models\Notification;
use App\Models\Tip;
use App\Models\User;
use App\Models\Userbankinfo;
use App\Models\UserCard;
use App\Models\UserTrip;
use App\Models\Wishlistcontainer;
use App\Models\WishlistContainerItem;
use App\Models\WishlistControllerItem;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Jlorente\Laravel\CreditCards\Facades\CreditCardValidator;

class UserController extends Controller
{
    /**
     * @lrd:start
     * this gets the details of every user that is not  verified so that they can be verified by the admin
     * @lrd:end
     */
    public function index()
    {
        return UserResource::collection(
            User::Where('verified' , "Not Verified")->get()
        );
    }
    /**
     * @lrd:start
     * this gets the tips of an auth user
     * @lrd:end
     */
    public function userTips()
    {
        $user = Auth::user();
        $tips = $user->tips;
        return response($tips);
    }

    public function create()
    {
        //
    }

    /**
     * @lrd:start
     * This requests an authenticated user details this is a get request
     * @lrd:end
     */
    public function getUserInfo(Request $request)
    {
        return $request->user();
    }
    
    /**
     * @lrd:start
     * Not in use
     * @lrd:end
     */
    public function store(Request $request)
    {
        //
    }
    
    /**
     * @lrd:start
     * Not in use
     * @lrd:end
     */
    public function show(User $user)
    {
        //
    }
    
    /**
     * @lrd:start
     * Not in use
     * @lrd:end
     */
    public function edit(User $user)
    {
        //
    }

    private function saveImage($image)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Check if file is an image
            if (!in_array($imageType, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('Invalid image type');
            }

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                throw new \Exception('Failed to decode image');
            }
        } else {
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
     * This is a put request and it is used to update a user information as you can see it accept a value in the url this value is an authenticated user id
     * and also when the user google_id is null disable the input tag for the email the google_id is what tells you the user used google to sign up and userid is the auth user id
     * @lrd:end
     */

    public function update(UserDetailsUpdateRequest $request, $userDetail)
    {
        $user = User::whereId($userDetail)->first();
        $data = $request->validated();
        if (trim(! empty($data['firstName'])) || trim(! empty($data['lastName']))) {
            $user->update([
                'name' => $data['firstName'] . " " . $data['lastName']
            ]);
        }
        elseif(trim(! empty($data['email']))){
            $user->update([
                'email' => $data['email']
            ]);
        }
        elseif(trim(! empty($data['country'])) || trim(! empty($data['zipCode'])) || trim(! empty($data['street'])) || trim(! empty($data['city'])) || trim(! empty($data['state']))){
            $user->update([
                'country' => $data['country'],
                'street' => $data['street'],
                'state' => $data['state'],
                'city' => $data['city'],
                'zipcode' => $data['zipCode']
            ]);
        }
        elseif(trim(! empty($data['phone']))){
            $user->update([
                'phone' => $data['phone']
            ]);
        }
        elseif(trim(! empty($data['profilePicture']))){
            $user->update([
                'profilePicture' => $this->saveImage($data['profilePicture'])
            ]);
        }
        elseif(trim(! empty($data['emergency_no']))){
            $user->update([
                'emergency_no' => $data['emergency_no']
            ]);
        }
        elseif(trim(! empty($data['status']))){
            $user->update([
                'verified' => $data['status']
            ]);
            $notify = new Notification();
            $notify->user_id = $user->id;
            $notify->Message = "You Government id is " . $data['status'];
            $notify->save();
            
            if ($data['status'] != "Verified") {
                $tip = new Tip();
                $tip->user_id = $user;
                $tip->message = "You Government id is " . $data['status'];
                $tip->url = "/AddGovvernmentId";
                $tip->save();
            }
            
            Mail::to($user->email)->send(new VerifyUser($data['status']));

        }
        elseif(isset($data['government_id']) && isset($data['live_photo']) && isset($data['verification_type'])){
            $user->update([
                'verified' => "Not Verified",
                'verification_type' => $data['verification_type'],
                'government_id' => $this->saveImage($data['government_id']),
                'live_photo' => $this->saveImage($data['live_photo'])
            ]);
        }else{
            return response("Please fill out all fields",422);
        }
        
        $user->save();
        return response("Updated successfully");

    }

    
    /**
     * @lrd:start
     * This is used to create a wishlistcontainer and wishlistitem
     * or use an existing wishlistcontainer and wishlistitem
     * and userid is an auth user id 
     * @lrd:end
     */
    public function createWishlist(StoreWishlistRequest $request, $id)
    {
        $data = $request->validated();

        if (isset($data['containername'])) {
            $user = User::where('id', $id)->firstOrFail();

            // Check if a wishlist container with the same name already exists for the user
            if ($user->wishlistcontainers()->where('name', $data['containername'])->exists()) {
                return response("Wishlist container with the same name already exists", 422);
            }

            $wishlistContainer = new Wishlistcontainer();
            $wishlistContainer->user_id = $user->id;
            $wishlistContainer->name = $data['containername'];
            $wishlistContainer->save();

            $hosthome = HostHome::where('id', $data['hosthomeid'])->firstOrFail();

            // Check if the combination already exists before saving
            if (!$wishlistContainer->items()->where('host_home_id', $hosthome->id)->exists()) {
                $wishlistContainerItem = new WishlistContainerItem();
                $wishlistContainerItem->wishlistcontainer_id = $wishlistContainer->id;
                $wishlistContainerItem->host_home_id = $hosthome->id;
                $wishlistContainerItem->save();

                return response("Ok", 201);
            } else {
                return response("Item already exists in the wishlist container", 422);
            }
        } elseif (isset($data['wishcontainerid']) && isset($data['hosthomeid'])) {
            $hosthome = HostHome::where('id', $data['hosthomeid'])->firstOrFail();
            $wishlistcontainer = Wishlistcontainer::where('id', $data['wishcontainerid'])->firstOrFail();

            // Check if the combination already exists before saving
            if (!$wishlistcontainer->items()->where('host_home_id', $hosthome->id)->exists()) {
                $wishlistContainerItem = new WishlistContainerItem();
                $wishlistContainerItem->wishlistcontainer_id = $wishlistcontainer->id;
                $wishlistContainerItem->host_home_id = $hosthome->id;
                $wishlistContainerItem->save();

                return response("Ok", 201);
            } else {
                return response("Item already exists in the wishlist container", 422);
            }
        } else {
            return response("You are not setting it right", 422);
        }
    }

    /**
     * @lrd:start
     * Remove a HostHome from the user's wishlist.
     *
     * This endpoint allows authenticated users to remove a HostHome from their wishlist. 
     * 
     *
     * @param int $hostHomeId The ID of the HostHome to be removed from the wishlist.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully removed the HostHome from the wishlist.
     * - 403: Unauthorized to remove the item (e.g., user does not own the HostHome in the wishlist).
     * - 404: HostHome not found.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the HostHome with the given ID is not found.
     * 
     * Example Request:
     * ```
     * DELETE /api/wishlist/{hostHomeId}
     * ```
     * 
     * Example Response (Success):
     * ```
     * {
     *     "message": "HostHome successfully removed from the wishlist"
     * }
     * ```
     * 
     * Example Response (Unauthorized):
     * ```
     * {
     *     "error": "Unauthorized to remove the item"
     * }
     * ```
     * 
     * Example Response (Not Found):
     * ```
     * {
     *     "error": "HostHome not found"
     * }
     * @lrd:end
     */

     public function removeFromWishlist($hostHomeId)
     {
         $hostHome = HostHome::findOrFail($hostHomeId);
     
         // Check if the authenticated user owns the HostHome in their wishlist
         $user = User::find(auth()->id());
         $userWishlist = Wishlistcontainer::where();
     
         if ($user) {
             // Remove all wishlist items associated with this HostHome
             $hostHome->wishlistItems()->delete();
     
             return response("HostHome removed from the wishlist", 200);
         } else {
             return response("Unauthorized to remove the item", 403);
         }
     }

    /**
     * @lrd:start
     * This is a get request and it is used to get users wishlistContainers
     * @lrd:end
     */
    public function getUserWishlistContainers()
    {
        
        $user = User::where('id', auth()->id())->firstOrFail();
        $userWishlist = $user->wishlistcontainers()->get();
        return response()->json(['userWishlist' => $userWishlist]);
    }
    
    /**
     * @lrd:start
     * Get the user's wishlist containers and associated items.
     * This endpoint serves a GET request to retrieve the wishlist containers of the authenticated user.
     * Each wishlist container includes details about the container itself and its associated items.
     * @lrd:end
     */
    public function getUserWishlistContainersAndItems()
    {
        $user = User::where('id', auth()->id())->firstOrFail();

        // Eager load wishlist containers with associated items and hosthomes
        $userWishlist = $user->wishlistcontainers()->with('items')->get();

        // Transform the userWishlist to include hosthomes details without items
        $formattedWishlist = $userWishlist->map(function ($wishlistContainer) {
            return [
                'wishlistContainer' => [
                    'id' => $wishlistContainer->id,
                    'user_id' => $wishlistContainer->user_id,
                    'name' => $wishlistContainer->name,
                    'created_at' => $wishlistContainer->created_at,
                    'updated_at' => $wishlistContainer->updated_at,
                ],
                'itemsLength' => count($wishlistContainer->items),
                'items' => $wishlistContainer->items->map(function ($item) {
                    $hostHome = HostHome::find($item->host_home_id);
                    return [
                        'id' => $item->id,
                        'hosthomes' => [
                            'id' => $hostHome->id,
                            'hosthomephotos' => collect($hostHome->hosthomephotos)->map(function ($photo) {
                                $photoData = json_decode($photo, true);
                                return url($photoData['image']);
                            })->toArray(),
                        ],
                    ];
                }),
            ];
        });

        return response()->json(['userWishlist' => $formattedWishlist]);
    }
    
    /**
     * @lrd:start
     * Get all wishlist container items for a specific wishlist container.
     * @lrd:end
     */
    public function getWishlistContainerItems($wishlistContainerId)
    {
        // Find the wishlist container
        $wishlistContainer = Wishlistcontainer::findOrFail($wishlistContainerId);

        // Retrieve all wishlist container items for the given wishlist container
        $wishlistContainerItems = $wishlistContainer->items;

        // Transform the wishlistContainerItems using the WishlistContainerItemResource
        $formattedItems = WishlistContainerItemResource::collection($wishlistContainerItems);

        return response()->json(['wishlistContainerItems' => $formattedItems]);
    }
    
    /**
     * @lrd:start
     * This is used to rename a wishlist container name
     * id is the id of UserWishlistContainer
     * @lrd:end
     * @LRDparam name use|required
     */
    public function editUserWishlistContainerName(Request $request,$id)
    {
        $data = $request->validate([
            'name' => 'required'
        ]);

        $user = User::where('id', auth()->id())->firstOrFail();
        if ($user) {
            $wishlistcontainer = Wishlistcontainer::where('id',$id)->where('user_id',auth()->id())->first();
            $wishlistcontainer->update([
                'name' => $data['name']
            ]);
        }
        return response()->json("Updated",200);
    }
    
    /**
     * @lrd:start
     * This is used to delete a user wishlist container 
     * id is the id of UserWishlistContainer
     * @lrd:end
     */
    public function deleteUserWishlistContainer($id)
    {
        $user = User::where('id', auth()->id())->firstOrFail();
        if ($user) {
            $wishlistcontainer = Wishlistcontainer::where('id',$id)->where('user_id',auth()->id())->first();
            $wishlistcontainer->items()->delete();
            $wishlistcontainer->delete();
        }
        return response()->json("Deleted",200);
    }
    
    
    /**
     * @lrd:start
     * This is a delete request and it is used to delete users wishlistContainers
     * @lrd:end
     */

    public function deleteUserWishlistContainers()
    {
        // Get the authenticated user
        $user = User::find(auth()->id());

        // Delete all wishlist containers and their items for the user
        if ($user) {
            // Use each to delete each container and its items
            $user->wishlistcontainers->each(function ($wishlistcontainer) {
                $wishlistcontainer->items()->delete();
                $wishlistcontainer->delete();
            });

            return response()->json(['message' => 'All wishlist containers and items deleted successfully']);
        }

        return response()->json(['message' => 'User not found'], 404);
    }
    
    
    /**
     * @lrd:start
     * Retrieve trips for the authenticated user.
    *
    * This endpoint allows an authenticated user to retrieve a list of their trips.
    *
    * @return \Illuminate\Http\Response
    * 
    * - 200: Successfully retrieved the user's trips.
    * - 404: User not found.
     * @lrd:end
     */

    public function userTrips()
    {
        // Get the authenticated user
        $user = User::find(auth()->id());

        // Delete all wishlist containers and their items for the user
        if ($user) {
            return UserTripResource::collection(
                UserTrip::where('user_id',$user->id)->get()
            );
        }

        return response()->json(['message' => 'User not found'], 404);
    }
    

    /**
     * @lrd:start
     * This is a post request and it is used to create a user card information as 
     * you can see it accept a value in the url this value is an authenticated user id
     * @lrd:end
     */
    public function createCard(StoreCreateUserCardRequest $request, $id)
    {
        $user =  User::where('id', $id)->first();
        $data = $request->validated();
        $cardtype = null;
        $cardNumber = $data['card_number'];
        if (CreditCardValidator::isMastercard($cardNumber)) {
            $cardtype = "Master";
        }elseif (CreditCardValidator::isVisa($cardNumber)) {
            $cardtype = "Visa";
        }elseif (strlen($cardNumber) >= 16 && Str::startsWith($cardNumber,'5')) {
            $cardtype = "Verve";
        }else {
            return response("Incorrect Card Number or Card Not Supported",422);
        }
        $userCard = new UserCard();
        $userCard->user_id = $user->id;
        $userCard->card_number = $cardNumber;
        $userCard->expiry_data = $data['expiry_data'];
        $userCard->CVV = $data['CVV'];
        $userCard->cardtype = $cardtype;
        $userCard->save();
        
        return response("OK",201);
    }
    
    /**
     * @lrd:start
     * Create a user's bank account information.
     *
     * This endpoint allows an authenticated user to create their bank account information.
     * 
     * @param \App\Http\Requests\StoreCreateUserBankAccountRequest $request The HTTP request containing the bank account information.
     * @param int $id The ID of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 201: Successfully created the user's bank account information.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the user with the given ID is not found.
     * 
     * @lrd:end
     */
    public function createUserBankInfo(StoreCreateUserBankAccountRequest $request, $id)
    {
        try {
            // Retrieve the authenticated user
            $user = User::findOrFail($id);

            // Validate the request data
            $data = $request->validated();

            // Create and save the user's bank account information
            $userAccount = new Userbankinfo();
            $userAccount->user_id = $user->id;
            $userAccount->account_number = $data['account_number'];
            $userAccount->account_name = $data['account_name'];
            $userAccount->bank_name = $data['bank_name'];
            $userAccount->save();

            return response("OK", 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User not found", 404);
        }
    }

    

    /**
     * @lrd:start
     * This is a get request and it is used to get users card
     * two values a value for the userCardId and a value in the url this value is an authenticated user id
     * @lrd:end
     */

    public function getUserCards($userid)
    {
        $user = User::where('id', $userid)->first();
            
        $userCard = UserCard::where('user_id', $user->id)->get();

        return response([
            "data" => $userCard
        ],200);
    }


    /**
     * @lrd:start
     * Retrieve user's bank account information.
     *
     * This endpoint allows an authenticated user to retrieve their stored bank account information.
     * 
     * @param int $userid The ID of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the user's bank account information.
     * - 404: User not found.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the user with the given ID is not found.
     * 
     * @lrd:end
     */
    public function getUserBankInfos($userid)
    {
        try {
            // Retrieve the authenticated user
            $user = User::findOrFail($userid);
                
            // Retrieve the user's bank account information
            $userBankInfo = Userbankinfo::where('user_id', $user->id)->get();

            return response([
                "data" => $userBankInfo
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User not found", 404);
        }
    }

    

    /**
     * @lrd:start
     * This is a get request and it is used to select a user card as you can see it accept 
     * two values a value for the userCardId and a value an authenticated user id
     * @lrd:end
     */
    public function selectCard($userCardId, $userid)
    {
        $user = User::where('id', $userid)->first();
        $userCard = UserCard::where('id', $userCardId)->first();

        if ($user && $userCard) {
            
            UserCard::where('user_id', $userid)->update(['Selected' => null]);

            $userCard->update([
                'Selected' => 'Selected'
            ]);
            return response("OK",200);
        }else {
            return response("This Card does not belong to this user.",403);
        }
    }

    /**
     * @lrd:start
     * Select a user's bank account information.
     *
     * This endpoint allows an authenticated user to select a specific bank account information from their stored options.
     * 
     * @param int $userbankinfoId The ID of the user bank account information to be selected.
     * @param int $userid The ID of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully selected the user's bank account information.
     * - 403: The specified bank account does not belong to the user.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the user or bank account information with the given IDs is not found.
     * 
     * @lrd:end
     */
    public function selectBankInfo($userbankinfoId, $userid)
    {
        try {
            // Retrieve the authenticated user and user bank account information
            $user = User::findOrFail($userid);
            $userbankinfo = Userbankinfo::findOrFail($userbankinfoId);

            if ($user && $userbankinfo) {
                
                // Deselect all other bank account information for the user
                Userbankinfo::where('user_id', $userid)->update(['Selected' => null]);

                // Update the selected status for the specified bank account information
                $userbankinfo->update([
                    'Selected' => 'Selected'
                ]);

                return response("OK", 200);
            } else {
                return response("This bank account does not belong to this user.", 403);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User or bank account information not found", 404);
        }
    }

    /**
     * @lrd:start
     * This is to delete a user card as you can see it accept 
     * two values a value for the userCardId and a value an authenticated user id
     * @lrd:end
     */
    public function deleteUserCard($userCardId, $userid)
    {
        $user = User::where('id', $userid)->first();
        $userCard = UserCard::where('id', $userCardId)->first();

        if ($user && $userCard) {
            
            $usercardtodelete = UserCard::where('user_id', $userid);

            if ($usercardtodelete) {
                $userCard->delete();
            } else {
                return response("This Card does not belong to this user.",403);
            }
            
            return response("OK",200);
        }else {
            return response("This Card does not belong to this user.",403);
        }
    }
    
    /**
     * @lrd:start
     * This is a get request and it is used to deactivate an authenticated user
     * and delete his token if successful it should show 204
     * @lrd:end
     */
    public function deactivateAccount()
    {
        $user = Auth::user();

        if ($user) {
            /** @var User $user  */
            $currentAccessToken = $user->currentAccessToken();
            
            if ($currentAccessToken) {
                $currentAccessToken->delete();
            }

            // Deactivate the user's account
            $user->update(['is_active' => false]);

            return response('', 204);
        }

        return response('User not found.', 404);
    }
    
    /**
     * @lrd:start
     * This is a put request and it is used to reactivate a user account
     * @lrd:end
     * @LRDparam email use|required
     */
    public function reactivateAccount(Request $request)
    {
        $user = User::where('email',$request->email)->first();

        if ($user) {
            $user->update([
                'remember_token' =>null
            ]);
            Mail::to($user->email)->send(new ActivateAccount($user));
            
            return response('Mail sent',204);
        }else {
            return response('User not found.',422);
        }

    }

    /**
     * @lrd:start
     * Filters host homes based on specified criteria.
     * JSON response containing filtered host home data.
     * and if consumed will will return a 200 status code
     * @lrd:end
     */

    public function filterHomepage(FilterHomepageRequest $request)
    {
        try {
            $data = $request->validated();
            $propertyType = $data['property_type'];
            $minBedrooms = $data['bedrooms'];
            $minBeds = $data['beds'];
            $minBathrooms = $data['bathrooms'];
            $minPrice = $data['min_price'];
            $maxPrice = $data['max_price'];
            $amenities = $data['amenities'];

            $query = HostHome::where('verified', 1)
                            ->whereNull('disapproved')
                            ->whereNull('banned')
                            ->whereNull('suspend');

            if (!empty($propertyType) && is_array($propertyType)) {
                $query->whereIn('property_type', $propertyType);
            }

            if (!empty($minBedrooms) && is_numeric($minBedrooms)) {
                $query->where('bedroom', '>=', $minBedrooms);
            }

            if (!empty($minBeds) && is_numeric($minBeds)) {
                $query->where('beds', '>=', $minBeds);
            }

            if (!empty($minBathrooms) && is_numeric($minBathrooms)) {
                $query->where('bathrooms', '>=', $minBathrooms);
            }
            
            if (!empty($minPrice) && is_numeric($minPrice)) {
                $query->where('price', '>=', $minPrice);
            }
        
            if (!empty($maxPrice) && is_numeric($maxPrice)) {
                $query->where('price', '<=', $maxPrice);
            }

            if (!empty($amenities) && is_array($amenities)) {
                $query->whereHas('hosthomeoffers', function ($q) use ($amenities) {
                    $q->whereIn('offer', $amenities);
                });
            }

            $result = $query->with('hosthomephotos')->get();

            return response()->json(['data' => HostHomeResource::collection($result)], 200);
        } catch (QueryException $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        } catch (\Exception $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
    
    public function filterHomepageLocation(FilterHomepageLocationRequest $request)
    {
        try {
            $data = $request->validated();
            $propertyType = $data['property_type'];
            $minBedrooms = $data['bedrooms'];
            $minBeds = $data['beds'];
            $minBathrooms = $data['bathrooms'];
            $minPrice = $data['min_price'];
            $maxPrice = $data['max_price'];
            $amenities = $data['amenities'];

            $query = HostHome::where('verified', 1)
                            ->whereNull('disapproved')
                            ->whereNull('banned')
                            ->whereNull('suspend');

            if (!empty($propertyType) && is_array($propertyType)) {
                $query->whereIn('property_type', $propertyType);
            }

            if (!empty($minBedrooms) && is_numeric($minBedrooms)) {
                $query->where('bedroom', '>=', $minBedrooms);
            }

            if (!empty($minBeds) && is_numeric($minBeds)) {
                $query->where('beds', '>=', $minBeds);
            }

            if (!empty($minBathrooms) && is_numeric($minBathrooms)) {
                $query->where('bathrooms', '>=', $minBathrooms);
            }
            
            if (!empty($minPrice) && is_numeric($minPrice)) {
                $query->where('price', '>=', $minPrice);
            }
        
            if (!empty($maxPrice) && is_numeric($maxPrice)) {
                $query->where('price', '<=', $maxPrice);
            }

            if (!empty($amenities) && is_array($amenities)) {
                $query->whereHas('hosthomeoffers', function ($q) use ($amenities) {
                    $q->whereIn('offer', $amenities);
                });
            }

            $result = $query->with('hosthomephotos')->get();

            return response()->json(['data' => HostHomeResource::collection($result)], 200);
        } catch (QueryException $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        } catch (\Exception $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    
    /**
     * @lrd:start
     * Retrieve bookings for checking out.
     *
     * This endpoint allows a host to retrieve a list of bookings where guests are checking out.
     * Bookings are filtered based on the check_out date being greater than or equal to the present day,
     * successful payment status, the authenticated host's ID, and the check_out_time being greater than or equal to the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of bookings for checking out.
     * 
     * @lrd:end
     */
    public function checkingOut()
    {
        // Get bookings for checking out
        $bookings = Booking::where('check_out', '=', Carbon::today()->toDateString())
                        ->where('paymentStatus', 'success')
                        ->where('hostId', auth()->id())
                        ->where('check_out_time', '>=', Carbon::now()->format('g:i A'))
                        ->get();

        // Transform the bookings into the BookedResource
        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }


    /**
     * Retrieve currently hosted bookings.
     *
     * This endpoint allows a host to retrieve a list of currently hosted bookings.
     * Bookings are filtered based on the check_out date being less than or equal to the present day,
     * the check_in date being greater than or equal to the present day,
     * successful payment status, the authenticated host's ID, and the check_out_time being less than or equal to the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of currently hosted bookings.
     * 
     * 
     * @lrd:end
     */
    public function currentlyHosting()
    {
        // Get currently hosted bookings using a join
        $bookings = Booking::select('bookings.*')
                        ->join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
                        ->where('check_out', '<=', Carbon::today()->toDateString())
                        ->where('check_in', '>=', Carbon::today()->toDateString())
                        ->where('paymentStatus', 'success')
                        ->where('hostId', auth()->id())
                        ->where('host_homes.check_in_time', '>=', Carbon::now()->format('g:i A'))
                        ->where('check_out_time', '<=', Carbon::now()->format('g:i A'))
                        ->get();

        // Transform the bookings into the BookedResource
        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }

    /**
     * Retrieve bookings arriving soon.
     *
     * This endpoint allows a host to retrieve a list of bookings for the same day and before the check_in_time.
     * Bookings are filtered based on the check_in date being the present day,
     * successful payment status, the authenticated host's ID, and the check_in_time from the related HostHome model being greater than the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of bookings arriving soon.
     * @lrd:end
     */
    public function arrivingSoon()
    {
        // Get bookings where the check_in date is the present day using a join
        $bookings = Booking::select('bookings.*')
                    ->join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
                    ->whereDate('check_in', '=', Carbon::today()->toDateString())
                    ->where('paymentStatus', 'success')
                    ->where('hostId', auth()->id())
                    ->where(function ($query) {
                            $query->where('host_homes.check_in_time', '<', Carbon::now()->format('g:i A'))
                                ->orWhere(function ($q) {
                                    // If the check_in_time is '12:00 PM', treat it as '12:00 AM'
                                    $q->where('host_homes.check_in_time', '12:00 PM')
                                        ->where('host_homes.check_in_time', '<', Carbon::now()->format('g:i A'));
                                });
                        })->get();

        // Transform the bookings into the BookedResource
        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }

    /**
     * Retrieve upcoming reservations.
     * This endpoint allows a host to retrieve a list of upcoming reservations.
     * Reservations are filtered based on the check_in date being before or on the present day,
     * successful payment status, the authenticated host's ID, and the check_in_time from the related HostHome model
     * being less than the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of upcoming reservations.
     * 
     * @lrd:end
     */
    public function upcomingReservation()
    {
        // Get upcoming reservations using a join
        $bookings = Booking::select('bookings.*')
                    ->join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
                    ->whereDate('check_in', '>=', Carbon::today()->toDateString())
                    ->where('paymentStatus', 'success')
                    ->where('hostId', auth()->id())
                    ->where(function ($query) {
                        $query->where('host_homes.check_in_time', '<', Carbon::now()->format('g:i A'))
                            ->orWhere(function ($q) {
                                // If the check_in_time is '12:00 PM', treat it as '12:00 AM'
                                $q->where('host_homes.check_in_time', '12:00 PM')
                                    ->where('host_homes.check_in_time', '<', Carbon::now()->format('g:i A'));
                            });
                    })->get();

        // Transform the bookings into the BookedResource
        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }


    public function destroy(User $user)
    {
        $user->forceDelete();
        $user->hosthomes()->forceDelete();
    }

    
}
