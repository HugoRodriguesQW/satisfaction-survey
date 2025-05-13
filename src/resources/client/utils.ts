
export function hideEmail(email?: string) {
  if (!email) return "";
  const atIndex = email.lastIndexOf("@");
  const dotIndex = email.lastIndexOf(".");

  const split = Math.min(6, Math.floor(atIndex / 2));

  return (
    "*".repeat(atIndex - split) +
    email.substring(atIndex - split, atIndex + 1) +
    "*".repeat(dotIndex - atIndex) +
    email.substring(dotIndex)
  );
}
