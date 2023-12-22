<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlistcontainer extends Model
{
    use HasFactory;
    protected $guarded = [];

    
    public function users(){
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(WishlistContainerItem::class, 'wishlistcontainer_id');
    }

}
