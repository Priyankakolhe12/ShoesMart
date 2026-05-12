const config = require("./src/config/config");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");

connectCloudinary();
connectDB();

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
