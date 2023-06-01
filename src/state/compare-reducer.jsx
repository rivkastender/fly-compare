import cloneDeep from "lodash/cloneDeep";

export const CompareAction = {
  ADD: "ADD",
  TOGGLE: "TOGGLE",
  REMOVE: "REMOVE",
};

export const compareReducer = (state, action) => {
  switch (action.type) {
    case CompareAction.ADD: {
      return { compare: [...state.compare, action.compare] };
    }
    case CompareAction.TOGGLE: {
      const newCompares = cloneDeep(state.compare);
      const updateCompare = newCompares.find(
        (x) =>
          x.flightinfo.ppn_contract_bundle ===
          action.compare.flightinfo.ppn_contract_bundle
      );
      updateCompare.isChecked = !updateCompare.isChecked;

      if (!updateCompare.isChecked) {
        const index = newCompares.indexOf(updateCompare);
        newCompares.splice(index, 1);
      }

      return {
        ...state,
        compare: newCompares,
      };
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
  }
};
