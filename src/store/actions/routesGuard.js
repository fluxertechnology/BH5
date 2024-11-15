/**
 * @description block state change
 *
 * @param {boolean} blockIn
 * @return {*} 
 */
export const blockStateAction = (blockIn) => {
  return {
    type: "LOGIN_CHECK",
    blockIn
  }
}