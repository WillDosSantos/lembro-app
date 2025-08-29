import REGISTRY_ABI from "@/abis/MemorialRegistry.json";
import BADGES_ABI from "@/abis/RemembranceBadges.json";

export const REGISTRY_ADDR = process.env.NEXT_PUBLIC_MEMORIAL_REGISTRY as `0x${string}`;
export const BADGES_ADDR   = process.env.NEXT_PUBLIC_REMEMBRANCE_BADGES as `0x${string}`;

export { REGISTRY_ABI, BADGES_ABI };