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
            $table->foreignIdFor(\App\Models\User::class,"user_id");
            $table->string("property_type");
            $table->string("guest_choice");
            $table->string("address");
            $table->integer("guests");
            $table->integer("bedroom");
            $table->integer("beds");
            $table->integer("bathrooms");
            $table->string("video");
            $table->string("title");
            $table->text("description");
            $table->string("reservation");
            $table->string("price");
            $table->string("host_type");
            $table->string("check_in_time");
            $table->string("cancellation_policy");
            $table->string("security_deposit");
            $table->integer("verified")->default(0);
            $table->timestamps();
            $table->string('banned')->nullable();
            $table->string('suspend')->nullable();
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
