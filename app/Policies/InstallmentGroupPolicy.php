<?php

namespace App\Policies;

use App\Models\InstallmentGroup;
use App\Models\User;

class InstallmentGroupPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, InstallmentGroup $installmentGroup): bool
    {
        return $installmentGroup->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, InstallmentGroup $installmentGroup): bool
    {
        return $installmentGroup->user_id === $user->id;
    }

    public function delete(User $user, InstallmentGroup $installmentGroup): bool
    {
        return $installmentGroup->user_id === $user->id;
    }
}
