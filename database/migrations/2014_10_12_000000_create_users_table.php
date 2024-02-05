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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('password')->nullable();
            $table->string('phone')->nullable();
            $table->string('verification_type')->nullable();
            $table->string('government_id')->nullable();
            $table->string('live_photo')->nullable();
            $table->string('profilePicture')->nullable();
            $table->string('country')->nullable();
            $table->string('street')->nullable();
            $table->string('zipcode')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->integer('host')->default(0);
            $table->string('verified')->nullable();
            $table->unsignedInteger('delete_attempts')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('adminStatus')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->boolean('email_verified_at')->default(0);
            $table->string('emergency_no')->nullable();
            $table->string('google_id')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
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
        Schema::dropIfExists('users');
    }
};
