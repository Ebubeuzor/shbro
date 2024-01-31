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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->integer("ratings");
            $table->integer("host_id");
            $table->string("title");
            $table->text("comment");
            $table->foreignIdFor(\App\Models\User::class,"user_id");
            $table->foreignIdFor(\App\Models\Booking::class,"booking_id");
            $table->foreignIdFor(\App\Models\HostHome::class, "host_home_id")->onDelete('cascade');
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
        Schema::dropIfExists('reviews');
    }
};
