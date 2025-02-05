export default function isValidShortURL(input) {
    return /^[A-Za-z0-9]+$/.test(input);
}
