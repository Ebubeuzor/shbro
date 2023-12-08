<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getVerifiedAttriutes($value){
        return $value != 0 ? "Verified" : "Not verified";
    }    

    public function notifications(){
        return $this->hasMany(Notification::class);
    }

    public function hosthomes(){
        return $this->hasMany(HostHome::class);
    }

    public function wishlists(){
        return $this->hasMany(Wishlist::class);
    }

    public function wishlistcontainers(){
        return $this->hasMany(Wishlistcontainer::class);
    }

    public function usertokens()
    {
        return $this->hasMany(SanctumPersonalAccessToken::class,'tokenable_id');
    }

    
}
