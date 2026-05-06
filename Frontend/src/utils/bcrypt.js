import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/* =============================
   🔐 HASH PASSWORD
============================= */
export const hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("Invalid password");
  }

  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error("Hashing error:", error.message);
    throw new Error("Failed to hash password");
  }
};

/* =============================
   🔐 COMPARE PASSWORD
============================= */
export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;

  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Compare error:", error.message);
    return false;
  }
};
