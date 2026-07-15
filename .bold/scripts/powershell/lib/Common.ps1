# Shared helpers for bold's PowerShell collector scripts.

# Collector stdout is JSON consumed by prompts. Force UTF-8 (no BOM) so
# non-ASCII content (em-dashes, section marks in spec metadata) survives
# redirection on Windows, whose OEM codepage otherwise mangles it into
# bare control bytes — observed for real during feature 0007 verification
# (U+00A7 "§" emitted as 0x15 via CP437, producing invalid JSON).
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

# Filesystem-safe slug identifying the current contributor for
# .bold-user/{slug}/ (bold-tool-plan.md §17 #4 — committed, per-user
# tier). Falls back from git user.name to the email's local part, then
# to "shared" if neither is configured. -Root (optional) scopes the git
# config lookup to a specific repo instead of the caller's cwd -- required,
# not cosmetic: a script invoked with -Root pointing elsewhere must not
# silently read the invoking shell's own git identity instead.
function Get-BoldUserSlug {
  param([string]$Root)
  if ($Root) {
    $name = git -C $Root config user.name 2>$null
  } else {
    $name = git config user.name 2>$null
  }
  if (-not $name) {
    if ($Root) {
      $email = git -C $Root config user.email 2>$null
    } else {
      $email = git config user.email 2>$null
    }
    if ($email) { $name = $email.Split('@')[0] }
  }
  if (-not $name) { $name = 'shared' }
  $slug = ($name.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
  if (-not $slug) { $slug = 'shared' }
  return $slug
}

# Appends one JSONL invocation line to bold-docs/run-log.jsonl — Bold's
# minimal run observability (bold-tool-plan.md §16, Industry-Alignment
# item 2). Invocation facts only: a collector runs before the work and
# cannot know outcomes. No-op when the repo has no bold-docs/ workspace,
# or when BOLD_NO_RUN_LOG=1 (fixture tests, parity checks). Uses
# File.AppendAllText (not Add-Content) so the line ending is \n, matching
# the bash helper byte for byte.
function Add-BoldRunLog {
  param([string]$RepoRoot, [string]$Command, [string]$Collector)
  if ($env:BOLD_NO_RUN_LOG -eq '1') { return }
  $docsDir = Join-Path $RepoRoot 'bold-docs'
  if (-not (Test-Path $docsDir)) { return }
  $line = [ordered]@{
    ts        = [DateTime]::UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'")
    command   = $Command
    collector = $Collector
    user      = Get-BoldUserSlug -Root $RepoRoot
  } | ConvertTo-Json -Compress
  [System.IO.File]::AppendAllText((Join-Path $docsDir 'run-log.jsonl'), "$line`n")
}

# Emits an array of {principle,reason,ratified_by,date}, one per
# `- Waiver: ...` line in the given spec file. See
# source/commands/WAIVERS.md for the line format.
function Get-WaiversForSpec {
  param([string]$SpecPath)
  $waivers = @()
  if (Test-Path $SpecPath) {
    Get-Content $SpecPath | Select-String '^- Waiver: (.+)$' | ForEach-Object {
      $line = $_.Matches.Groups[1].Value
      $principleMatch = [regex]::Match($line, 'principle=(\d+)')
      $reasonMatch = [regex]::Match($line, 'reason="([^"]*)"')
      $ratifiedByMatch = [regex]::Match($line, 'ratified_by="([^"]*)"')
      $dateMatch = [regex]::Match($line, 'date=([\d-]+)')
      $waivers += [ordered]@{
        principle   = if ($principleMatch.Success) { [int]$principleMatch.Groups[1].Value } else { $null }
        reason      = $reasonMatch.Groups[1].Value
        ratified_by = $ratifiedByMatch.Groups[1].Value
        date        = $dateMatch.Groups[1].Value
      }
    }
  }
  return ,$waivers
}

function Get-ActiveFeatures {
  param([string]$DocsDir)
  $features = @()
  $featuresDir = Join-Path $DocsDir 'features'
  if (Test-Path $featuresDir) {
    Get-ChildItem -Path $featuresDir -Directory | ForEach-Object {
      $specPath = Join-Path $_.FullName 'spec.md'
      if (Test-Path $specPath) {
        $content = Get-Content $specPath
        $status = ($content | Select-String '^\*\*Status\*\*: (.+)$' | Select-Object -First 1).Matches.Groups[1].Value
        $tier   = ($content | Select-String '^\*\*Tier\*\*: (.+)$' | Select-Object -First 1).Matches.Groups[1].Value
        $features += [ordered]@{
          id      = $_.Name
          status  = if ($status) { $status } else { 'unknown' }
          tier    = if ($tier) { $tier } else { 'unknown' }
          waivers = Get-WaiversForSpec -SpecPath $specPath
        }
      }
    }
  }
  return ,$features
}

function Get-SystemDocs {
  param([string]$RepoRoot, [string]$DocsDir)
  $docs = @()
  $systemDir = Join-Path $DocsDir 'system'
  if (Test-Path $systemDir) {
    $docs = @(Get-ChildItem -Path $systemDir -File -Recurse |
      Where-Object { $_.Name -ne '.gitkeep' } |
      ForEach-Object { $_.FullName.Substring($RepoRoot.Length + 1) -replace '\\', '/' } |
      Sort-Object)
  }
  return ,$docs
}

# Emits an array of {doc,reference}, one per backtick-quoted, path-shaped
# reference in a bold-docs/system/ doc that doesn't resolve to a real file.
# Scoped to system/ only (§13 ambient staleness detection) -- feature specs
# are expected to reference code that doesn't exist yet.
function Get-StaleReferences {
  param([string]$RepoRoot, [string]$DocsDir)
  $stale = @()
  $systemDir = Join-Path $DocsDir 'system'
  if (Test-Path $systemDir) {
    Get-ChildItem -Path $systemDir -File -Recurse | Where-Object { $_.Name -ne '.gitkeep' } | ForEach-Object {
      $relDoc = $_.FullName.Substring($RepoRoot.Length + 1) -replace '\\', '/'
      $refs = [regex]::Matches((Get-Content $_.FullName -Raw), '`([A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)+)`') |
        ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
      foreach ($ref in $refs) {
        if ($ref -match '^https?://' -or $ref -match '\*') { continue }
        $refPath = Join-Path $RepoRoot $ref
        if (-not (Test-Path $refPath)) {
          $stale += [ordered]@{ doc = $relDoc; reference = $ref }
        }
      }
    }
  }
  return ,$stale
}

function Get-BackbonePrinciples {
  param([string]$DocsDir)
  $principles = @()
  $backboneFile = Join-Path $DocsDir 'backbone.md'
  if (Test-Path $backboneFile) {
    $n = 0
    Get-Content $backboneFile | Select-String '^\s*\*\*Status\*\*: (.+)$' | ForEach-Object {
      $n++
      $principles += [ordered]@{ n = $n; status = $_.Matches.Groups[1].Value }
    }
  }
  return ,$principles
}
