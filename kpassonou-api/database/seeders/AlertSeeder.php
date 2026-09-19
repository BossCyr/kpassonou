<?php

namespace Database\Seeders;

use App\Models\Alert;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AlertSeeder extends Seeder
{
    public function run(): void
    {
        // Quartiers réels de Cotonou avec coordonnées GPS
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
            [
                'camera_id' => 'cam-006',
                'lat' => 6.3954,
                'lng' => 2.3683,
                'address' => 'Quartier Akpakpa Bénin, Cotonou',
            ],
            [
                'camera_id' => 'cam-007',
                'lat' => 6.3354,
                'lng' => 2.4583,
                'address' => 'Quartier Vodjè, Cotonou',
            ],
        ];

        foreach ($cameras as $camera) {
            // Simuler des niveaux d'eau réalistes (plus d'alertes en saison des pluies)
            $waterLevel = round(mt_rand(5, 98) / 100, 2);
            
            if ($waterLevel < 0.3) {
                $status = 'safe';
            } elseif ($waterLevel < 0.6) {
                $status = 'warning';
            } else {
                $status = 'alert';
            }

            Alert::create([
                'id' => Str::uuid()->toString(),
                'camera_id' => $camera['camera_id'],
                'lat' => $camera['lat'],
                'lng' => $camera['lng'],
                'water_level' => $waterLevel,
                'status' => $status,
                'timestamp' => Carbon::now()->subMinutes(mt_rand(1, 120)),
                'address' => $camera['address'],
                'confidence' => round(mt_rand(70, 95) / 100, 2),
                'image_url' => "https://storage.example.com/{$camera['camera_id']}/latest.jpg",
            ]);
        }
    }
}
