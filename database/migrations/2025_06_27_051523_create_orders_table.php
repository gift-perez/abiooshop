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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->enum('order_status', ['pending', 'processing', 'paid', 'payment_failed', 'delivered', 'completed', 'cancelled_user', 'cancelled_admin'])->default('pending');
            $table->decimal('subtotal');
            $table->decimal('shipping_cost')->default(100.00);
            $table->decimal('total_cost')->nullable();
            $table->text('notes') ->nullable();
            $table->text('address');
            $table->string('name');
            $table->string('phone');
            $table->json('cart');
            $table->boolean('payment_initiated')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
