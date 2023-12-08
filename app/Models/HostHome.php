<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HostHome extends Model
{
    use HasFactory;
    
    protected $guarded = [];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function hosthomedescriptions(){
        return $this->hasMany(Hosthomedescription::class);
    }

    public function hosthomediscounts(){
        return $this->hasMany(Hosthomediscount::class);
    }

    public function hosthomenotices(){
        return $this->hasMany(Hosthomenotice::class);
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

    public function hosthomerules(){
        return $this->hasMany(Hosthomerule::class);
    }
}
