export async function DELETE(_: Request, { params }: { params: { slug: string; id: string } }) {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const profiles = JSON.parse(data);
    const profile = profiles.find((p: any) => p.slug === params.slug);
  
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  
    profile.comments = profile.comments?.filter((c: any) => c.id !== params.id);
  
    await fs.writeFile(FILE_PATH, JSON.stringify(profiles, null, 2));
    return NextResponse.json({ success: true });
  }
  