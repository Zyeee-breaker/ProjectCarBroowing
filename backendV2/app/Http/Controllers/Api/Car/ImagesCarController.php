<?php

namespace App\Http\Controllers\Api\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImagesCarRequest;
use App\Http\Resources\ImagesCarResource;
use App\Services\ImagesCarService;

class ImagesCarController extends Controller
{
    protected ImagesCarService $service;

    public function __construct(ImagesCarService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return ImagesCarResource::collection($this->service->all());
    }

    public function store(ImagesCarRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('path')) {

            $file = $request->file('path');

            // simpan ke storage
            $storedPath = $file->store('cars', 'public');

            // override path
            $data['path'] = $storedPath;
        }

        $image = $this->service->create($data);

        return new ImagesCarResource($image);
    }

    public function show($id)
    {
        return new ImagesCarResource($this->service->find($id));
    }

    public function update(ImagesCarRequest $request, $id)
    {
        $data = $request->validated();

        if ($request->hasFile('path')) {
            $file = $request->file('path');
            $storedPath = $file->store('cars', 'public');

            $data['path'] = $storedPath;
        }

        $image = $this->service->update($id, $data);

        return new ImagesCarResource($image);
    }

    public function destroy($id)
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Image deleted successfully.'
        ]);
    }
}
