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
        Schema::create('report_property_damage_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_property_damage_id')->constrained()->onDelete('cascade');
            $table->string("photos")->nullable();
            $table->string("video")->nullable();
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
        Schema::dropIfExists('report_property_damage_photos');
    }
};
