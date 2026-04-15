<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Users\AuthController;
use App\Http\Controllers\Api\Users\ProfileController;
use App\Http\Controllers\Api\Users\UserController;
use App\Http\Controllers\Api\Users\ImageUsersController;
use App\Http\Controllers\Api\Booking\BookingController;
use App\Http\Controllers\Api\Booking\BookingLogController;
use App\Http\Controllers\Api\Booking\PaymentController;
use App\Http\Controllers\Api\Car\CarCategoryController;
use App\Http\Controllers\Api\Car\CarController;
use App\Http\Controllers\Api\Car\CarUnitController;
use App\Http\Controllers\Api\Car\FeatureController;
use App\Http\Controllers\Api\Car\ImagesCarController;
use App\Http\Controllers\Api\Category\MainCategoryController;
use App\Http\Controllers\Api\Category\ChildCategoryController;
use Illuminate\Http\Request;

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::post('/users/{id}/profile', function ($id, Request $request) {
        $data = $request->all();

        $profile = \App\Models\UserProfile::updateOrCreate(
            ['user_id' => $id],
            $data
        );

        // AUTO STATUS
        $profile->status = 'complete';
        $profile->save();

        return response()->json(['data' => $profile]);
    });

    /*
    |--------------------------------------------------------------------------
    | PROFILE (USER / STAFF / CUSTOMER)
    |--------------------------------------------------------------------------
    */
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'index']);
        Route::post('/', [ProfileController::class, 'store']);
        Route::get('{id}', [ProfileController::class, 'show']);
        Route::put('{id}', [ProfileController::class, 'update']);
        Route::delete('{id}', [ProfileController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | USERS (ADMIN MANAGEMENT)
    |--------------------------------------------------------------------------
    */
    Route::prefix('users')->middleware('auth:sanctum')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('{id}', [UserController::class, 'show']);
        Route::put('{id}', [UserController::class, 'update']);
        Route::delete('{id}', [UserController::class, 'destroy']);
    });
    Route::prefix('usersstaff')->middleware('auth:sanctum')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('{id}', [UserController::class, 'show']);
        Route::put('{id}', [UserController::class, 'update']);
        Route::delete('{id}', [UserController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | USER IMAGES
    |--------------------------------------------------------------------------
    */
    Route::prefix('images')->group(function () {
        Route::get('/', [ImageUsersController::class, 'index']);
        Route::post('/', [ImageUsersController::class, 'store']);
        Route::get('{id}', [ImageUsersController::class, 'show']);
        Route::put('{id}', [ImageUsersController::class, 'update']);
        Route::delete('{id}', [ImageUsersController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | BOOKINGS (USER SIDE)
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('bookings')->group(function () {
            Route::get('/my-bookings', [BookingController::class, 'myBooking']);
            Route::get('/', [BookingController::class, 'index']);
            Route::post('/', [BookingController::class, 'store']);
            Route::get('{id}', [BookingController::class, 'show']);
            Route::put('{id}', [BookingController::class, 'update']);
            Route::delete('{id}', [BookingController::class, 'destroy']);
        });
        Route::prefix('bookingslog')->group(function () {
            Route::get('/', [BookingLogController::class, 'index']);
            Route::post('/print', [BookingLogController::class, 'print']);
        });
        Route::prefix('payment')->group(function () {
            Route::post('/{bookingId}', [PaymentController::class, 'pay']);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | PAYMENTS
    |--------------------------------------------------------------------------
    */
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/{bookingId}/pay', [PaymentController::class, 'pay']);
    });

    /*
    |--------------------------------------------------------------------------
    | CARS (PUBLIC / USER)
    |--------------------------------------------------------------------------
    */
    Route::prefix('cars')->group(function () {
        Route::get('/', [CarController::class, 'index']);
        Route::post('/', [CarController::class, 'store']);
        Route::get('{id}', [CarController::class, 'show']);
        Route::put('{id}', [CarController::class, 'update']);
        Route::delete('{id}', [CarController::class, 'destroy']);
    });

    Route::prefix('cars-category')->group(function () {
        Route::get('/', [CarCategoryController::class, 'index']);
        Route::post('/', [CarCategoryController::class, 'store']);
        Route::get('{id}', [CarCategoryController::class, 'show']);
        Route::put('{id}', [CarCategoryController::class, 'update']);
        Route::delete('{id}', [CarCategoryController::class, 'destroy']);
    });

    Route::prefix('cars-unit')->group(function () {
        Route::get('/', [CarUnitController::class, 'index']);
        Route::post('/', [CarUnitController::class, 'store']);
        Route::get('{id}', [CarUnitController::class, 'show']);
        Route::put('{id}', [CarUnitController::class, 'update']);
        Route::delete('{id}', [CarUnitController::class, 'destroy']);
    });

    Route::prefix('cars-feature')->group(function () {
        Route::get('/', [FeatureController::class, 'index']);
        Route::post('/', [FeatureController::class, 'store']);
        Route::get('{id}', [FeatureController::class, 'show']);
        Route::put('{id}', [FeatureController::class, 'update']);
        Route::delete('{id}', [FeatureController::class, 'destroy']);
    });

    Route::prefix('cars-image')->group(function () {
        Route::get('/', [ImagesCarController::class, 'index']);
        Route::post('/', [ImagesCarController::class, 'store']);
        Route::get('{id}', [ImagesCarController::class, 'show']);
        Route::put('{id}', [ImagesCarController::class, 'update']);
        Route::delete('{id}', [ImagesCarController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | MAIN CATEGORY
    |--------------------------------------------------------------------------
    */
    Route::prefix('main-categories')->group(function () {
        Route::get('/', [MainCategoryController::class, 'index']);
        Route::post('/', [MainCategoryController::class, 'store']);
        Route::get('{id}', [MainCategoryController::class, 'show']);
        Route::put('{id}', [MainCategoryController::class, 'update']);
        Route::delete('{id}', [MainCategoryController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | CHILD CATEGORY
    |--------------------------------------------------------------------------
    */
    Route::prefix('child-categories')->group(function () {
        Route::get('/', [ChildCategoryController::class, 'index']);
        Route::post('/', [ChildCategoryController::class, 'store']);
        Route::get('{id}', [ChildCategoryController::class, 'show']);
        Route::put('{id}', [ChildCategoryController::class, 'update']);
        Route::delete('{id}', [ChildCategoryController::class, 'destroy']);
    });
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/staff/report/bookings', [BookingController::class, 'staffReport']);
    });
    Route::get('/report/bookings/pdf', [BookingController::class, 'exportPdf']);
});
