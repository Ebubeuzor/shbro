<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishlistContainerItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function hosthomes(){
        return $this->belongsTo(HostHome::class)->withTrashed();
    }

    public function wishlistcontainer(){
        return $this->belongsTo(Wishlistcontainer::class);
    }


}
