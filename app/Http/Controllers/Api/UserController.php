<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserDetailsUpdateRequest;
use App\Http\Resources\UserResource;
use App\Mail\VerifyUser;
use App\Models\HostHome;
use App\Models\Notification;
use App\Models\User;
use App\Models\Wishlistcontainer;
use App\Models\WishlistContainerItem;
use App\Models\WishlistControllerItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return UserResource::collection(
            User::Where('verified' , "Not Verified")->get()
        );
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(User $user)
    {
        //
    }

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
            Mail::to($user->email)->send(new VerifyUser($data['status']));
        }
        elseif(isset($data['government_id'])){
            $user->update([
                'verified' => "Not Verified",
                'government_id' => $this->saveImage($data['government_id'])
            ]);
        }
        elseif(isset($data['live_photo'])){
            $user->update([
                'verified' => "Not Verified",
                'live_photo' => $this->saveImage($data['live_photo'])
            ]);
        }else{
            return response("",422);
        }
        
        $user->save();
        return response("Updated successfully");

    }

    
    public function createWishlist(Request $request,$id)
    {
        $data = $request->validate([
            "containername" => 'required'
        ]);

        $user = User::where('id',$id)->firstOrFail();

        $wishlistContainer = new Wishlistcontainer();
        $wishlistContainer->user_id = $user->id;
        $wishlistContainer->name = $data['containername'];
        $wishlistContainer->save();
        return response("Ok",201);

    }
    
    public function createWishlistItem($wishcontainerid,$hosthomeid)
    {
        $hosthome = HostHome::where('id',$hosthomeid)->firstOrFail();
        $wishlistcontainer = Wishlistcontainer::where('id',$wishcontainerid)->firstOrFail();

        $wishlistContainerItem = new WishlistContainerItem();
        $wishlistContainerItem->wishlistcontainer_id = $wishlistcontainer->id;
        $wishlistContainerItem->host_home_id = $hosthome->id;
        $wishlistContainerItem->save();
        return response("Ok",201);

    }

    
    public function destroy(User $user)
    {
        $user->delete();
    }

    
}
