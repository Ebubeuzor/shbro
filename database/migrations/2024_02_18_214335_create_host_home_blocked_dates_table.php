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
        Schema::create('host_home_blocked_dates', function (Blueprint $table) {
            $table->id();
            $table->string("date");
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('host_home_id')->constrained()->onDelete('cascade');
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
        Schema::dropIfExists('host_home_blocked_dates');
    }
};
