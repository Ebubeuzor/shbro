<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('adults');
            $table->string('children');
            $table->string('pets');
            $table->string('infants');
            $table->string('check_in');
            $table->string('check_out');
            $table->string('check_out_time')->nullable();
            $table->integer('duration_of_stay');
            $table->string('paymentStatus')->nullable();
            $table->string('paymentId')->nullable();
            $table->string('twoDayReminder')->nullable();
            $table->string('fewHoursReminder')->nullable();
            $table->string('checkInNotification')->nullable();
            $table->foreignIdFor(\App\Models\User::class,"user_id");
            $table->foreignIdFor(\App\Models\HostHome::class,"host_home_id");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};
