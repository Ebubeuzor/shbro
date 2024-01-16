<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCreateUserCardRequest;
use App\Http\Requests\StoreWishlistRequest;
use App\Http\Requests\UserDetailsUpdateRequest;
use App\Http\Resources\StoreWishlistResource;
use App\Http\Resources\UserResource;
use App\Mail\ActivateAccount;
use App\Mail\VerifyUser;
use App\Models\HostHome;
use App\Models\Notification;
use App\Models\Tip;
use App\Models\User;
use App\Models\UserCard;
use App\Models\Wishlistcontainer;
use App\Models\WishlistContainerItem;
use App\Models\WishlistControllerItem;
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
     * this gets the details of every user that is not  verified
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

        if (trim(isset($data['containername']))) {
            $user = User::where('id', $id)->firstOrFail();

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
        } elseif (trim(isset($data['wishcontainerid'])) &&  trim(isset($data['wishcontainerid']))) {
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
            // Delete the user's access token if it exists
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
            Mail::to($user->email)->send(new ActivateAccount($user));
            return response('Mail sent',204);
        }else {
            return response('User not found.',422);
        }

    }

    public function destroy(User $user)
    {
        $user->forceDelete();
        $user->hosthomes()->forceDelete();
    }

    
}
