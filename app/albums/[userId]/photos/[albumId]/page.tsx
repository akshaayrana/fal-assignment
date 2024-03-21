"use client";
import Loader from "@/components/Loader";
import Title from "@/components/Title";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface IPhotos {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const Photos = ({ params }: any) => {
  const { albumId } = useParams();
  const [userPhotos, setUserPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const url = "https://jsonplaceholder.typicode.com/photos";
      const res = await fetch(url);
      const result = await res.json();
      const data = result.filter(
        (item: IPhotos) => item.albumId.toString() == albumId
      );
      setUserPhotos(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);
  return (
    <div>
      <Title text="Photos" />
      {loading ? (
        <Loader />
      ) : (
        <ul
          className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 md:gap-5"
          role="listitem"
        >
          {userPhotos.map((photo: IPhotos) => (
            <li
              className="bg-white rounded-lg border p-3 relative"
              key={photo.id}
            >
              <Link href={photo.url} target="_blank">
                <div className="h-40 w-full relative">
                  <Image
                    src={photo.thumbnailUrl}
                    style={{ objectFit: "cover" }}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={photo.title}
                    priority={false}
                    role="img"
                  />
                </div>
                <h4 className="text-sm font-medium mt-3">{photo.title}</h4>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {error && error}
    </div>
  );
};

export default Photos;
