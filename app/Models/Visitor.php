<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;
    protected $guarded = [];
    
    public function getViewsAttributes($value){
        return $value != 0 ? ($value/2) : 0;
    }
}
