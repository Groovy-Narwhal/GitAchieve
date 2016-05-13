export default (chosenWeapons = {}, action) => {
  switch (action.type) {
    case 'CHOOSE_WEAPON':
      return action.weapon;
    default:
      return chosenWeapons;
  }
};
