<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\PositionStatus;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Position::with('user:id,name');

        // Determine scope based on query parameters (admin only) or user role
        if ($user->is_admin && $request->query('all_users') === 'true') {
            // Admin viewing all positions across all users
            // No filter needed
        } elseif ($user->is_admin && $request->has('user_id')) {
            // Admin viewing a specific user's positions
            $query->where('user_id', $request->query('user_id'));
        } else {
            // Default: show only the authenticated user's positions
            $query->where('user_id', $user->id);
        }

        $positions = $query->orderBy('created_at', 'desc')->get();

        return response()->json($positions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'user_id' => $user->is_admin ? 'nullable|exists:users,id' : 'prohibited',
            'company' => 'nullable|string|max:255',
            'recruiter_company' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['nullable', Rule::enum(PositionStatus::class)],
            'location' => 'nullable|string|max:255',
            'salary' => 'nullable|string|max:255',
            'url' => 'nullable|url|max:255',
            'notes' => 'nullable|string',
            'applied_at' => 'nullable|date',
        ]);

        // Ensure at least one of company or recruiter_company is provided
        if (empty($validated['company']) && empty($validated['recruiter_company'])) {
            return response()->json([
                'message' => 'Either company or recruiter_company must be provided.',
                'errors' => [
                    'company' => ['Either company or recruiter_company is required.'],
                    'recruiter_company' => ['Either company or recruiter_company is required.'],
                ]
            ], 422);
        }

        // Assign user: admin can specify, regular users get their own ID
        if (!isset($validated['user_id'])) {
            $validated['user_id'] = $user->id;
        }

        $position = Position::create($validated);
        $position->load('user:id,name');

        return response()->json($position, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $position = Position::with('user:id,name')->findOrFail($id);

        $this->authorize('view', $position);

        return response()->json($position);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $position = Position::findOrFail($id);

        $this->authorize('update', $position);

        $validated = $request->validate([
            'company' => 'nullable|string|max:255',
            'recruiter_company' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['nullable', Rule::enum(PositionStatus::class)],
            'location' => 'nullable|string|max:255',
            'salary' => 'nullable|string|max:255',
            'url' => 'nullable|url|max:255',
            'notes' => 'nullable|string',
            'applied_at' => 'nullable|date',
        ]);

        // Ensure at least one of company or recruiter_company is provided
        if (empty($validated['company']) && empty($validated['recruiter_company'])) {
            return response()->json([
                'message' => 'Either company or recruiter_company must be provided.',
                'errors' => [
                    'company' => ['Either company or recruiter_company is required.'],
                    'recruiter_company' => ['Either company or recruiter_company is required.'],
                ]
            ], 422);
        }

        $position->update($validated);
        $position->load('user:id,name');

        return response()->json($position);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $position = Position::findOrFail($id);

        $this->authorize('delete', $position);

        $position->delete();

        return response()->json(null, 204);
    }
}
