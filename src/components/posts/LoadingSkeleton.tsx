import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import styled from "styled-components";
import { Waypoint } from 'react-waypoint';
import { Theme } from '@emotion/react';

type Props = {
  height?: string,
  children: ReactNode
}

const LoadingSkeleton: FC<Props> = ({
  height = '100%',
  children
}) => {
  const [enter, setEnter] = useState(false);
  const handleWaypointEnter = () => {
    setEnter(true);
    console.log('Waypoint entered!'); // Debug log
  }

  return (
    // <Waypoint
    //   onEnter={handleWaypointEnter}
    // >
    //   {!enter ? (
    //     <LoadingSkeletonElement>
    //       <div
    //         className="loading-skelton"
    //         style={{
    //           paddingBottom: height,
    //         }}
    //       />
    //     </LoadingSkeletonElement>
    //   ): (children)
    //   }
    // </Waypoint>
    <Waypoint onEnter={handleWaypointEnter}>
      <div style={{width:"100%"}}>
        {!enter ? (
          <LoadingSkeletonElement>
            <div
              className="loading-skeleton"
              style={{
                paddingBottom: height,
              }}
            />
          </LoadingSkeletonElement>
        ) : (
          children
        )}
      </div>
    </Waypoint>
  );
};

export default LoadingSkeleton;


const LoadingSkeletonElement = styled.div`
  /*  */
  width: 100%;

  @keyframes pulse-animation {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  .loading-skelton {
    width: 100%;
    animation: pulse-animation 1.5s ease-in-out 0.5s infinite;
    background-color: #e2e8f1;
  }
`;
