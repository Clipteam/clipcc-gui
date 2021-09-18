const asyncLibrary = callback => {
    let data = null;
    return () => {
        if (data) return data;
        return callback()
            .then(mod => (data = mod.default));
    };
};

export const getBackdropLibrary = asyncLibrary(
    () => import('./backdrops.json')
);
export const getCostumeLibrary = asyncLibrary(
    () => import('./costumes.json')
);
export const getSoundLibrary = asyncLibrary(
    () => import('./sounds.json')
);
export const getSpriteLibrary = asyncLibrary(
    () => import('./sprites.json')
);
