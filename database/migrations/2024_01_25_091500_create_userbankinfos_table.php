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
        Schema::create('userbankinfos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\User::class,"user_id");
            $table->string("account_number");
            $table->string("account_name");
            $table->string("bank_name");
            $table->string("selected")->nullable();
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
        Schema::dropIfExists('userbankinfos');
    }
};
