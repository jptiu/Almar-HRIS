<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('date')->index();
            $table->time('clock_in')->nullable();
            $table->time('clock_out')->nullable();
            $table->datetime('clock_in_datetime')->nullable();
            $table->datetime('clock_out_datetime')->nullable();
            $table->string('status')->default('present'); // present, late, absent, on_leave
            $table->decimal('hours_worked', 4, 2)->nullable()->comment('Total hours worked');
            $table->text('notes')->nullable();
            $table->string('clock_in_latitude')->nullable();
            $table->string('clock_in_longitude')->nullable();
            $table->string('clock_out_latitude')->nullable();
            $table->string('clock_out_longitude')->nullable();
            $table->string('clock_in_ip_address', 45)->nullable();
            $table->string('clock_out_ip_address', 45)->nullable();
            $table->foreignId('leave_request_id')->nullable()->constrained('leave_requests')->nullOnDelete();
            $table->timestamps();

            // Prevent duplicate attendance records for same employee on same date
            $table->unique(['employee_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

