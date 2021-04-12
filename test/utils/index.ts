export function isEmpty(value: any): boolean {
    return Array.isArray(value) ? value.length <= 0 : !value;
}
