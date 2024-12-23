export async function POST(request: Request) {
  const body = await request.json();

  const comment = {
    id: Math.random().toString(),
    content: body.content,
    postId: "1",
    authorName: body.authorName || "Anonim",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return Response.json({ data: comment });
}
