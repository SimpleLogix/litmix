// takes a number and returns a human-readable string
// 18,123,456 => 18.1m
// 123,456 => 123k 
export const stringifyNum = (num: number) => {
    const suffix = num < 1000 ? '' : num < 1000000 ? 'k' : 'm';
    const divisor = num < 1000 ? 1 : num < 1000000 ? 100 : 1000000;
    let result = (num / divisor).toFixed(1);

    if (result.endsWith('.0')) {
        result = result.slice(0, -2);
    }

    return result + suffix;
}