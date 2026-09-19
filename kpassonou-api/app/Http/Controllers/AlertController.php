<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AlertController extends Controller
{
    public function index(): JsonResponse
    {
        $alerts = Alert::orderBy('timestamp', 'desc')->get();
        
        $summary = [
            'total_cameras' => Alert::distinct('camera_id')->count(),
            'active_alerts' => Alert::where('status', 'alert')->count(),
            'last_update' => now()->toIso8601String(),
        ];

        return response()->json([
            'alerts' => $alerts,
            'summary' => $summary,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'camera_id' => 'required|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'water_level' => 'required|numeric|min:0|max:1',
            'status' => 'required|in:safe,warning,alert',
            'timestamp' => 'required|date',
            'address' => 'required|string',
            'confidence' => 'nullable|numeric|min:0|max:1',
            'image_url' => 'nullable|string',
        ]);

        $alert = Alert::create($validated);

        return response()->json($alert, 201);
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total_cameras' => Alert::distinct('camera_id')->count(),
            'active_alerts' => Alert::where('status', 'alert')->count(),
            'warning_alerts' => Alert::where('status', 'warning')->count(),
            'safe_cameras' => Alert::where('status', 'safe')->count(),
            'last_update' => now()->toIso8601String(),
        ];

        return response()->json($stats);
    }
}
