<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcceptGuestRequest extends Model
{
    use HasFactory;

    protected $guarded = []; 

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hostHome()
    {
        return $this->belongsTo(HostHome::class);
    }
}
