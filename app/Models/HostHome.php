<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HostHome extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function hosthomedescriptions(){
        return $this->hasMany(Hosthomedescription::class);
    }

    public function hosthomereviews(){
        return $this->hasMany(Review::class);
    }

    public function acceptedRequest(){
        return $this->hasMany(AcceptGuestRequest::class);
    }

    public function reservedPricesForCertainDay(){
        return $this->hasMany(ReservedPricesForCertainDay::class);
    }

    public function hosthomediscounts(){
        return $this->hasMany(Hosthomediscount::class);
    }

    public function hosthomenotices(){
        return $this->hasMany(Hosthomenotice::class);
    }

    
    public function cohosthomes(){
        return $this->hasMany(Hosthomecohost::class);
    }
    
    public function hosthomeoffers(){
        return $this->hasMany(Hosthomeoffer::class);
    }

    public function hosthomephotos(){
        return $this->hasMany(Hosthomephoto::class);
    }

    public function hosthomereservations(){
        return $this->hasMany(Hosthomereservation::class);
    }

    public function hosthomecustomdiscounts(){
        return $this->hasMany(HostHomeCustomDiscount::class);
    }

    public function hosthomeblockeddates(){
        return $this->hasMany(HostHomeBlockedDate::class);
    }

    public function hosthomerules(){
        return $this->hasMany(Hosthomerule::class);
    }
    
    public function allowsPets()
    {
        return !$this->hosthomerules()->where('rule', 'LIKE', '%No pets%')->exists();
    }
    
    public function bookings(){
        return $this->hasMany(Booking::class);
    }

    public function wishlistItems()
    {
        return $this->hasMany(WishlistContainerItem::class);
    }
}
