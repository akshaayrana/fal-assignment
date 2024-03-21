"use client";

import Title from "@/components/Title";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface IAlbum {
  userId: number;
  id: number;
  title: string;
}

const Albums = () => {
  const { userId } = useParams();
  const [userAlbums, setUsersAlbums] = useState([]);
  const [error, setError] = useState("");

  const fetchUserAlbums = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/albums";
      const res = await fetch(url);
      const result = await res.json();
      const data = result.filter(
        (item: IAlbum) => item.userId.toString() == userId
      );
      setError("");
      setUsersAlbums(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch");
    }
  };

  useEffect(() => {
    fetchUserAlbums();
  }, []);
  return (
    <div>
      <Title text="Albums" />
      <ul
        className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5"
        role="listitem"
      >
        {userAlbums.map((album: IAlbum) => (
          <li className="bg-white border rounded-lg" key={album.id}>
            <Link href={`/albums/${userId}/photos/${album.id}`}>
              <div className="flex items-center justify-center overflow-hidden">
                <Image
                  src="/folder.svg"
                  width={50}
                  height={50}
                  role="img"
                  alt={album.title}
                />
                <h3 className="grow pl-2 truncate">{album.title}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {error && error}
    </div>
  );
};

export default Albums;
