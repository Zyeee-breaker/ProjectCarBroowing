<?php

namespace App\Http\Controllers\Api\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\FeatureRequest;
use App\Http\Resources\FeatureResource;
use App\Services\FeatureService;

class FeatureController extends Controller
{
    protected FeatureService $service;

    public function __construct(FeatureService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return FeatureResource::collection($this->service->all());
    }

    public function store(FeatureRequest $request)
    {
        return new FeatureResource($this->service->create($request->validated()));
    }

    public function show($id)
    {
        return new FeatureResource($this->service->find($id));
    }

    public function update(FeatureRequest $request, $id)
    {
        return new FeatureResource($this->service->update($id, $request->validated()));
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Feature deleted successfully.']);
    }
}