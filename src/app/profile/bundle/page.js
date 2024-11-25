"use client";
import { useParams } from "next/navigation";
import ProfileBundleReward from "@/components/profile/bundle/Reward";

function ProfileMyCollectType() {
  const type = useParams().type;

  return (
    <>
        <ProfileBundleReward />
    </>
  );
}

export default ProfileMyCollectType;
