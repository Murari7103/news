const crypto = require("crypto");

const generateResetToken = () => {
  // Token sent to user
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Token stored in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return {
    resetToken,
    hashedToken,
  };
};

module.exports = generateResetToken;
