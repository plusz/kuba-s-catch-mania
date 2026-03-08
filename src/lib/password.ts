/** Simple obfuscation for the unlock password */
// "kostek" encoded as char codes shifted by +3
const ENCODED = [110, 114, 118, 119, 104, 110]; // k=107+3, o=111+3, s=115+3, t=116+3, e=101+3, k=107+3

export function verifyPassword(input: string): boolean {
  const normalized = input.trim().toLowerCase();
  const decoded = ENCODED.map((c) => String.fromCharCode(c - 3)).join('');
  return normalized === decoded;
}
