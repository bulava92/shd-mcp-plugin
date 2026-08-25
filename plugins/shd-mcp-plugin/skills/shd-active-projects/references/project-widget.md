# Project widget contract

Call the data tool first. Pass only the returned project array and metadata to
the render tool. The widget is a presentation layer: it must not invent dates,
statuses or project rows. When the render succeeds, keep the rows in the
widget and do not repeat them in the assistant response. Keep the plain
structured table only as the fallback for hosts without MCP Apps UI or when
the render tool fails.
