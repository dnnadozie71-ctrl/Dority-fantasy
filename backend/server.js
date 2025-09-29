const { app, connectDB } = require("./index");

const PORT = process.env.PORT || 5000;

// Start server only after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
