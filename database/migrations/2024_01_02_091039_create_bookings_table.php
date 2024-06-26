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
            $table->string('check_in_time')->nullable();
            $table->string('priceForANight')->nullable();
            $table->integer('duration_of_stay');
            $table->string('paymentStatus')->nullable();
            $table->string("transactionID")->nullable();
            $table->string('paymentId')->nullable();
            $table->string('paymentType')->nullable();
            $table->string('host_service_charge')->nullable();
            $table->string('guest_service_charge')->nullable();
            $table->string('host_service_charge_percentage')->nullable();
            $table->string('guest_services_charge_percentage')->nullable();
            $table->string('vat_charge')->nullable();
            $table->string('totalamount')->nullable();
            $table->string('profit')->nullable();
            $table->string('actualPrice')->nullable();
            $table->integer('bookingCount')->default(0);
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
            $table->string('guestPaidStatus')->nullable();
            $table->string('guestPaidDate')->nullable();
            $table->string('addedToHostWallet')->nullable();
            $table->string('addedToGuestWallet')->nullable();
            $table->string('pauseSecurityDepositToGuest')->nullable();
            $table->string('securityDepositToGuest')->nullable();
            $table->string('securityDepositToHost')->nullable();
            $table->string('securityDepositToHostWallet')->nullable();
            $table->integer('hostId')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
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
        Schema::dropIfExists('bookings');
    }
};
