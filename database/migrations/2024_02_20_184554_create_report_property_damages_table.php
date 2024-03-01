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
        Schema::create('report_property_damages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained('users', 'id')->onDelete('cascade');
            $table->string("booking_number");
            $table->string("video")->nullable();
            $table->string("status")->default("pending");
            $table->string("damage_description");
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
        Schema::dropIfExists('report_property_damages');
    }
};
