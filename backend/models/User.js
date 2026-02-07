const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // fragrances favorited by user
  fragrance_favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fragrance",
    },
  ],
  // recommendation engine's generated fragrance profile
  fragrance_profile: { type: String }
});

module.exports = mongoose.model("User", userSchema);
