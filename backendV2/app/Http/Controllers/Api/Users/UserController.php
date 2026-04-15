<?php

namespace App\Http\Controllers\Api\Users;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class UserController extends Controller

{
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    }
    // // Hanya admin yang bisa akses
    // public function __construct()
    // {
    //     $this->middleware(['auth:sanctum', 'role:admin']);
    // }

    /**
     * Tampilkan semua user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $users = User::with('profile', 'profileImg')->get()->map(function ($user) {
            $user->is_complete = $user->profile ? true : false;
            return $user;
        });
        return response()->json(['data' => $users]);
    }

    /**
     * Simpan user baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['data' => $user], 201);
    }

    /**
     * Tampilkan user spesifik
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['data' => $user]);
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:admin,customer,staff', // 🔥 TAMBAH INI
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['role'])) {
            $user->role = $validated['role'];
        }

        if (!empty($validated['password'])) { // 🔥 FIX
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json(['data' => $user]);
    }
    /**
     * Hapus user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
