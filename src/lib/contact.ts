import { PROFILE } from "@/data/profile";

/** Indonesian local numbers (0812...) become international (62812...) for wa.me. */
export function toWhatsAppNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

export const CONTACT = {
  email: PROFILE.email,
  emailHref: `mailto:${PROFILE.email}`,
  phone: PROFILE.phone,
  whatsappHref: `https://wa.me/${toWhatsAppNumber(PROFILE.phone)}`,
};
