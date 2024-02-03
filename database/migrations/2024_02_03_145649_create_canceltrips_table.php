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
        Schema::create('canceltrips', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\User::class,"user_id");
            $table->foreignIdFor(\App\Models\Booking::class,"booking_id");
            $table->integer("host_id");
            $table->string("status")->default("Cancel");
            $table->string("reasonforcancel");
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
        Schema::dropIfExists('canceltrips');
    }
};
