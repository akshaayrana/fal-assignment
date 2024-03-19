"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const AlbumLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  const breadcrumb = [{ name: "Home", url: "/" }];
  pathNames.forEach((item, index) => {
    if (index % 2 === 0) {
      breadcrumb.push({
        name: item,
        url: `/${item}/${pathNames[index + 1]}`,
      });
    }
  });

  return (
    <div>
      {breadcrumb.map((path, index) => {
        return (
          <Link href={path.url} className="capitalize" key={index}>
            {path.name}
            {index + 1 < breadcrumb.length && <span>&nbsp;&gt;&nbsp;</span>}
          </Link>
        );
      })}
      {children}
    </div>
  );
};

export default AlbumLayout;
