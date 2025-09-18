import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

// Ensure this API route runs in the Node.js runtime (not Edge), so process.env is available reliably
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { from, subject, message } = await req.json();

    if (!from || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("contact_messages")
      .insert({ from_email: from, subject, message });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return NextResponse.json({
    ok: true,
    env: {
      hasUrl,
      hasKey,
      urlHost: url ? (() => { try { return new URL(url).host; } catch { return null; } })() : null,
    },
  });
}


