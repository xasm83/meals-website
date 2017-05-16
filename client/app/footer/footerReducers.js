export const isAdmin = (isAdmin = false, action) => {
    switch (action.type) {
        case 'FOOTER_SET_ADMIN':
            console.log("admin" + action.isAdmin);
            return action.isAdmin;
        default:
            return isAdmin;
    }
};
