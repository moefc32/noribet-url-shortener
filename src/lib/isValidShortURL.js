export default function isValidShortURL(input) {
    if (input === '') return true;
    return /^[A-Za-z0-9]+$/.test(input);
}
