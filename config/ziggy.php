<?php

/*
 * Which named routes are sent to the browser for the JS route() helper.
 * Customers and guests don't get the admin routes or framework internals;
 * admins get everything they need. (The routes are still protected on the
 * server either way; this just keeps the public route list tidy.)
 */

$internal = ['!sanctum.*', '!storage.*'];

return [
    'groups' => [
        'admin' => $internal,

        'customer' => [
            ...$internal,
            '!products.*',
            '!orders.index',
            '!orders.deliver',
            '!orders.adminCancel',
        ],
    ],
];
