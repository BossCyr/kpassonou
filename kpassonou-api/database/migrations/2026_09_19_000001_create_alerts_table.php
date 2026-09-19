<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('camera_id');
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 11, 8);
            $table->float('water_level');
            $table->enum('status', ['safe', 'warning', 'alert']);
            $table->timestamp('timestamp');
            $table->string('address');
            $table->float('confidence')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
