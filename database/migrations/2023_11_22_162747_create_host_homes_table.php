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
        Schema::create('host_homes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string("property_type");
            $table->string("guest_choice");
            $table->string("address");
            $table->integer("guests");
            $table->integer("bedroom");
            $table->integer("beds");
            $table->integer("bathrooms");
            $table->string("video")->nullable();
            $table->string("title");
            $table->text("description");
            $table->string("reservation");
            $table->string("advance_notice")->nullable();
            $table->string("preparation_time")->nullable();
            $table->string("availability_window")->nullable();
            $table->string("price");
            $table->string("actualPrice");
            $table->string("weekendPrice")->nullable();
            $table->string("bookingCount")->nullable();
            $table->string("check_in_time")->nullable();
            $table->string("check_out_time")->nullable();
            $table->string("cancellation_policy")->nullable();
            $table->string("security_deposit")->nullable();
            $table->integer('service_fee')->nullable();
            $table->integer('min_nights')->nullable();
            $table->integer('max_nights')->nullable();
            $table->integer('tax');
            $table->integer('total');
            $table->string('disapproved')->nullable();
            $table->integer("verified")->default(0);
            $table->boolean('listing_status')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->string('banned')->nullable();
            $table->string('suspend')->nullable();
            $table->string('longitude')->nullable();
            $table->string('latitude')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('host_homes');
    }
};
