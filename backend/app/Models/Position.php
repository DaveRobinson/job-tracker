<?php

namespace App\Models;

use App\PositionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'company',
        'recruiter_company',
        'title',
        'description',
        'status',
        'location',
        'salary',
        'url',
        'notes',
        'applied_at',
    ];

    protected $casts = [
        'applied_at' => 'date',
        'status' => PositionStatus::class,
    ];
}
