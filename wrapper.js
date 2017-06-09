#!/usr/local/bin/node

if (process.env.NEW_RELIC_NO_CONFIG_FILE) {
    require("newrelic");
} else {
    console.log("Newrelic not configured, skipping it...");
}
require("/app/main.js");