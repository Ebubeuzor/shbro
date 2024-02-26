<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hosthomecohost extends Model
{
    use HasFactory;
    
    protected $guarded = [];

    
    public function hosthome(){
        return $this->belongsTo(HostHome::class);
    }
}
