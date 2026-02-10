<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['department_id']);

            // Drop the old unique constraint on (department_id, title)
            $table->dropUnique(['department_id', 'title']);

            // Add new unique constraint on (department_id, title, position_level_id)
            $table->unique(['department_id', 'title', 'position_level_id']);

            // Re-add the foreign key constraint
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['department_id']);

            // Drop the new unique constraint
            $table->dropUnique(['department_id', 'title', 'position_level_id']);

            // Restore the old unique constraint
            $table->unique(['department_id', 'title']);

            // Re-add the foreign key constraint
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
        });
    }
};

