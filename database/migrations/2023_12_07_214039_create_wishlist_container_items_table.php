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
        Schema::create('wishlist_container_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Wishlistcontainer::class, 'wishlistcontainer_id')->onDelete('cascade');
            $table->foreignIdFor(\App\Models\HostHome::class, 'host_home_id')->onDelete('cascade');
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
        Schema::dropIfExists('wishlist_container_items');
    }
};
