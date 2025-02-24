import { forwardRef } from "react";
import styled from "styled-components";
import { InlineShareButtons } from "sharethis-reactjs";

import { downloadPage } from "@/lib/constants";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext } from "@/store";

const InlineShareButton = forwardRef((props, ref) => {
  const { state } = useGlobalContext();

  const { isMobile } = useMediaQuery();
  const share_ma = state.user.share_ma;
  const { show_total = false } = props;
  const shareTip =
    "B次元真的超好看！看看我在上面发现的" +
    "\n\n立刻免费成为B次元的小伙伴" +
    (share_ma ? "，输入我的邀请码" + share_ma : "") +
    "\n";
  return (
    <InlineShareButtonElement>
      <InlineShareButtons
        ref={ref}
        config={{
          alignment: "left", // alignment of buttons (left, right)
          color: "social", // set the color of buttons (social, white)
          enabled: true, // show/hide buttons (true, false)
          font_size: 16, // font size for the buttons
          hide_desktop: false, // hide buttons on desktop (true, false)
          labels: isMobile ? "null" : "cta", // button labels (cta, counts, null)
          language: "en", // which language to use (see LANGUAGES)
          min_count: 0, // hide react counts less than min_count (INTEGER)
          networks: [
            // which networks to include (see SHARING NETWORKS)
            "facebook",
            "twitter",
            "telegram",
            "wechat",
            // "whatsapp",
          ],
          padding: 12, // padding within buttons (INTEGER)
          radius: 4, // the corner radius on each button (INTEGER)
          show_total: show_total, // show/hide the total share count (true, false)
          show_mobile: true, // show/hide the buttons on mobile (true, false)
          show_toggle: true, // show/hide the toggle buttons (true, false)
          size: 30, // the size of each button (INTEGER)
          top: typeof window !== 'undefined' ? (window.innerHeight / 3) : 360, // offset in pixels from the top of the page
          // OPTIONAL PARAMETERS
          url: downloadPage[1], // (defaults to current url)
          image: "https://bbacgn.com/logo192.png", // (defaults to og:image or twitter:image)
          description: shareTip, // (defaults to og:description or twitter:description)
          title: shareTip, // (defaults to og:title or twitter:title)
          subject: "B次元为最强的爆款ACG绅士动漫软件", // (only for email sharing)
          message: shareTip, // (only for email sharing)
          username: "custom twitter handle", // (only for twitter sharing)
        }}
      />
    </InlineShareButtonElement>
  );
});
export default InlineShareButton;
export const InlineShareButtonElement = styled.div`
  /*  */
  .st-remove-label {
    display: inline-block !important;
    @media (min-width: 899px) {
      display: inline-block !important;
    }
  }
  .st-label {
    @media (min-width: 1024px) {
      display: inline-block !important;
    }
    @media (min-width: 899px) {
    }
  }
`;
