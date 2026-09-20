<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\SimulationController;
use Illuminate\Support\Facades\Route;

Route::get('/alerts', [AlertController::class, 'index']);
Route::post('/alerts', [AlertController::class, 'store']);
Route::get('/stats', [AlertController::class, 'stats']);

Route::post('/simulate', [SimulationController::class, 'simulate']);
Route::post('/simulate/multiple', [SimulationController::class, 'simulateMultiple']);
Route::post('/simulate/totem', [SimulationController::class, 'simulateTotem']);
