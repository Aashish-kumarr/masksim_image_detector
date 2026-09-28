# Start script for DeepFakeDSP
Write-Host "Starting DeepFakeDSP Project..."

# Start ml-service
Start-Process powershell -ArgumentList "-NoExit -Command `"cd ml-service; .\.venv\Scripts\activate; uvicorn app.main:app --port 8000 --reload`"" -WindowStyle Normal

# Start backend
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; npm run dev`"" -WindowStyle Normal

# Start frontend
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev -- --host 127.0.0.1`"" -WindowStyle Normal

Write-Host "All services started in separate windows."
