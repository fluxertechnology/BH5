import useMediaQuery from "@/hooks/useMediaQuery";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import NovelCard from "@/components/common/NovelCard";
import Grid from "@mui/material/Grid";

const ShowItem = ({ list, type }) => {
  const { isMobile } = useMediaQuery();
  const isVideo = ["animated", "video"].includes(type);
  return (
    <>
      {isMobile ? (
        <div className="g-flex g-overflow-auto g-flex-nowrap gap-1">
          {list.map((data) => {
            if (type === "novel") {
              return (
                <div
                  style={{ flex: `0 0 ${isVideo ? "50%" : "32%"}` }}
                  key={data.id}
                >
                  <NovelCard data={data} total_view_show />
                </div>
              );
            } else {
              return (
                <div
                  style={{ flex: `0 0 ${isVideo ? "50%" : "32%"}` }}
                  key={data.id}
                >
                  <CoverCubeItem data={data} type={type} total_view_show />
                </div>
              );
            }
          })}
        </div>
      ) : (
        <Grid container direction="row" alignItems="center" spacing={1}>
          {list.map((data) => {
            if (type === "novel") {
              return (
                <Grid item md={3} xs={4} lg={3} key={data.id}>
                  <NovelCard data={data} total_view_show />
                </Grid>
              );
            } else {
              return (
                <Grid item md={3} xs={4} lg={3} key={data.id}>
                  <CoverCubeItem data={data} type={type} total_view_show />
                </Grid>
              );
            }
          })}
        </Grid>
      )}
    </>
  );
};
export default ShowItem;
