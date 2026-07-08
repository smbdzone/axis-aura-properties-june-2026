import { NextResponse } from "next/server";
import { getDeveloperById } from "@/components/data/developers";
import { getProjectsByDeveloperId } from "@/components/data/projects";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const developer = getDeveloperById(id);

  if (!developer) {
    return NextResponse.json({ error: "Developer not found" }, { status: 404 });
  }

  const projects = getProjectsByDeveloperId(id);

  return NextResponse.json({
    developer: {
      id: developer.id,
      name: developer.name,
    },
    projects,
  });
}
