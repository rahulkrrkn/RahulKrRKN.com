export const emailNormalization = (rawEmail: unknown): string | null => {
  if (typeof rawEmail !== "string") return null;

  let email = rawEmail.trim().toLowerCase();

  const parts = email.split("@");
  if (parts.length !== 2) return null;

  const [local, domain] = parts;

  if (!local || !domain) return null;

  // Gmail normalization
  if (domain === "gmail.com") {
    let normalizedLocal = local.replace(/\./g, "");
    normalizedLocal = normalizedLocal.split("+")[0];
    email = `${normalizedLocal}@gmail.com`;
  }

  return email;
};
