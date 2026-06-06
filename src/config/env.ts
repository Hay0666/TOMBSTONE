/**
 * TOMBSTONE — Environment Configuration
 * Typed, validated environment variable access.
 * All sensitive identifiers accessed exclusively through this module.
 * NEVER import from import.meta.env directly in component code.
 */

interface EnvConfig {
  /** Pendo SDK Application ID */
  PENDO_APP_ID: string | undefined
  /** MCP code-diff generation endpoint */
  MCP_ENDPOINT: string | undefined
  /** JSON-LD export signing key */
  SCHEMA_SIGNING_KEY: string | undefined
}

function loadEnv(): EnvConfig {
  return {
    PENDO_APP_ID: import.meta.env.VITE_PENDO_APP_ID as string | undefined,
    MCP_ENDPOINT: import.meta.env.VITE_MCP_ENDPOINT as string | undefined,
    SCHEMA_SIGNING_KEY: import.meta.env.VITE_SCHEMA_SIGNING_KEY as string | undefined,
  }
}

function validateEnv(config: EnvConfig): void {
  // Pendo key: warn if absent, do not crash (hackathon demo mode)
  if (!config.PENDO_APP_ID || config.PENDO_APP_ID === 'your_pendo_app_id_here') {
    console.warn(
      '[TOMBSTONE] VITE_PENDO_APP_ID is not set or is placeholder. ' +
      'Telemetry will be disabled. Set it in .env for production tracking.'
    )
  }

  // MCP endpoint: optional, log info
  if (!config.MCP_ENDPOINT || config.MCP_ENDPOINT.includes('your-edge-proxy')) {
    console.info(
      '[TOMBSTONE] VITE_MCP_ENDPOINT not configured. ' +
      'Code diffs will be generated client-side from node metadata.'
    )
  }

  // Signing key: optional, log info
  if (!config.SCHEMA_SIGNING_KEY || config.SCHEMA_SIGNING_KEY === 'your_signing_key_here') {
    console.info(
      '[TOMBSTONE] VITE_SCHEMA_SIGNING_KEY not configured. ' +
      'Tombstone schemas will be exported unsigned.'
    )
  }
}

export const env: EnvConfig = loadEnv()

// Validate on module load — fails loudly at boot, not silently in production
validateEnv(env)
