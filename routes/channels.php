<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('order.{orderId}', function ($user, $orderId) {
    // Logic: Only allow if user owns this order, or is admin, etc.
    return true; // Example: allow all authenticated users (for demo)
});
