const initialState = {

    culture: "en-US"

}

const regionReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'CHANGE_CULTURE': return {
            ...state,
            culture: action.culture
        }

        default: return state;
    }
}

export default regionReducer;

