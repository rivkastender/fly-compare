import cloneDeep from "lodash/cloneDeep";

export const CompareAction = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  FIND: "FIND",
  SET: "SET",
};

export const compareReducer = (state, action) => {
  switch (action.type) {
    case CompareAction.ADD: {
      const newCompare = [...state.compare, action.compare];
      return { ...state, compare: newCompare };
    }
    case CompareAction.REMOVE: {
      const newState = cloneDeep(state.compare);
      const findState = newState.find(
        (x) =>
          x.flightinfo.ppn_contract_bundle ===
          action.compare.flightinfo.ppn_contract_bundle
      );
      const index = newState.indexOf(findState);
      if (index !== -1) {
        newState.splice(index, 1);
      }
      return {
        ...state,
        compare: newState,
      };
    }

    case CompareAction.FIND: {
      const isMatching = state.compare.some(
        (item) =>
          item.flightinfo.ppn_contract_bundle ===
          action.flightinfo.ppn_contract_bundle
      );

      return {
        ...state,
        isMatching: isMatching,
      };
    }

    case CompareAction.SET: {
      const newSearch = {
        search: action.search.searchby,
        to: action.search.to,
        from: action.search.from,
        depart: action.search.depart,
        return: action.search.return,
        class: action.search.class,
        adults: action.search.adults,
        children: action.search.children,
      };
      return { ...state, search: newSearch };
    }
  }
};
