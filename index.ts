import bot from "./src/bot";

console.log("🚀 Starting bot...");

bot
  .launch()
  .then(() => {
    console.log("✅ Bot started successfully!");
    console.log("💬 Waiting for messages...");
    console.log("Press Ctrl+C to stop");
  })
  .catch((err) => {
    console.error("❌ Failed to start bot:", err);
    process.exit(1);
  });

// Enable graceful stop
process.once("SIGINT", () => {
  console.log("\n🛑 Stopping bot...");
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  console.log("\n🛑 Stopping bot...");
  bot.stop("SIGTERM");
});
