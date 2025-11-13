<?php

namespace App;

enum PositionStatus: string
{
    case Saved = 'saved';
    case Applied = 'applied';
    case Interviewing = 'interviewing';
    case Offered = 'offered';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';

    public function label(): string
    {
        return match ($this) {
            self::Saved => 'Saved',
            self::Applied => 'Applied',
            self::Interviewing => 'Interviewing',
            self::Offered => 'Offered',
            self::Rejected => 'Rejected',
            self::Withdrawn => 'Withdrawn',
        };
    }
}
