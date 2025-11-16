<?php

namespace App\Models;

use App\PositionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
