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
        Schema::create('reserved_prices_for_certain_days', function (Blueprint $table) {
            $table->id();
            $table->string("date");
            $table->string("price");
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
        Schema::dropIfExists('reserved_prices_for_certain_days');
    }
};
