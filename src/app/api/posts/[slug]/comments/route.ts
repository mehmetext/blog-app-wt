export async function GET() {
  const comments = [
    {
      id: "1",
      content: "Harika bir yazı olmuş!",
      postId: "1",
      authorName: "Anonim",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      content: "Çok faydalı bilgiler var, teşekkürler.",
      postId: "1",
      authorName: "Anonim",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return Response.json({ data: comments });
}

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
