<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportPropertyDamage extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function imagesandvideo(){
        return $this->hasMany(ReportPropertyDamagePhotos::class);
    }
    
}