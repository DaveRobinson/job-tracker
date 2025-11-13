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
    public function index()
    {
        $positions = Position::orderBy('created_at', 'desc')->get();

        return response()->json($positions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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

        $position = Position::create($validated);

        return response()->json($position, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $position = Position::findOrFail($id);

        return response()->json($position);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $position = Position::findOrFail($id);

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

        return response()->json($position);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $position = Position::findOrFail($id);
        $position->delete();

        return response()->json(null, 204);
    }
}
