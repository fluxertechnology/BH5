
import { pageUrlConstants } from "@/lib/constants";
import Card from "@/components/games/Card";
import LinkComponent from "@/components/common/LinkComponent";
import useMediaQuery from "@/hooks/useMediaQuery";

const { vendor } = pageUrlConstants;
const FeaturedCard = ({
  data,
  goldFrame = false,
  disabledPrice = false,
  type,
  style = {},
}) => {
  const { isMobile } = useMediaQuery();
  return (
    <LinkComponent
      className="link_container"
      key={data.title}
      routes={{
        name: vendor.pages.vendorGoods.name + data.title,
        path: vendor.pages.vendorGoods.path,
        dynamic: {
          goodsId: data.id,
        },
      }}
    >
      <div
        style={{
          padding: !goldFrame && "0.1rem",
          ...style
          // width: isMobile && window.innerWidth / (goldFrame ? 3.5 : 4),
        }}
      >
        <Card
          data={data}
          className=""
          goldFrame={goldFrame}
          disabledPrice={disabledPrice}
        />
      </div>
    </LinkComponent>
  );
};
export default FeaturedCard;
