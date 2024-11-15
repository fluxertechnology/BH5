const profileMission = function (
  state = {
    checkin: [
      {
        id: 1,
        name: "連續簽到",
        category: 1,
        description: "0-0-0-0-0-0",
        reward_type: 1,
        reward_quantity: 1,
        completion_count: 1,
        time_limit: 0,
        create_time: "2023-07-28 18:23:30",
        is_completion: 0,
        has_completion_count: 0,
        signin: [
          {
            day: 1,
            sign: "0",
            completion: 0,
            is_show: 0,
          },
          {
            day: 2,
            sign: "0",
            completion: 0,
            is_show: 0,
          },
          {
            day: 3,
            sign: "0",
            completion: 0,
            is_show: 0,
          },
          {
            day: 4,
            sign: "0",
            completion: 0,
            is_show: 0,
          },
          {
            day: 5,
            sign: "0",
            completion: 0,
            is_show: 0,
          },
          {
            day: 6,
            sign: "0",
            completion: 0,
            is_show: 0,
          },
        ],
      },
    ],
    weekly: [],
    newbie: [],
  },
  action
) {
  switch (action.type) {
    case "INIT_PROFILEMISSION":
      return action.data;
    case "CHECK_IN_PROFILEMISSION":
      state.checkin[0].signin[action.index].completion = 1;
      state.checkin[0].signin[action.index].is_show = 0;
      return state;
    case "RECEIVE_PROFILEMISSION":
      let find = state[action.name].find((item) => item.id === action.missionId);
      find.is_completion = 2;
      return state;
    default:
      return state;
  }
};

export default profileMission;
