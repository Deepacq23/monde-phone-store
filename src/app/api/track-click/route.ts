import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let productId: unknown;

  try {
    const body = await request.json();
    productId = body?.product_id;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (typeof productId !== "string" || productId.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing product_id" }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    // No database configured yet (local/demo mode) — accept silently.
    return NextResponse.json({ ok: true, tracked: false });
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("clicks").insert({ product_id: productId });
    if (error) throw error;
    return NextResponse.json({ ok: true, tracked: true });
  } catch (err) {
    console.error("track-click: failed to log click —", err);
    // Never block the WhatsApp redirect on analytics failure.
    return NextResponse.json({ ok: true, tracked: false });
  }
}
