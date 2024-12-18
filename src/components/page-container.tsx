import React from "react";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 container flex flex-col gap-y-10">{children}</div>
  );
}
