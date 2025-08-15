const navbarReducer = function(state = {}, action) {
	switch (action.type) {
		case "INIT_NAVBAR":
			const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
			return {
				...{
					isPlaceholder: false,
					clickSearch: (e) => e.stopPropagation(),
					clickAvatar: () => { },
					clickNew: () => { },
					newNotice: 0,
					clickHome: () => { },
					toPaymentPage: () => { },
					mainHeight: 72,
					// subHeight: 66.7,
          subHeight: 0,
					subFontSize: 20,
					bottomNavHeight: 88,
					fixed: true,
					show: true,
					isShowFooter: true,
					isShowSearch: false,
					isShowMore: false,
					dialogType: null,
					customComponent: () => false,
					prependComponent: () => <></>,
					appendComponent: () => <></>,
				},
				mainHeight: isMobile ? 60 : 72,
				// subHeight: isMobile ? 65 : 66.7,
        subHeight: 0,
				subFontSize: isMobile ? 16 : 20,
				...action.data,
			};

		case "UPDATE_NAVBAR":
			state[action.key] = action.data;
			return state;

		case "SWITCH_NAVBAR":
			if (action.data.isMobile) {
				return {
					...state,
					mainHeight: 60,
					// subHeight: 65,
          subHeight: 0,
					subFontSize: 16,
				};
			}
			return {
				...state,
				mainHeight: 72,
				// subHeight: 66.7,
        subHeight: 0,
				subFontSize: 20,
			};

		case "RESET_NAVBAR":
			return {
				isPlaceholder: false,
				clickSearch: (e) => e.stopPropagation(),
				clickAvatar: () => { },
				clickNew: () => { },
				newNotice: 0,
				clickHome: () => { },
				toPaymentPage: () => { },
				mainHeight: 72,
				// subHeight: 66.7,
        subHeight: 0,
				subFontSize: 20,
				bottomNavHeight: 88,
				fixed: true,
				show: true,
				isShowFooter: true,
				isShowSearch: false,
				isShowMore: false,
				customComponent: () => false,
				prependComponent: () => <></>,
				appendComponent: () => <></>,
			};

		case "UPDATE_POPUP_TYPE":
			return {
				...state,
				dialogType: action.data.popupType,
			};

		default:
			return state;
	}
};

export default navbarReducer;
