export function getDisplayNameAvatar(displayName:string) {
    const parts = displayName.split(" ");
    if (parts.length === 2) {
        return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
    } else {
        return parts[0].charAt(0).toUpperCase();
    }
}