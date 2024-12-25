import React from "react";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 container flex flex-col gap-y-10 sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl">
      {children}
    </div>
  );
}
