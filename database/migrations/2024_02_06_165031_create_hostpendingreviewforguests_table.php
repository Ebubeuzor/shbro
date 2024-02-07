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
        if (!Schema::hasTable('hostpendingreviewforguests')) {
            Schema::create('hostpendingreviewforguests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('host_home_id')->constrained()->onDelete('cascade');
                $table->foreignId('booking_id')->constrained()->onDelete('cascade');
                $table->integer("guest_id");
                $table->string("status")->default("pending");
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hostpendingreviewforguests');
    }
};
