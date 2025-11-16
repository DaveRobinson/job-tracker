<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of users (admin only).
     */
    public function index(Request $request)
    {
        // Authorization check - only admins can list users
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $users = User::select('id', 'name', 'email', 'is_admin')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    /**
     * Display positions for a specific user (admin only).
     */
    public function positions(Request $request, string $id)
    {
        // Authorization check - only admins can view other users' positions
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::findOrFail($id);

        $positions = Position::with('user:id,name')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($positions);
    }
}
