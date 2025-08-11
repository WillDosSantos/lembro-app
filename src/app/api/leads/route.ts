import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const lead = {
    id: randomUUID(),
    profileId: body.profileId,
    providerId: body.providerId,
    name: body.name,
    email: body.email,
    phone: body.phone || "",
    message: body.message || "",
    createdAt: new Date().toISOString(),
  };

  // TODO: persist to your storage (file/DB). For now, log:
  console.log("New lead", lead);

  // TODO: notify provider (email or webhook). Example webhook:
  // await fetch(process.env.PROVIDER_WEBHOOK_URL!, { method:'POST', body: JSON.stringify(lead) })

  return NextResponse.json({ ok: true, leadId: lead.id });
}
