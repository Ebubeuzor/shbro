<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function hosthome(){
        return $this->belongsTo(HostHome::class);
    }

    public function getFormattedCheckInAttribute()
    {
        return Carbon::createFromFormat('Y-m-d', $this->attributes['check_in'])->format('j F Y');
    }

    public function getFormattedCheckOutAttribute()
    {
        $checkOutDate = Carbon::createFromFormat('Y-m-d', $this->attributes['check_out']);

        if (Carbon::today()->gt($checkOutDate)) {
            return 'Expired';
        } elseif ($checkOutDate->isToday()) {
            return 'Today';
        } else {
            return $checkOutDate->format('j F Y');
        }
    }


}
