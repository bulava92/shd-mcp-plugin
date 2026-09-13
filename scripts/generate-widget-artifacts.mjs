import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import {
	existsSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const widgetsRoot = join(repositoryRoot, 'plugins', 'shd-mcp-plugin', 'widgets');
const templatePath = join(widgetsRoot, '_shared', 'universal-widget.html');
const configPath = join(widgetsRoot, '_shared', 'universal-widget-config.json');
const bootstrapPath = join(widgetsRoot, 'airbase-preview', 'v1', 'index.html');
const moduleToken = '__SHD_WIDGET_MODULE__';
const configToken = '__SHD_WIDGET_CONFIG__';
const engineName = 'shd-universal-v1';
const checkOnly = process.argv.includes('--check');
const extractConfigOnly = process.argv.includes('--extract-config');
const migrateTemplate = process.argv.includes('--migrate-template');
const excludedWidgets = new Set(['active-projects', 'controller-observability']);
const runtimeModuleByArtifact = new Map([
	['pdf-scheme-editor-progress', 'schemes-progress'],
]);

function fail(message) {
	throw new Error(`[widget-artifacts] ${message}`);
}

function ensureCanonicalTemplate() {
	if (existsSync(templatePath)) return;
	if (checkOnly) fail(`canonical template is missing: ${templatePath}`);
	if (!existsSync(bootstrapPath)) fail(`bootstrap widget is missing: ${bootstrapPath}`);

	const source = readFileSync(bootstrapPath, 'utf8');
	const template = source
		.replace(
			'data-widget-module="airbase-preview"',
			`data-shd-widget-engine="${engineName}" data-widget-module="${moduleToken}"`,
		)
		.replace(
			"var DEFAULT_MODULE='airbase-preview'",
			`var DEFAULT_MODULE='${moduleToken}'`,
		);
	if (template === source || !template.includes(moduleToken)) {
		fail('could not bootstrap the universal template from airbase-preview');
	}
	writeFileSync(templatePath, template);
}

function isRecord(value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

function extractWidgetConfig(template) {
	const start = template.indexOf('      var M=');
	const end = template.indexOf('      var pending=', start);
	if (start < 0 || end < 0 || end <= start) {
		fail('could not locate the legacy M/S configuration block in the canonical template');
	}

	const block = template.slice(start, end);
	let extracted;
	try {
		extracted = runInNewContext(`(() => { ${block}; return { copy: M, defaults: S }; })()`);
	} catch (error) {
		fail(`could not evaluate the legacy M/S configuration block: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (!isRecord(extracted) || !isRecord(extracted.copy) || !isRecord(extracted.defaults)) {
		fail('legacy M/S configuration block did not produce copy/defaults objects');
	}
	return extracted;
}

function readWidgetConfig() {
	if (!existsSync(configPath)) return null;
	let config;
	try {
		config = JSON.parse(readFileSync(configPath, 'utf8'));
	} catch (error) {
		fail(`widget config is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (!isRecord(config)) fail('widget config must be a JSON object');
	if (config.engine !== engineName) fail(`widget config engine must be ${engineName}`);
	if (!isRecord(config.copy) || !isRecord(config.defaults)) {
		fail('widget config must contain copy and defaults objects');
	}
	return config;
}

function ensureWidgetConfig(template) {
	const existing = readWidgetConfig();
	if (existing) return existing;
	if (checkOnly) fail(`widget config is missing: ${configPath}`);

	const extracted = extractWidgetConfig(template);
	const config = {
		version: 1,
		engine: engineName,
		copy: extracted.copy,
		defaults: extracted.defaults,
	};
	writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
	return config;
}

function migrateCanonicalTemplate(template) {
	if (template.includes(configToken)) return template;
	if (!migrateTemplate) {
		fail(`canonical template must contain ${configToken}; run with --migrate-template once`);
	}

	const start = template.indexOf('      var M=');
	const end = template.indexOf('      var pending=', start);
	if (start < 0 || end < 0 || end <= start) {
		fail('could not locate the legacy M/S configuration block for migration');
	}
	const replacement = [
		'      var MODULE_CONFIG=__SHD_WIDGET_CONFIG__;',
		'      var M=MODULE_CONFIG.copy;',
		'      var S=MODULE_CONFIG.defaults;',
	].join('\n') + '\n';
	const migrated = `${template.slice(0, start)}${replacement}${template.slice(end)}`;
	writeFileSync(templatePath, migrated);
	return migrated;
}

function readUniversalWidgets() {
	return readdirSync(widgetsRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && !excludedWidgets.has(entry.name) && entry.name !== '_shared')
		.map((entry) => entry.name)
		.filter((name) => existsSync(join(widgetsRoot, name, 'v1', 'index.html')))
		.sort();
}

function expectedArtifact(path, content) {
	if (checkOnly) {
		const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
		if (current !== content) fail(`generated file is stale: ${path}`);
		return;
	}
	if (!existsSync(path) || readFileSync(path, 'utf8') !== content) writeFileSync(path, content);
}

function renderHtml(template, module, config) {
	const serializedConfig = JSON.stringify({ copy: config.copy, defaults: config.defaults })
		.replaceAll('<', '\\u003c');
	const html = template
		.replaceAll(moduleToken, module)
		.replaceAll(configToken, serializedConfig);
	if (html.includes(moduleToken)) fail(`unresolved module token for ${module}`);
	if (html.includes(configToken)) fail(`unresolved config token for ${module}`);
	if (!html.includes(`data-shd-widget-engine="${engineName}"`)) fail(`engine marker is missing for ${module}`);
	if (!html.includes(`data-widget-module="${module}"`)) fail(`module marker is missing for ${module}`);
	if (!html.includes(`var DEFAULT_MODULE='${module}'`)) fail(`default module is missing for ${module}`);
	return html;
}

function manifestFor(widgetPath, html, module) {
	const manifestPath = join(widgetPath, 'manifest.json');
	if (!existsSync(manifestPath)) fail(`manifest is missing: ${manifestPath}`);
	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	const resource = Array.isArray(manifest.resources)
		? manifest.resources.find((item) => item?.file === 'index.html')
		: null;
	if (!resource) fail(`index.html resource is missing from ${manifestPath}`);

	const bytes = Buffer.byteLength(html, 'utf8');
	const digest = createHash('sha256').update(html, 'utf8').digest('hex');
	resource.bytes = bytes;
	resource.gzipBytes = gzipSync(Buffer.from(html, 'utf8'), { mtime: 0 }).length;
	resource.sha256 = digest;
	manifest.source = {
		...(manifest.source || {}),
		path: 'plugins/shd-mcp-plugin/widgets/_shared/universal-widget.html',
		config: 'plugins/shd-mcp-plugin/widgets/_shared/universal-widget-config.json',
		generatedBy: 'scripts/generate-widget-artifacts.mjs',
		engine: engineName,
	};
	if (manifest.source.module && manifest.source.module !== module) delete manifest.source.module;
	return { manifest, resource, digest };
}

function upstreamFor(widgetPath, resource) {
	const upstreamPath = join(widgetPath, 'UPSTREAM.md');
	const existing = existsSync(upstreamPath) ? readFileSync(upstreamPath, 'utf8') : '';
	const heading = existing.match(/^# .+$/m)?.[0] || '# SHD widget';
	const code = String.fromCharCode(96);
	return `${heading}\n\nThis artifact is served by the SHD MCP backend as ${resource.uri}.\n\nThe standalone HTML is generated from ${code}widgets/_shared/universal-widget.html${code} and ${code}widgets/_shared/universal-widget-config.json${code} by ${code}scripts/generate-widget-artifacts.mjs${code} using the ${code}${engineName}${code} engine. It uses the MCP Apps bridge first and keeps ${code}window.openai${code} as a compatibility extension; it has no external script or network dependency. The module supplies its data and view configuration through the render-tool metadata.\n`;
}

function main() {
	ensureCanonicalTemplate();
	let template = readFileSync(templatePath, 'utf8');
	const configExisted = existsSync(configPath);
	const config = ensureWidgetConfig(template);
	if (extractConfigOnly) {
		console.log(`${configExisted ? 'checked' : 'extracted'} widget config: ${configPath}`);
		return;
	}
	template = migrateCanonicalTemplate(template);
	if (!template.includes(moduleToken)) fail(`canonical template must contain ${moduleToken}`);
	if (!template.includes(configToken)) fail(`canonical template must contain ${configToken}`);

	const widgets = readUniversalWidgets();
	if (widgets.length === 0) fail('no universal widget artifacts found');
	let generated = 0;
	for (const artifactName of widgets) {
		const module = runtimeModuleByArtifact.get(artifactName) || artifactName;
		const widgetPath = join(widgetsRoot, artifactName, 'v1');
		const html = renderHtml(template, module, config);
		const { manifest, resource, digest } = manifestFor(widgetPath, html, module);
		const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
		expectedArtifact(join(widgetPath, 'index.html'), html);
		expectedArtifact(join(widgetPath, 'manifest.json'), manifestText);
		expectedArtifact(join(widgetPath, 'SHA256SUMS'), `${digest}  index.html\n`);
		expectedArtifact(join(widgetPath, 'UPSTREAM.md'), upstreamFor(widgetPath, resource));
		generated += 1;
	}

	console.log(`${checkOnly ? 'checked' : 'generated'} ${generated} universal widget artifacts; engine=${engineName}`);
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
