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
        Schema::table('employees', function (Blueprint $table) {
            // Add employee_status_id foreign key
            $table->unsignedBigInteger('employee_status_id')->nullable()->after('manager_id');
            $table->foreign('employee_status_id')->references('id')->on('employee_statuses')->onDelete('set null');

            // Add base_salary column
            $table->decimal('base_salary', 10, 2)->nullable()->after('employee_status_id');

            // Drop the old status enum column
            $table->dropColumn('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Drop foreign key and column
            $table->dropForeign(['employee_status_id']);
            $table->dropColumn('employee_status_id');
            $table->dropColumn('base_salary');

            // Restore the old status enum column
            $table->enum('status', ['active', 'inactive', 'terminated'])->default('active');
        });
    }
};

