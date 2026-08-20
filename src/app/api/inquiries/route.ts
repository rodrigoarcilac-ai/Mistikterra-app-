import { NextResponse } from "next/server";
import { listInquiries, saveInquiry, validateInquiry } from "@/lib/inquiries";

export async function GET() {
  return NextResponse.json({ inquiries: listInquiries() });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const result = validateInquiry((payload ?? {}) as Record<string, unknown>);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const inquiry = saveInquiry(result.value);
  return NextResponse.json({ inquiry }, { status: 201 });
}
