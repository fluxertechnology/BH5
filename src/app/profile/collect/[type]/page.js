"use client";
import { useParams } from "next/navigation";
import ProfileMyCollectComic from "@/components/profile/collect/Comic";
import ProfileMyCollectAnime from "@/components/profile/collect/Anime";
import ProfileMyCollectVideo from "@/components/profile/collect/Video";
import ProfileMyCollectNovel from "@/components/profile/collect/Novel";
import ProfileMyCollectPhoto from "@/components/profile/collect/Photo";

function ProfileMyCollectType() {
  const type = useParams().type;

  return (
    <>
        {type === "comic" && <ProfileMyCollectComic /> }
        {type === "anime" && <ProfileMyCollectAnime />}
        {type === "video" && <ProfileMyCollectVideo />}
        {type === "novel" && <ProfileMyCollectNovel />}
        {type === "photo" && <ProfileMyCollectPhoto />}
    </>
  );
}

export default ProfileMyCollectType;
