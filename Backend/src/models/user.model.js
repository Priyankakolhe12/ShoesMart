const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please fill a valid email address",
      ],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
        "Password must contain at least one letter and one number, no special characters allowed",
      ],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    kyc: {
      status: {
        type: String,
        enum: ["not_started", "pending", "approved", "rejected"],
        default: "not_started",
      },
      fullName: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        default: "",
      },
      dob: {
        type: String,
        default: "",
      },
      occupation: {
        type: String,
        default: "",
      },
      address1: {
        type: String,
        default: "",
      },
      address2: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      zip: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      docType: {
        type: String,
        default: "",
      },
      docNumber: {
        type: String,
        default: "",
      },
      documentName: {
        type: String,
        default: "",
      },
      documentPreview: {
        type: String,
        default: "",
      },
      submittedAt: {
        type: Date,
      },
      reviewedAt: {
        type: Date,
      },
      reason: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
