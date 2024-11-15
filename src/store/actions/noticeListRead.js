/**
 * @description set notice data
 * 
 * @param { Number } noticeId
 * @return {*} 
 */
export const ReadNotice = (noticeId) => {
  return {
    type: "READ_NOTICE",
    noticeId
  }
}