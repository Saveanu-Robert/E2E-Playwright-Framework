import { EnvironmentConfigManager } from "@config/environment";
import type { FullConfig } from "@playwright/test";

/**
 * Global Teardown
 *
 * Runs once after all tests across all workers
 * Purpose: Cleanup shared resources, generate reports, perform final cleanup
 *
 * @param config - Playwright full configuration
 */
async function globalTeardown(_config: FullConfig) {
	const startTime = Date.now();
	console.log("🧹 Starting global teardown...");

	try {
		const currentEnv = EnvironmentConfigManager.getCurrentEnvironment();
		const envConfig = EnvironmentConfigManager.getConfig(currentEnv);

		// Environment-specific cleanup
		if (envConfig.features.enableMocking) {
			console.log("🎭 Cleaning up mock services...");
			// Cleanup mock services here
		}

		// Cleanup temporary files
		await cleanupTempFiles();

		// Generate additional reports if needed
		if (envConfig.features.enableDebugLogs) {
			await generateDebugReport();
		}

		const teardownTime = Date.now() - startTime;
		console.log(`✅ Global teardown completed in ${teardownTime}ms`);
		console.log("🎉 All tests completed!");
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("❌ Global teardown failed:", errorMessage);
		// Don't throw to avoid masking test failures
	}
}

/**
 * Cleanup temporary files and directories
 */
async function cleanupTempFiles(): Promise<void> {
	try {
		console.log("🗑️ Cleaning up temporary files...");
		// Add cleanup logic for temporary files
		// Example: fs.rmSync(tempDir, { recursive: true, force: true });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.warn("⚠️ Temp file cleanup warning:", errorMessage);
	}
}

/**
 * Generate debug report with system information
 */
async function generateDebugReport(): Promise<void> {
	try {
		console.log("📊 Generating debug report...");
		const systemInfo = EnvironmentConfigManager.getSystemInfo();
		const debugInfo = {
			timestamp: new Date().toISOString(),
			environment: EnvironmentConfigManager.getCurrentEnvironment(),
			systemInfo,
			nodeVersion: process.version,
			playwrightVersion: require("@playwright/test/package.json").version,
		};

		// Save debug info to file
		const fs = require("node:fs").promises;
		await fs.writeFile(
			"./reports/debug-info.json",
			JSON.stringify(debugInfo, null, 2),
		);
		console.log("📋 Debug report saved to ./reports/debug-info.json");
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.warn("⚠️ Debug report generation warning:", errorMessage);
	}
}

export default globalTeardown;
