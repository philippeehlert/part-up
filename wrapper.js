#!/usr/local/bin/node

if (process.env.TRACE_API_KEY) {
    require('@risingstack/trace');
} else {
    console.log("Trace not configured, skipping it...");
}
if (process.env.NEW_RELIC_NO_CONFIG_FILE) {
    require("newrelic");
} else {
    console.log("Newrelic not configured, skipping it...");
}
require("/app/main.js");