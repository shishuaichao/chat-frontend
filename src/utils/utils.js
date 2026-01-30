

export const getSessionKey = (arr) => {
    let ids = arr.sort((a, b) => a - b)
    return ids.join('_')
}
