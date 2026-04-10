export function mapValidationErrors(data: any): Record <string, string> {
    if (!data || typeof data !== "object") return {};
    if(data.error) {
        return {general: data.error}
    }
    return data;
}