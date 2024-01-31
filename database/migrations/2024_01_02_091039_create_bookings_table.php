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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('adults');
            $table->string('children');
            $table->string('pets');
            $table->string('infants');
            $table->string('check_in');
            $table->string('check_out');
            $table->string('check_out_time')->nullable();
            $table->integer('duration_of_stay');
            $table->string('paymentStatus')->nullable();
            $table->string('paymentId')->nullable();
            $table->string('paymentType')->nullable();
            $table->string('host_service_charge')->nullable();
            $table->string('guest_service_charge')->nullable();
            $table->string('vat_charge')->nullable();
            $table->string('totalamount')->nullable();
            $table->string('profit')->nullable();
            $table->string('securityDeposit')->nullable();
            $table->string('hostBalance')->nullable();
            $table->string('twoDayReminder')->nullable();
            $table->string('fewHoursReminder')->nullable();
            $table->string('checkInNotification')->nullable();
            $table->integer('checkOutNotification')->nullable();
            $table->string('paidHostStatus')->nullable();
            $table->string('paidHostApproval')->nullable();
            $table->string('paidHostdate')->nullable();
            $table->string('paidHostPaymentId')->nullable();
            $table->integer('hostId')->nullable();
            $table->foreignIdFor(\App\Models\User::class,"user_id");
            
            $table->foreignIdFor(\App\Models\HostHome::class, "host_home_id")->onDelete('cascade');
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
        Schema::dropIfExists('bookings');
    }
};
