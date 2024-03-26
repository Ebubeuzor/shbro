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
        Schema::create('admin_guest_chats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id')->constrained('users', 'id')->onDelete('cascade')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->nullable();
            $table->text('message')->nullable();
            $table->string('image')->nullable();
            $table->timestamp('start_convo')->nullable();
            $table->timestamp('end_convo')->nullable();
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
        Schema::dropIfExists('admin_guest_chats');
    }
};
