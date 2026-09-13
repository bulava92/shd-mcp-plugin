# Задачи widget

This artifact is served by the SHD MCP backend as ui://shd/tasks/v1.html.

The standalone HTML is generated from `widgets/_shared/universal-widget.html` and `widgets/_shared/universal-widget-config.json` by `scripts/generate-widget-artifacts.mjs` using the `shd-universal-v1` engine. It uses the MCP Apps bridge first and keeps `window.openai` as a compatibility extension; it has no external script or network dependency. The module supplies its data and view configuration through the render-tool metadata.
