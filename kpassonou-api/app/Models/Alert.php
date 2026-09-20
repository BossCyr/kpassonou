<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'camera_id',
        'source_type',
        'lat',
        'lng',
        'water_level',
        'status',
        'timestamp',
        'address',
        'confidence',
        'image_url',
        'data_precision',
        'metrics',
        'totem_state',
    ];

    protected $casts = [
        'water_level' => 'float',
        'confidence' => 'float',
        'lat' => 'float',
        'lng' => 'float',
        'timestamp' => 'datetime',
        'metrics' => 'array',
        'totem_state' => 'array',
    ];
}
