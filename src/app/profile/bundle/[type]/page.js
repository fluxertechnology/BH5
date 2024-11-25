"use client";
import { useParams } from "next/navigation";
import ProfileBundleCoupon from "@/components/profile/bundle/Coupon";

function ProfileMyCollectType() {
  const type = useParams().type;

  return (
    <>
        {type === "coupon" && <ProfileBundleCoupon />}
    </>
  );
}

export default ProfileMyCollectType;
