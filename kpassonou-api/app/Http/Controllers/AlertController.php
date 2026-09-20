<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Alert::orderBy('timestamp', 'desc');
        
        if ($request->has('source_type')) {
            $query->where('source_type', $request->source_type);
        }
        
        $alerts = $query->get();
        
        $summary = [
            'total_nodes' => Alert::distinct('camera_id')->count(),
            'total_totems' => Alert::where('source_type', 'totem')->distinct('camera_id')->count(),
            'total_cameras' => Alert::where('source_type', 'camera')->distinct('camera_id')->count(),
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
            'source_type' => 'required|in:camera,totem',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'water_level' => 'required|numeric|min:0|max:1',
            'status' => 'required|in:safe,warning,alert',
            'timestamp' => 'required|date',
            'address' => 'required|string',
            'confidence' => 'nullable|numeric|min:0|max:1',
            'image_url' => 'nullable|string',
            'data_precision' => 'nullable|in:qualitative,quantitative',
            'metrics' => 'nullable|array',
            'metrics.water_depth_cm' => 'nullable|numeric',
            'metrics.flow_speed_ms' => 'nullable|numeric',
            'metrics.rainfall_mm_h' => 'nullable|numeric',
            'metrics.temperature_c' => 'nullable|numeric',
            'totem_state' => 'nullable|array',
            'totem_state.led_color' => 'nullable|in:green,orange,red',
            'totem_state.battery_percent' => 'nullable|numeric|min:0|max:100',
            'totem_state.signal_strength' => 'nullable|numeric|min:0|max:100',
        ]);

        $validated['data_precision'] = $validated['data_precision'] ?? ($validated['source_type'] === 'totem' ? 'quantitative' : 'qualitative');

        $alert = Alert::create($validated);

        return response()->json($alert, 201);
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total_nodes' => Alert::distinct('camera_id')->count(),
            'total_totems' => Alert::where('source_type', 'totem')->distinct('camera_id')->count(),
            'total_cameras' => Alert::where('source_type', 'camera')->distinct('camera_id')->count(),
            'active_alerts' => Alert::where('status', 'alert')->count(),
            'warning_alerts' => Alert::where('status', 'warning')->count(),
            'safe_nodes' => Alert::where('status', 'safe')->count(),
            'last_update' => now()->toIso8601String(),
        ];

        return response()->json($stats);
    }
}
