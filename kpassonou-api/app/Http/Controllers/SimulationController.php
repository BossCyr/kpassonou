<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class SimulationController extends Controller
{
    private string $fastApiUrl;

    public function __construct()
    {
        $this->fastApiUrl = env('FASTAPI_URL', 'http://localhost:8000');
    }

    public function simulate(): JsonResponse
    {
        $cameras = [
            [
                'camera_id' => 'cam-001',
                'lat' => 6.3654,
                'lng' => 2.4183,
                'address' => 'Quartier Zongo, Cotonou',
            ],
            [
                'camera_id' => 'cam-002',
                'lat' => 6.3754,
                'lng' => 2.3983,
                'address' => 'Quartier Ganhi, Cotonou',
            ],
            [
                'camera_id' => 'cam-003',
                'lat' => 6.3554,
                'lng' => 2.4383,
                'address' => 'Quartier Haie Vive, Cotonou',
            ],
            [
                'camera_id' => 'cam-004',
                'lat' => 6.3854,
                'lng' => 2.3783,
                'address' => 'Quartier Akpakpa, Cotonou',
            ],
            [
                'camera_id' => 'cam-005',
                'lat' => 6.3454,
                'lng' => 2.4483,
                'address' => 'Quartier Fidjrossè, Cotonou',
            ],
        ];

        $camera = $cameras[array_rand($cameras)];

        try {
            $response = Http::timeout(5)->post("{$this->fastApiUrl}/analyze", [
                'camera_id' => $camera['camera_id'],
                'image_url' => "https://storage.example.com/{$camera['camera_id']}/latest.jpg",
                'location' => [
                    'lat' => $camera['lat'],
                    'lng' => $camera['lng'],
                    'address' => $camera['address'],
                ],
            ]);

            if ($response->successful()) {
                $detection = $response->json();

                $alert = \App\Models\Alert::create([
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'camera_id' => $detection['camera_id'],
                    'source_type' => 'camera',
                    'lat' => $detection['location']['lat'],
                    'lng' => $detection['location']['lng'],
                    'water_level' => $detection['water_level'],
                    'status' => $detection['status'],
                    'timestamp' => $detection['timestamp'],
                    'address' => $detection['location']['address'],
                    'confidence' => $detection['confidence'],
                    'image_url' => $detection['image_url'] ?? null,
                    'data_precision' => 'qualitative',
                ]);

                return response()->json([
                    'success' => true,
                    'alert' => $alert,
                    'message' => "Alerte créée pour {$camera['camera_id']}",
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur depuis FastAPI',
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'FastAPI non disponible: ' . $e->getMessage(),
            ], 503);
        }
    }

    public function simulateMultiple(Request $request): JsonResponse
    {
        $count = min($request->input('count', 5), 20);
        $results = [];

        for ($i = 0; $i < $count; $i++) {
            $results[] = $this->simulateSingle();
        }

        return response()->json([
            'success' => true,
            'count' => count(array_filter($results, fn($r) => $r['success'])),
            'results' => $results,
        ]);
    }

    public function simulateTotem(): JsonResponse
    {
        $totems = [
            [
                'camera_id' => 'totem-001',
                'lat' => 6.3690,
                'lng' => 2.4100,
                'address' => 'Carrefour Zongo, Cotonou',
            ],
            [
                'camera_id' => 'totem-002',
                'lat' => 6.3780,
                'lng' => 2.3950,
                'address' => 'Carrefour Ganhi, Cotonou',
            ],
            [
                'camera_id' => 'totem-003',
                'lat' => 6.3580,
                'lng' => 2.4350,
                'address' => 'Carrefour Haie Vive, Cotonou',
            ],
        ];

        $totem = $totems[array_rand($totems)];

        $waterLevel = round(mt_rand(10, 95) / 100, 2);

        if ($waterLevel < 0.3) {
            $status = 'safe';
            $ledColor = 'green';
        } elseif ($waterLevel < 0.6) {
            $status = 'warning';
            $ledColor = 'orange';
        } else {
            $status = 'alert';
            $ledColor = 'red';
        }

        $alert = \App\Models\Alert::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'camera_id' => $totem['camera_id'],
            'source_type' => 'totem',
            'lat' => $totem['lat'],
            'lng' => $totem['lng'],
            'water_level' => $waterLevel,
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
            'address' => $totem['address'],
            'confidence' => round(mt_rand(95, 99) / 100, 2),
            'data_precision' => 'quantitative',
            'metrics' => [
                'water_depth_cm' => round($waterLevel * 100, 1),
                'flow_speed_ms' => round(mt_rand(10, 30) / 10, 1),
                'rainfall_mm_h' => round(mt_rand(0, 250) / 10, 1),
                'temperature_c' => round(mt_rand(250, 320) / 10, 1),
            ],
            'totem_state' => [
                'led_color' => $ledColor,
                'battery_percent' => mt_rand(70, 100),
                'signal_strength' => mt_rand(60, 100),
            ],
        ]);

        return response()->json([
            'success' => true,
            'alert' => $alert,
            'message' => "Totem {$totem['camera_id']} → LED {$ledColor} | Eau {$status}",
        ]);
    }

    private function simulateSingle(): array
    {
        $cameras = [
            ['camera_id' => 'cam-001', 'lat' => 6.3654, 'lng' => 2.4183, 'address' => 'Quartier Zongo, Cotonou'],
            ['camera_id' => 'cam-002', 'lat' => 6.3754, 'lng' => 2.3983, 'address' => 'Quartier Ganhi, Cotonou'],
            ['camera_id' => 'cam-003', 'lat' => 6.3554, 'lng' => 2.4383, 'address' => 'Quartier Haie Vive, Cotonou'],
            ['camera_id' => 'cam-004', 'lat' => 6.3854, 'lng' => 2.3783, 'address' => 'Quartier Akpakpa, Cotonou'],
            ['camera_id' => 'cam-005', 'lat' => 6.3454, 'lng' => 2.4483, 'address' => 'Quartier Fidjrossè, Cotonou'],
        ];

        $camera = $cameras[array_rand($cameras)];

        try {
            $response = Http::timeout(5)->post("{$this->fastApiUrl}/analyze", [
                'camera_id' => $camera['camera_id'],
                'image_url' => "https://storage.example.com/{$camera['camera_id']}/latest.jpg",
                'location' => [
                    'lat' => $camera['lat'],
                    'lng' => $camera['lng'],
                    'address' => $camera['address'],
                ],
            ]);

            if ($response->successful()) {
                $detection = $response->json();

                \App\Models\Alert::create([
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'camera_id' => $detection['camera_id'],
                    'source_type' => 'camera',
                    'lat' => $detection['location']['lat'],
                    'lng' => $detection['location']['lng'],
                    'water_level' => $detection['water_level'],
                    'status' => $detection['status'],
                    'timestamp' => $detection['timestamp'],
                    'address' => $detection['location']['address'],
                    'confidence' => $detection['confidence'],
                    'image_url' => $detection['image_url'] ?? null,
                    'data_precision' => 'qualitative',
                ]);

                return ['success' => true, 'camera_id' => $camera['camera_id']];
            }

            return ['success' => false, 'camera_id' => $camera['camera_id'], 'error' => 'FastAPI error'];

        } catch (\Exception $e) {
            return ['success' => false, 'camera_id' => $camera['camera_id'], 'error' => $e->getMessage()];
        }
    }
}
