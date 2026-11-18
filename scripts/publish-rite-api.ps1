<#
.SYNOPSIS
  Publishes src/Rite.Api (API + src/Rite.Web's production build, one deployable unit)
  and zips the result for copying to the VM (ps-008).

.DESCRIPTION
  dotnet publish alone isn't zipped here as an MSBuild AfterTargets hook: web.config
  (which IIS needs to launch the app) is written by a separate internal publish
  sub-pipeline whose completion isn't reliably observable from a project-level
  target. Running Compress-Archive only after the `dotnet publish` process has
  fully exited sidesteps that entirely.

.EXAMPLE
  ./scripts/publish-rite-api.ps1
#>
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$apiProject = Join-Path $repoRoot "src\Rite.Api\Rite.Api.csproj"
$publishDir = Join-Path $repoRoot "src\Rite.Api\bin\Release\net10.0\win-x64\publish"
$zipPath = Join-Path $repoRoot "src\Rite.Api\bin\Release\net10.0\win-x64\rite-api-publish.zip"

dotnet publish $apiProject --configuration Release
if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish failed with exit code $LASTEXITCODE"
}

if (-not (Test-Path (Join-Path $publishDir "web.config"))) {
    throw "web.config is missing from the publish output ($publishDir) — IIS would not be able to launch this app. Did the publish step change?"
}

Compress-Archive -Path (Join-Path $publishDir "*") -DestinationPath $zipPath -Force
Write-Host "Deployment zip ready: $zipPath"
